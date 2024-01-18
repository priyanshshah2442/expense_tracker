// Copyright (c) 2024, Priyansh and contributors
// For license information, please see license.txt

frappe.query_reports["Spending Report"] = {
	"filters": [
		{
			"fieldname":"expense_type",
			"label":__("Expense Type"),
			"fieldtype":"Link",
			"options":"Categories",
			"get_query": function () {
                return {
                    filters: {
                        "is_group": 1,
						"name": ["!=", "Main_Categories"]
                    }
                };
            }
		}
	]
};
