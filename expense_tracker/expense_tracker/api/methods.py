import frappe


@frappe.whitelist()
def fetch_finances(source):
        
        month=['Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec']
        query = """
            SELECT
                MONTH(date) AS Month,
                YEAR(date) AS Year,
                SUM(CASE WHEN type='Expense' THEN amount ELSE 0 END) AS `Total Expenditure`,
                SUM(CASE WHEN type='Income' THEN amount ELSE 0 END) AS `Total Income`,
                SUM(CASE WHEN type='Savings' THEN amount ELSE 0 END) AS `Total Savings`
            FROM (
                SELECT
                    date,
                    amount,
                    'Expense' AS type
                FROM
                    `tabExpense`

                UNION ALL

                SELECT
                    date,
                    amount,
                    'Income' AS type
                FROM
                    `tabIncome`
                    
                 UNION ALL

                  SELECT
                    date,
                    amount,
                    'Savings' AS type
                FROM
                    `tabSavings`   
            ) AS combined_data
            GROUP BY
                MONTH(date), YEAR(date)
            ORDER BY
                Year desc, Month desc;
        """
       
        
        result = frappe.db.sql(query, as_dict=True)
        doc=frappe.get_doc("Finances")
        doc.details=[]
      
        # frappe.errprint(self)
        data=[]
        total_balance=0
        for row in result:
            total_balance+=row['Total Income']-row['Total Expenditure']-row['Total Savings']
            row_data={
            'month':month[row.Month-1],
            'year':row.Year,
            'income':row['Total Income'],
            'expenditure':row['Total Expenditure'],
            'saving':row['Total Savings'],
            'balance':total_balance
		}
            
            data.append(row_data)
            doc.append("details",row_data)
            
            if int(source) == 1:
                 doc.save()
                 
                 
         
       
        return {
             "data":data,
             "total_balance":total_balance
		}
            
@frappe.whitelist()
def get_percentage_spending_per_month(month,year):
     query = '''
        SELECT 
            MONTH(date) as `Month`,
            YEAR(date) as `Year`,
            expense_type, 
            SUM(amount) as total_amount
        FROM 
            `tabExpense`
        WHERE 
            MONTH(date) = %s AND YEAR(date) = %s
        GROUP BY 
            `expense_type`,
            MONTH(date),
            YEAR(date);
    '''
     result=frappe.db.sql(query,(month,year),as_dict=True)
     return result

@frappe.whitelist()
def get_percentage_source_of_income(month,year):
     query = '''
        SELECT 
            MONTH(date) as `Month`,
            YEAR(date) as `Year`,
            source, 
            SUM(amount) as total_amount
           
        FROM 
            `tabIncome`
        WHERE 
            MONTH(date) = %s AND YEAR(date) = %s
        GROUP BY 
            `source`,
            MONTH(date),
            YEAR(date);
    '''
     result=frappe.db.sql(query,(month,year),as_dict=True)
     return result

@frappe.whitelist()
def get_percentage_savings(month,year):
     query = '''
        SELECT 
            MONTH(date) as `Month`,
            YEAR(date) as `Year`,
            field_of_savings, 
            SUM(amount) as total_amount
           
        FROM 
            `tabSavings`
        WHERE 
            MONTH(date) = %s AND YEAR(date) = %s
        GROUP BY 
            `field_of_savings`,
            MONTH(date),
            YEAR(date);
    '''
     result=frappe.db.sql(query,(month,year),as_dict=True)
     return result


@frappe.whitelist()
def fetch_total_savings(month,year):
     query='''
    Select 
        Sum(amount) as total_amount
    From 
        `tabSavings`
    Where
        Month(date)=%s AND YEAR(date)=%s
    
'''
     result=frappe.db.sql(query,(month,year),as_dict=True)
     return result