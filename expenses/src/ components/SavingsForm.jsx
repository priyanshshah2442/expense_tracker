import React, { useState, useEffect } from 'react'
import './SavingsForm.css'
import CloseIcon from '@mui/icons-material/Close';
import API from '../axios';
import { toast } from 'react-toastify';
const SavingsForm = (prop) => {
    let today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    let maxDate = new Date().toISOString().split('T')[0];
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const minDate = twoMonthsAgo.toISOString().split('T')[0];

    today = `${year}-${month}-${day}`;
    const savings = ["Stocks",
        "Real Estate",
        "FD",
        "SIP",
        "Mutual Fund",
        "ELSS",
        "PPF",
        "EPF",
        "Gold",
        "Silver",
        "Bond",
        "Debt"]
    const [formData, setFormData] = useState({
        field_of_savings: 'Stocks',
        date: today,
        amount: 0,
        remarks: ''
    })
    const handleAddSavings = async (e) => {
        e.preventDefault()
        try {
            const resp = await API.post('resource/Savings', JSON.stringify({
                // docType:'Expense',
                ...formData
            }))
            prop.handleClose("savings");
            toast.success("Entry Added Successfully", {
                position: "bottom-right"
            })
            console.log(resp.data)
        }
        catch (e) {
            toast.error(e.response.data.exception)
            console.error(e);
        }
    }
    const handleEditSavings = async (e) => {
        e.preventDefault()
        try {
            const resp = await API.put(`resource/Savings/${prop.name}`, { ...formData })
            console.log(resp.data)
            prop.handleClose("savings");
            toast.success("Entry Edited Successfully", {
                position: "bottom-right"
            })
        }
        catch (e) {
            toast.error(e.response.data.exception)
            console.error(e);
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
            const fetchSavingsDetails = async () => {
                let resp = await API.get(`resource/Savings/${prop.name}`);
                console.log(resp.data);
                resp = resp.data.data
                setFormData({
                    name: resp.name,
                    field_of_savings: resp.field_of_savings,
                    date: resp.date,
                    amount: resp.amount,
                    remarks: resp.remarks
                })
            }
            fetchSavingsDetails();
        }
    }, [])
    return (
        <div className="savings-modal">
            <div className="savings-modal-content" key={"modal"}>
                <CloseIcon className='closeBtn' onClick={() => {
                    prop.handleClose("savings")
                }} />
                <h4 className='text-primary mb-4'>Add Savings</h4>
                <div className='form-container'>
                    <div className="form-field row">
                        <div className="col"><label htmlFor="field_of_savings">Field of Saving</label></div>
                        <div className="col">
                            <select name='field_of_savings' value={formData.field_of_savings} onChange={handleChange}>
                                {savings.map((ele, ind) => {
                                    return (
                                        <option value={ele} key={ind}>{ele}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-field row">
                        <div className="col"><label htmlFor="date">Date</label></div>
                        <div className="col">
                            <input type='date' name="date" value={formData.date} id="date" onChange={handleChange} required min={minDate} max={maxDate} />
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
                            prop.name == "" ? <button className='btn btn-primary' onClick={handleAddSavings}>Add Savings</button> : <button className='btn btn-primary' onClick={handleEditSavings}>Edit Savings</button>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SavingsForm