# Copyright (c) 2024, Priyansh and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
	columns, data = [], []
	columns=get_columns()
	cs_data=get_cs_data(filters)
	if not cs_data:
		frappe.msgprint("No records found")
		return columns,cs_data
	data=[]
	for d in cs_data:
		row=frappe._dict({
			'expense_type':d.expense_type,
			'expense_name':d.expense_name,
			'date':d.date,
			'amount':d.amount
		})
		data.append(row)
	chart=get_chart_data(data)
	return columns, data

def get_chart_data(data):
	if not data:
		return None
	print(data)

def get_columns():
	return [
		{
			"fieldname":"expense_type",
			"label":("Expense Type"),
			"fieldtype":"Data"
		},
		{
			"fieldname":"expense_name",
			"label":("Expense Name"),
			"fieldtype":"Data"
		},
		{
			"fieldname":"amount",
			"label":("Amount"),
			"fieldtype":"Float"
		},
		{
			"fieldname":"date",
			"label":("Date"),
			"fieldtype":"Date"
		}
	]

def get_cs_data(filters):
	conditions=get_conditions(filters)
	data=frappe.get_all(
		doctype="Expense",
		fields=["expense_type","expense_name","amount","date"],
		filters=conditions
	)
	return data

def get_conditions(filters):
	conditions={}
	for key,value in filters.items():
		if(filters.get(key)):
			conditions[key]=value

	return conditions