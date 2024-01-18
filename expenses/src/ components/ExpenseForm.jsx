import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import './ExpenseForm.css'
import API from '../axios';
import { toast, Bounce } from 'react-toastify';

const ExpenseForm = (prop) => {
  let today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  let maxDate = new Date().toISOString().split('T')[0];
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  const minDate = twoMonthsAgo.toISOString().split('T')[0];

  today = `${year}-${month}-${day}`

  // console.log(prop.name)
  const [expenseType, setExpenseType] = useState([])
  const [expenseName, setExpenseName] = useState([])
  const [formData, setFormData] = useState({
    expense_type: '',
    expense_name: '',
    amount: 0,
    date: today,
    mode_of_payment: 'PhonePe',
    remarks: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleAddExpesne = async (e) => {
    e.preventDefault();
    if (formData.expense_type == "") {
      toast.error('Invalid Expense Type', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      return
    }
    if (formData.expense_name == "") {
      toast.error("Invalid Expense Name")
      return
    }
    try {
      const resp = await API.post('resource/Expense', JSON.stringify({
        // docType:'Expense',
        ...formData
      }))
      prop.handleClose("expense");
      toast.success('Entry Added Successfully', {
        position: "bottom-right"
      });
      console.log(resp.data)
    }
    catch (e) {
      toast.error(e.response.data.exception, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error(e);
    }

  }

  const handleEditExpense = async (e) => {
    e.preventDefault();
    if (formData.expense_type == "") {
      toast.error("Invalid Expense Type")
      return
    }
    if (formData.expense_name == "") {
      toast.error("Invalid Expense Name")
      return
    }
    try {
      const resp = await API.put(`resource/Expense/${formData.name}`, JSON.stringify({
        // docType:'Expense',
        ...formData
      }));
      console.log(resp.data)
      prop.handleClose("expense");
      toast.success("Entry Edited Successfully", {
        position: "bottom-right"
      })
    }
    catch (e) {
      toast.error(e.response.data.exception, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error(e.response.data.exception)
    }

  }


  const fetchExpenseType = async () => {
    const resp = await API.get(`resource/Categories?filters=[["is_group","=",1],["name","!=","Main_Categories"]]`)
    // console.log(resp.data.data)
    setExpenseType(resp.data.data)
    return
  }
  const fetchExpenseName = async () => {
    // console.log(formData.expense_type)
    const resp = await API.get(`resource/Categories?filters=[["parent_categories","=","${formData.expense_type}"],["is_group","=",0]]`)
    // console.log(resp.data.data)
    setExpenseName(resp.data.data)
  }
  useEffect(() => {
    if (prop.name != "") {
      const fetchExpenseDetails = async () => {
        let resp = await API.get(`/resource/Expense/${prop.name}`)
        console.log(resp.data.data)
        resp = resp.data.data
        setFormData({
          name: resp.name,
          expense_type: resp.expense_type,
          expense_name: resp.expense_name,
          amount: resp.amount,
          date: resp.date,
          mode_of_payment: resp.mode_of_payment,
          remarks: resp.remarks
        })
      }
      fetchExpenseDetails()
    }
    fetchExpenseType()
  }, [])

  useEffect(() => {
    fetchExpenseName()
  }, [formData.expense_type])
  return (
    <div className="expense-modal">
      <div className="expense-modal-content" key={"modal"}>
        <CloseIcon className='closeBtn' onClick={() => {
          prop.handleClose("expense")
        }} />
        {prop.name == "" ? <h4 className='text-primary mb-4'>Add Expense</h4> : <h4 className='text-primary mb-4'>Edit Expense</h4>}
        <div className='form-container'>
          <div className="form-field row">
            <div className="col"><label htmlFor="ExpenseType">Expense Type</label></div>
            <div className="col">
              <select name="expense_type" className='col' id="ExpenseType" onChange={handleChange} value={formData.expense_type}>
                <option value="" disabled>Select</option>
                {/* <option value="1">Option 1</option>
                <option value="2">Option 2</option> */}
                {expenseType.map((ele, ind) => {
                  return (
                    <option value={ele.name} key={ind}>{ele.name}</option>
                  )
                })}
              </select>
            </div>

          </div>
          <div className="form-field row">
            <div className="col">
              <label htmlFor="ExpenseName">Expense Name</label>
            </div>
            <div className="col">
              <select name="expense_name" id="ExpenseName" onChange={handleChange} value={formData.expense_name}>
                <option value="" disabled>Select</option>
                {
                  expenseName.map((ele, ind) => {
                    return (
                      <option value={ele.name} key={ind}>{ele.name} </option>
                    )
                  })
                }
              </select>
            </div>
          </div>

          <div className="form-field row">
            <div className="col">
              <label htmlFor="date">Expense Date</label>
            </div>
            <div className="col">
              <input type="date" name="date" min={minDate} max={maxDate} value={formData.date} id="date" onChange={handleChange} />
            </div>
          </div>

          <div className="form-field row">
            <div className="col">
              <label htmlFor="amount">Amount</label>
            </div>
            <div className="col">
              <input type="number" name="amount" id="amount" onChange={handleChange} value={formData.amount} />
            </div>
          </div>

          <div className="form-field row">
            <div className="col">
              <label htmlFor="ModeOfPayment">Mode of Payment</label>
            </div>
            <div className="col">
              <select name="mode_of_payment" id="ModeOfPayment" onChange={handleChange} value={formData.mode_of_payment}>
                <option value="PhonePe">PhonePe</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Bank Transfer (Net-Banking)">Bank Transfer (Net-Banking)</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other UPI">Other UPI</option>
                <option value="Other">UPI</option>

              </select>
            </div>
          </div>

          <div className="form-field row">
            <div className="col">
              <label htmlFor="remarks">Remarks</label>
            </div>
            <div className="col">
              <textarea name="remarks" id="remarks" onChange={handleChange} value={formData.remarks} />
            </div>
          </div>

          <div className="row">
            {prop.name == "" ? <button className='btn btn-primary' onClick={handleAddExpesne}>Add Expense</button> : <button className='btn btn-primary' onClick={handleEditExpense}>Edit Expense</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseForm