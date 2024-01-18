# Copyright (c) 2024, Priyansh and contributors
# For license information, please see license.txt

import datetime
import frappe
from frappe.model.document import Document
from frappe.utils import days_diff
class Income(Document):
    def validate(self):
        days_interval = days_diff(datetime.date.today(), self.date)
        try:
            if days_interval < 0 or days_interval > 60:
                frappe.throw("Selected date is not allowed")
        except frappe.DataError as e:
            frappe.throw(str(e))

        try:
            if int(self.amount) <= 0:
                frappe.throw("Invalid amount")
        except frappe.DataError as e:
            frappe.throw(str(e))


