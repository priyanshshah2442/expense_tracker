# Copyright (c) 2024, Priyansh and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Finances(Document):
   
    def before_save(self):
        rows = self.get("details")
        
        # frappe.errprint(details)
        total_balance = 0
        for row in rows:
            row.balance = row.income - row.expenditure - row.saving
            total_balance += row.balance
            
        self.set("total_balance", total_balance)
 
    
         
         

