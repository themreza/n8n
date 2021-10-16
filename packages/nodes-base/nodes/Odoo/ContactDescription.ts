import {
	INodeProperties,
} from 'n8n-workflow';

export const contactOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact.',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const contactFields = [
	/* -------------------------------------------------------------------------- */
	/*                                 contact:create                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'create',
				],
				resource: [
					'contact',
				],
			},
		},
		default: '',
		description: 'The name for the new contact.',
	},
	/* -------------------------------------------------------------------------- */
	/*                                 contact:delete                             */
	/* -------------------------------------------------------------------------- */


	/* -------------------------------------------------------------------------- */
	/*                                 contact:get                                */
	/* -------------------------------------------------------------------------- */
] as INodeProperties[];
