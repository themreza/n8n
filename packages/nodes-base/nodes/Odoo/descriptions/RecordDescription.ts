import {
	INodeProperties,
} from 'n8n-workflow';

/*
	Generic Odoo Record
*/

export const recordOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'abstract',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a record',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a record',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a record',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all records',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a record',
			},
		],
		default: 'create',
		description: 'The operation to perform',
	},
] as INodeProperties[];

export const recordFields = [
	// ----------------------------------
	//         All
	// ----------------------------------
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getModels',
		},
		default: '',
		required: true,
		description: 'The model representing an Odoo module',
	},
] as INodeProperties[];
