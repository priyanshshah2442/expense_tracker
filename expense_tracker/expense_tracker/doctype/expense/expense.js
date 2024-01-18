// Copyright (c) 2024, Priyansh and contributors
// For license information, please see license.txt

frappe.ui.form.on("Expense", {
    refresh(frm) {
       
    },
    expense_type:function (frm) {
        // frappe.msgprint(frm.doc)
        const expenseType=frm.doc.expense_type;
        console.log(frm.fields_dict['expense_type'])
        frm.fields_dict['expense_type'].$input.on('change', function() {
            clearExpenseName();
        });
        frm.fields_dict['expense_name'].get_query = function(doc, cdt, cdn) {
                    // Get the selected value from the 'expense_type' field
                    
                    console.log(expenseType)
                    // Set the query filter based on the selected 'expense_type'
                    return {
                        filters: {
                            "parent_categories": expenseType,
                            "is_group": 0 // To only fetch leaf nodes
                        }
                    };
                };
    }
});


function clearExpenseName() {
    cur_frm.set_value('expense_name', ''); 
}