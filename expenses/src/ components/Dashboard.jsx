import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts';
import API from '../axios';
import './Dashboard.css'
const Dashboard = (prop) => {
  const [categoryExpenseChart, setCategoryExpenseChart] = useState([])
  const [expenseType, setExpenseType] = useState([])
  const [val, setVal] = useState('Utilities')
  const [totalSpend, setTotalSpend] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalSavings,setTotalSavings]=useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [expenditureData, setExpenditureData] = useState([])
  const [incomeData, setIncomeData] = useState([])
  const [savingsData, setSavingsData] = useState([])
  const [detailedFinances, setDetailedFinances] = useState([])
  const [range, setRange] = useState(prop.range);
  const [percentSpending,setPercentSpending]=useState([])
  const [percentIncomeSouce,setPercentIncomeSource]=useState([])
  const [percentSavingsField,setPercentSavingsField]=useState([])
  const year=Number(prop.range[0].substring(0,4))
  const month=Number(prop.range[0].substring(5,7))
  const fetchExpenseType = async () => {
    const resp = await API.get(`resource/Categories?filters=[["is_group","=",1],["name","!=","Main_Categories"]]`)
    setExpenseType(resp.data.data)
    // setVal(resp.data.data[0])
    return
  }

  const fetchTotlaSpend = async () => {
    const url = "http://expense.localhost:8000/api/method/frappe.desk.doctype.number_card.number_card.get_result"
    const requestOptions = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        'Authorization': 'token 1438e764b298bac:ecd354c945dd9ba',
      },
      body: new URLSearchParams({
        doc: "{\"name\":\"Total Spend\",\"owner\":\"Administrator\",\"creation\":\"2024-01-08 15:56:09.772311\",\"modified\":\"2024-01-08 16:01:01.034465\",\"modified_by\":\"Administrator\",\"docstatus\":0,\"idx\":3,\"is_standard\":1,\"module\":\"Expense Tracker\",\"label\":\"Total Spend\",\"type\":\"Document Type\",\"function\":\"Sum\",\"aggregate_function_based_on\":\"amount\",\"document_type\":\"Expense\",\"parent_document_type\":\"\",\"report_function\":\"Sum\",\"is_public\":1,\"show_percentage_stats\":1,\"stats_time_interval\":\"Monthly\",\"filters_json\":\"[]\",\"dynamic_filters_json\":\"[]\",\"doctype\":\"Number Card\",\"__last_sync_on\":\"2024-01-09T11:34:29.778Z\"}",
        filters: `[["Expense","date","Between",["${range[0]}","${range[1]}"],false]]`
      }),
      compressed: true,
    }

    let resp = await fetch(url, requestOptions)
    resp = await resp.json()
    // console.log(resp)
    setTotalSpend(resp?.message || 0)

  }
  const fetchFinances = async () => {
    const resp = await API.get('method/expense_tracker.expense_tracker.api.methods.fetch_finances?source=1', {})
    // console.log(resp.data.message.data)
    let arr = resp.data.message.data
    setDetailedFinances(arr);
    setTotalBalance(resp.data.message.total_balance)
    arr = arr.slice(0, 7);
    let reversed_arr = arr.reverse()
    // console.log(reversed_arr)
    let expenditure_arr = [["Month-Year", "Expenditure"]];
    let income_arr = [["Month-Year", "Income"]]
    let savings_arr = [["Month-Year", "Savings"]]
    for (var ele of reversed_arr) {
      expenditure_arr.push([`${ele.month}-${ele.year}`, ele.expenditure])
      income_arr.push([`${ele.month}-${ele.year}`, ele.income])
      savings_arr.push([`${ele.month}-${ele.year}`, ele.saving])
    }
    setExpenditureData(expenditure_arr);
    setIncomeData(income_arr);
    setSavingsData(savings_arr);

  }
  const fetchTotalIncome = async () => {
    const url = "http://expense.localhost:8000/api/method/frappe.desk.doctype.number_card.number_card.get_result"
    const requestOptions = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        'Authorization': 'token 1438e764b298bac:ecd354c945dd9ba',
      },
      body: new URLSearchParams({
        doc: "{\"name\":\"Total Income\",\"owner\":\"Administrator\",\"creation\":\"2024-01-09 16:36:03.937455\",\"modified\":\"2024-01-09 16:36:03.937455\",\"modified_by\":\"Administrator\",\"docstatus\":0,\"idx\":2,\"is_standard\":1,\"module\":\"Expense Tracker\",\"label\":\"Total Income\",\"type\":\"Document Type\",\"function\":\"Sum\",\"aggregate_function_based_on\":\"amount\",\"document_type\":\"Income\",\"parent_document_type\":\"\",\"report_function\":\"Sum\",\"is_public\":1,\"show_percentage_stats\":1,\"stats_time_interval\":\"Monthly\",\"filters_json\":\"[]\",\"dynamic_filters_json\":\"[]\",\"doctype\":\"Number Card\",\"__last_sync_on\":\"2024-01-09T12:46:50.374Z\"}",
        filters: `[["Income","date","Between",["${range[0]}","${range[1]}"],false]]`

      }), compressed: true,
    };

    let resp = await fetch(url, requestOptions);
    resp = await resp.json()
    // console.log(resp)
    setTotalIncome(resp?.message || 0)

  }
  const fetchTotalSavings=async()=>{
    const resp=await API.get(`method/expense_tracker.expense_tracker.api.methods.fetch_total_savings?month=${month}&year=${year}`)
    console.log(resp.data.message[0])
    setTotalSavings(resp.data.message[0].total_amount)
  }
  const fetchPercentageSpending=async()=>{
   
    const resp=await API.get(`method/expense_tracker.expense_tracker.api.methods.get_percentage_spending_per_month?month=${month}&year=${year}`)
    let data=[["Expense Type","Amount"]];
    for(var ele of resp.data.message){
      data.push([ele.expense_type,ele.total_amount])
    }
    setPercentSpending(data);

   
    // console.log(resp.data.message)
  }

  const fetchPercentIncomeSource=async()=>{
    const resp=await API.get(`method/expense_tracker.expense_tracker.api.methods.get_percentage_source_of_income?month=${month}&year=${year}`)
    console.log(resp.data.message)
    let data=[["Source","Amount"]]
    for(var ele of resp.data.message){
      data.push([ele.source,ele.total_amount])
     
    }
    setPercentIncomeSource(data);
  }

  const fetchPercentageSavings=async()=>{
    const resp=await API.get(`method/expense_tracker.expense_tracker.api.methods.get_percentage_savings?month=${month}&year=${year}`)
    console.log(resp.data.message)
    let data=[["Field","Amount"]];
    for(var ele of resp.data.message){
      data.push([ele.field_of_savings,ele.total_amount])
    }
    setPercentSavingsField(data);
  }

  const fetchCategorySpendData = async () => {
    const url = "http://expense.localhost:8000/api/method/frappe.desk.query_report.run";

    const requestOptions = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        'Authorization': 'token 1438e764b298bac:ecd354c945dd9ba',

      },
      body: new URLSearchParams({
        report_name: "Category Spend",
        filters: `{"expense_type":"${val}","date":["${range[0]}","${range[1]}"]}`,
        ignore_prepared_report: "1",
      }),
      compressed: true,
    };
    let resp = await fetch(url, requestOptions)
    resp = await resp.json()
    // console.log(resp.message.columns)
    // console.log(resp.message.result)
    let data = [];
    for (var i of resp.message.result) {
      // console.log(i)
      data.push([i.expense_name, i.amount])
      // console.log(data)
    }
    setCategoryExpenseChart([["Name", "Amount"], ...data])
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setVal(value)
  }
  useEffect(() => {
    fetchExpenseType()
  }, [])
  useEffect(() => {


    fetchCategorySpendData();
    fetchTotlaSpend();
    fetchTotalIncome();
    fetchFinances();
    fetchPercentageSpending();
    fetchPercentIncomeSource();
    fetchPercentageSavings();
    fetchTotalSavings();

  }, [val, range]);
  useEffect(() => {
    setRange(prop.range)
  }, [prop])


  const expenditureLineChartOptions = {
    title: 'Expenditure Over Time (Last 6 Month)',
    // curveType: 'function',
    vAxis: {
      viewWindow: {
        min: 0
      }
    },
    legend: { position: 'bottom' },
  };
  const incomeLineChartOptions = {
    title: 'Income Over Time (Last 6 Month)',
    // curveType: 'function',
    vAxis: {
      viewWindow: {
        min: 0
      }
    },
    legend: { position: 'bottom' },
  };
  const savingsLineChartOptions = {
    title: 'Savings Over Time (Last 6 Month)',
    selectionMode: 'multiple',
    // curveType: 'function',
    vAxis: {
      viewWindow: {
        min: 0
      }
    },
    legend: { position: 'bottom' },
  };

  const categoryPieChartOptions = {
    title: `Analysis Chart for ${prop.range[0]} - ${prop.range[1]}`,
    is3D: true,
  };
  const percentageSpendingPieChartOptions = {
    title: `Spending Chart for ${prop.range[0]} - ${prop.range[1]}`,
    is3D: true,
  };
  const percentageIncomeSourcePieChartOptions = {
    title: `Income Source Chart for ${prop.range[0]} - ${prop.range[1]}`,
    is3D: true,
  };
  const percentageSavingFieldPieChartOptions = {
    title: `Savings/Investment Chart for ${prop.range[0]} - ${prop.range[1]}`,
    is3D: true,
  };

  return (
    <div className='container mt-4'>
      <div className="number-card-holder">

        <div className="number-card ms-4">
          <div><h6 className='text-muted'>Monthly Income</h6></div>
          <div><h3 className='text-success'>{totalIncome}</h3></div>
        </div>
        <div className="number-card ms-4">
          <div><h6 className='text-muted'>Monthly Expenditure</h6></div>
          <div><h3 className='text-danger'>{totalSpend}</h3></div>
        </div>
        <div className="number-card ms-4">
          <div><h6 className='text-muted'>Monthly Savings</h6></div>
          <div><h3 className='text-secondary'>{totalSavings}</h3></div>
        </div>
        <div className="number-card ms-4">
          <div><h6 className='text-muted'>Balance For Month</h6></div>
          <div><h3 className='text-primary'>{totalIncome - totalSpend - totalSavings}</h3></div>
        </div>
        <div className="number-card ms-4">
          <div><h6 className='text-muted'>Total Balance</h6></div>
          <div><h3 className='text-primary'>{totalBalance}</h3></div>
        </div>

      </div>
      <div className="chart-container">
        <div className='chart-holder' >
          <select name="expense_type" className='col' id="ExpenseType" onChange={handleChange} value={val}>
            <option value="" disabled>Select</option>
            {expenseType.map((ele, ind) => {
              return (
                <option value={ele.name} key={ind}>{ele.name}</option>
              )
            })}
          </select>
          <Chart
            chartType="PieChart"
            data={categoryExpenseChart}
            options={categoryPieChartOptions}
            width={'100%'}
            height={'300px'}
            legendToggle
          />

        </div>
        <div className="chart-holder">
        <Chart
            chartType="PieChart"
            data={percentSpending}
            options={percentageSpendingPieChartOptions}
            width={'100%'}
            height={'300px'}
            legendToggle
          />
        </div>
        <div className="chart-holder">
        <Chart
            chartType="PieChart"
            data={percentIncomeSouce}
            options={percentageIncomeSourcePieChartOptions}
            width={'100%'}
            height={'300px'}
            legendToggle
          />
        </div>
        <div className="chart-holder">
        <Chart
            chartType="PieChart"
            data={percentSavingsField}
            options={percentageSavingFieldPieChartOptions}
            width={'100%'}
            height={'300px'}
            legendToggle
          />
        </div>
        <div className="chart-holder">
          <Chart
            chartType="LineChart"
            data={expenditureData}
            options={expenditureLineChartOptions}
            width="100%"
            height="400px"
          />
        </div>
        <div className="chart-holder">
          <Chart
            chartType="LineChart"
            data={incomeData}
            options={incomeLineChartOptions}
            width="100%"
            height="400px"
          />
        </div>
        <div className="chart-holder">
          <Chart
            chartType="LineChart"
            data={savingsData}
            options={savingsLineChartOptions}
            width="100%"
            height="400px"
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard