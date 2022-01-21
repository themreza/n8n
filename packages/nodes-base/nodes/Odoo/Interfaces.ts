/*
	Odoo Data Types

	References:
	https://www.odoo.com/documentation/14.0/developer/reference/addons/orm.html
	https://github.com/odoo/odoo/blob/04db62a45f42aba72da7d36b94b3c5d03db37e20/odoo/fields.py#L97
*/

export interface IOdooField {
	name: string,
	type: string,
	label: string,
	required: boolean,
	readonly: boolean,
	stored: boolean,
	sortable: boolean
}

export interface IOdooModel {
	name: string,
	description: string,
	fields: IOdooField[]
}
