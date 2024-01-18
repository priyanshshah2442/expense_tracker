// Copyright (c) 2024, Priyansh and contributors
// For license information, please see license.txt

frappe.ui.form.on("Finances", {

	refresh(frm) {
       
        frm.add_custom_button(__('Load Data'), function() {
            // Call the server-side function
           fetch_details(frm)
        });
       
        
	},
    before_load(frm){
        fetch_details(frm)
        // console.log(frm.doc.details)
    }
    
   
});
function fetch_details(frm){
    frm.call({
        method: 'expense_tracker.expense_tracker.api.methods.fetch_finances',
        args:{
            source:0
        },
        callback: function(response) {
            frm.set_value('details',response.message.data)
            frm.save()
            console.log(frm.doc.details)
            console.log(response)
        }
    });
}