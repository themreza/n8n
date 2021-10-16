import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

import {
	contactFields,
	contactOperations
} from './ContactDescription';

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
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
				required: true,
				description: 'Resource to consume.',
			},
			...contactOperations,
			...contactFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [[]];
	}
}
