import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import './AddIncomeForm.css'
import API from '../axios';
import { toast, Bounce } from 'react-toastify';
const AddIncomeForm = (prop) => {
    let today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    let maxDate = new Date().toISOString().split('T')[0];
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const minDate = twoMonthsAgo.toISOString().split('T')[0];
    today = `${year}-${month}-${day}`
    const [formData, setFormData] = useState({
        source: 'Salary',
        date: today,
        amount: 0,
        remarks: ''
    })
    const income=["Salary","Business","Interest","Dividend","Stocks","Rent","Other"]
    const handleAddIncome = async (e) => {
        e.preventDefault()
        try {
            const resp = await API.post('resource/Income', JSON.stringify({
                // docType:'Expense',
                ...formData
            }))
            prop.handleClose("income");
            console.log(resp.data)
            toast.success("Entry Added Successfully", {
                position: "bottom-right"
            })
        }
        catch (e) {
            console.error(e);
            toast.error(e.response.data.exception)
        }
    }
    const handleEditIncome = async (e) => {
        e.preventDefault()
        try {
            const resp = await API.put(`resource/Income/${prop.name}`, { ...formData })
            console.log(resp.data)
            prop.handleClose("income");
            toast.success("Entry Edited Successfully", {
                position: "bottom-right"
            })
        }
        catch (e) {
            console.error(e);
            toast.error(e.response.data.exception)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
    useEffect(() => {
        if (prop.name != "") {
            const fetchIncomeDetails = async () => {
                let resp = await API.get(`resource/Income/${prop.name}`);
                console.log(resp.data);
                resp = resp.data.data
                setFormData({
                    name: resp.name,
                    source: resp.source,
                    date: resp.date,
                    amount: resp.amount,
                    remarks: resp.remarks
                })
            }
            fetchIncomeDetails()
        }
    }, [])
    return (
        <div className="income-modal">
            <div className="income-modal-content" key={"modal"}>
                <CloseIcon className='closeBtn' onClick={() => {
                    prop.handleClose("income")
                }} />
                <h4 className='text-primary mb-4'>Add Income</h4>
                <div className='form-container'>
                    <div className="form-field row">
                        <div className="col"><label htmlFor="source">Source</label></div>
                        <div className="col">
                            <select name='source' value={formData.source} onChange={handleChange}>
                                {income.map((ele,ind)=>{
                                    return (
                                        <option value={ele}>{ele}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-field row">
                        <div className="col"><label htmlFor="date">Date</label></div>
                        <div className="col">
                            <input type='date' name="date" value={formData.date} id="date" onChange={handleChange} min={minDate} max={maxDate} required />
                        </div>
                    </div>

                    <div className="form-field row">
                        <div className="col"><label htmlFor="amount">Amount</label></div>
                        <div className="col">
                            <input type='number' name="amount" value={formData.amount} id="amount" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-field row">

                        <div className="col">
                            <label htmlFor="remarks">Remarks</label>
                        </div>
                        <div className="col">
                            <textarea name="remarks" id="remarks" onChange={handleChange} value={formData.remarks} required />
                        </div>

                    </div>

                    <div className="row">
                        {
                            prop.name == "" ? <button className='btn btn-primary' onClick={handleAddIncome}>Add Income</button> : <button className='btn btn-primary' onClick={handleEditIncome}>Edit Income</button>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddIncomeForm