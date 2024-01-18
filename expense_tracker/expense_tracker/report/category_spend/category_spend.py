# Copyright (c) 2024, Priyansh and contributors
# For license information, please see license.txt
import frappe


def execute(filters=None):
    columns = get_columns()
    data = []

    expense_dict = get_expense_dict(filters)
    # frappe.errprint(expense_dict)
    filtered_data = []
    if filters.get('date'):
        #  expense_dict=get_expense_dict(filters.date)
         frappe.errprint(filters)
  
    for d in expense_dict:
        # frappe.errprint(expense_dict[d])
        cat_dict = expense_dict[d]

        for key, value in cat_dict.items():
            row = frappe._dict({
                'expense_type': d,
                'expense_name': key,
                'amount': value
            })
            filtered_data.append(row)

    if filters.get('expense_type'):
        data = []
        for i in filtered_data:
            # frappe.errprint(f"hi : {i}")
            if i['expense_type'] == filters['expense_type']:
                data.append(i)

        return columns, data

    # frappe.errprint(filtered_data)

    return columns, filtered_data


def get_columns():
    return [
        {"fieldname": "expense_type", "label": "Expense Type", "fieldtype": "Data"},
        {"fieldname": "expense_name", "label": "Expense Name", "fieldtype": "Data"},
        {"fieldname": "amount", "label": "Amount", "fieldtype": "Float"},
    ]


def get_expense_dict(filters=None):
    frappe.errprint(filters)
    list_of_expenses = []
    if filters.get("date"):
        list_of_expenses = frappe.get_all(
            "Expense",
            filters=[["date", "between", filters["date"]]],
            fields=["expense_type", "expense_name", "amount"],
        )
    else:
        list_of_expenses = frappe.get_all(
            "Expense", fields=["expense_type", "expense_name", "amount"]
        )

    expense_dict = {}

    for expense in list_of_expenses:
        expense_type = expense["expense_type"]
        expense_name = expense["expense_name"]
        amount = expense["amount"]

        if expense_type not in expense_dict:
            expense_dict[expense_type] = {}

        if expense_name not in expense_dict[expense_type]:
            expense_dict[expense_type][expense_name] = 0

        expense_dict[expense_type][expense_name] += amount

    return expense_dict
