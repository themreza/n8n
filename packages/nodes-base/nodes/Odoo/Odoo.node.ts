import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject, ILoadOptionsFunctions,
	INodeExecutionData, INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	recordOperations,
	recordFields
} from './descriptions';
import { odooApiRequest } from './GenericFunctions';

export class Odoo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Odoo',
		name: 'odoo',
		icon: 'file:odoo.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume Odoo API',
		defaults: {
			name: 'Odoo',
			color: '#714B67',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'odooApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Record',
						value: 'record',
					},
				],
				default: 'record',
				required: true,
				description: 'Resource to consume',
			},
			...recordOperations,
			...recordFields,
		],
	};


	methods = {
		loadOptions: {
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const responseData = await odooApiRequest.call(
					this, 'object', 'execute', ['ir.model', 'search_read', [], ['name', 'model']]
				);
				for (const result of responseData.result) {
					returnData.push({
						name: result.name,
						value: result.model
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [[]];
	}
}
