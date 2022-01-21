/*
	Generic Functions & API Communication

	Reference:
	https://www.odoo.com/documentation/14.0/developer/howtos/backend.html#json-rpc-library

	TODO: Add language context and timezone to API
 			  "lang": "hu_HU",
 				"tz": "Europe/Budapest",
*/

import { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-core';

import { CredentialInformation, ICredentialDataDecryptedObject, NodeApiError, NodeOperationError } from 'n8n-workflow';

import { OptionsWithUri } from 'request';

import { v4 as uuid } from 'uuid';

import { get } from 'lodash';

function prepareOptions(
	httpMethod: string = 'POST',
	method: string,
	service: string,
	args: any[],
	secure: CredentialInformation,
	host: CredentialInformation,
	port: CredentialInformation,
	allowUnauthorizedCerts: CredentialInformation,
): OptionsWithUri{
	return {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: {
			'jsonrpc': 2.0,
			'params': {
				'method': method,
				'service': service,
				'args': args
			},
			'id': uuid(),
		},
		uri: `${secure ? 'https' : 'http'}://${host}:${port}/jsonrpc`,
		json: true,
		rejectUnauthorized: !allowUnauthorizedCerts
	};
}

/*
	Logging in to retrieve the user identifier (uid)
	https://www.odoo.com/documentation/14.0/developer/misc/api/odoo.html#logging-in
*/
async function odooApiLogin(
	self: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	credentials: ICredentialDataDecryptedObject,
	forceLogin: boolean = false
) {
	if (credentials.uid !== '' && !forceLogin) {
		return;
	}
	let options: OptionsWithUri = prepareOptions(
		'POST',
		'login',
		'common',
		[
			credentials.database,
			credentials.user,
			credentials.password
		],
		credentials.secure,
		credentials.host,
		credentials.port,
		credentials.allowUnauthorizedCerts
	);
	try {
		const response = await self.helpers.request!(options);
		if (!('error' in response) && 'result' in response) {
			credentials.uid = response.result;
			return;
		}
		// Odoo API error
		throw new NodeApiError(self.getNode(), response, {
			message: get(response, 'error.data.message')
		});
	} catch (error) {
		// Other HTTP error
		throw new NodeApiError(self.getNode(), error);
	}
}

// Generic API Request
export async function odooApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	service: string,
	method: string,
	args: any[],
	retried: boolean = false,
): Promise<any> {
	const credentials = await this.getCredentials('odooApi');
	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}
	await odooApiLogin(this, credentials, retried);
	const combinedArgs = [
		credentials.database,
		credentials.uid,
		credentials.password,
		...args
	];
	let options: OptionsWithUri = prepareOptions(
		'POST',
		method,
		service,
		combinedArgs,
		credentials.secure,
		credentials.host,
		credentials.port,
		credentials.allowUnauthorizedCerts
	);
	try {
		const response = await this.helpers.request!(options);
		if (!('error' in response)) {
			return response;
		}

		// odoo.exceptions.AccessDenied could mean invalid uid, so try once more with login
		if (get(response, 'error.data.name') === 'odoo.exceptions.AccessDenied' && !retried) {
			return await odooApiRequest.call(this, service, method, args, true);
		}

		// Odoo API error
		throw new NodeApiError(this.getNode(), response, {
			message: get(response, 'error.data.message')
		});
	} catch (error) {
		// Other HTTP error
		throw new NodeApiError(this.getNode(), error);
	}
}
