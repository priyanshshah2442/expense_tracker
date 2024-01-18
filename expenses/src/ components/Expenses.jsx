import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import ExpenseForm from './ExpenseForm';
import API from '../axios';
import AddIncomeForm from './AddIncomeForm';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SavingsForm from './SavingsForm';
import { toast, Bounce } from 'react-toastify';

//  import { useFrappeGetDocList } from 'frappe-react-sdk'
const Expenses = (prop) => {

    const [expenseList, setExpenseList] = useState([]);
    const [incomeList, setIncomeList] = useState([]);
    const [savingList,setSavingList]=useState([]);
    const [range, setRange] = useState(prop.range);

    const [showModal, setShowModal] = useState({
        expense: false,
        income: false,
        savings:false
    });

    const [value, setValue] = useState('1');
    const [docName, setDocName] = useState("")
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
   
    const handleShow = (modal) => setShowModal({ ...showModal, [modal]: true });

    const handleEditExpense = (doc_name) => {
        let modal = "expense"
        setDocName(doc_name)
        setShowModal({ ...showModal, [modal]: true })

    }
    const handleEditIncome=(doc_name)=>{
        let modal = "income"
        setDocName(doc_name)
        setShowModal({ ...showModal, [modal]: true })

    }
    const handleEditSavings=(doc_name)=>{
        let modal = "savings"
        setDocName(doc_name)
        setShowModal({ ...showModal, [modal]: true })

    }
    const handleDeleteExpense = async (doc_name) => {
        let reply = confirm("Are you sure you want to delete the Expense ? ")
        if (reply) {
            try {
                const resp = await API.delete(`resource/Expense/${doc_name}`);
                console.log(resp.data)
                fetchExpenseList()
                toast.success("Entry deleted successfully",{
                    position:"bottom-right"
                })
            }
            catch (e) {
                toast.error("Some error occurred")
                console.error(e);
            }
        }

    }
    const handleDeleteIncome=async(doc_name)=>{
        let reply = confirm("Are you sure you want to delete the Expense ? ")
        if (reply) {
            try {
                const resp = await API.delete(`resource/Incom/${doc_name}`);
                console.log(resp.data)
                fetchIncomeList()
                toast.success("Entry deleted successfully",{
                    position:"bottom-right"
                })
            }
            catch (e) {
                toast.error(e.response)
                console.error(e);
            }
        }
    }
    const handleDeleteSavings=async(doc_name)=>{
        let reply = confirm("Are you sure you want to delete the Savings ? ")
        if (reply) {
            try {
                const resp = await API.delete(`resource/Savings/${doc_name}`);
                console.log(resp.data)
                fetchSavingsList()
                toast.success("Entry deleted successfully",{
                    position:"bottom-right"
                })
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    const handleClose = (modal) => {
        if (modal == "expense") {
            fetchExpenseList()
        } else if (modal == "income") {
            fetchIncomeList()
        }
        else if(modal=="savings"){
            fetchSavingsList()
        }
        setShowModal({ ...showModal, [modal]: false })
        setDocName("")

    };
    const fetchExpenseList = async () => {

        try {
            const resp = await API.get(`resource/expense?`,
                {
                    params: {
                        fields: '["name","expense_type","expense_name","amount","date","mode_of_payment","remarks"]',
                        filters: `[["date", "between", ["${range[0]}","${range[1]}"]]]`,
                        order_by: 'date desc'
                    }
                }
            )
            setExpenseList(resp.data.data)
            // console.log(resp.data)
        }
        catch (error) {
            console.log(error)
        }
    };
    const fetchIncomeList = async () => {
        try {
            // const resp = await API.get(`resource/income?fields=["source","date","amount","remarks"]`)
            const resp = await API.get('resource/income', {
                params: {
                    fields: '["name","source","date","amount","remarks"]',
                    filters: `[["date", "between", ["${range[0]}","${range[1]}"]]]`,
                    order_by: 'date desc'
                }
            })
            console.log(resp.data.data)
            setIncomeList(resp.data.data)
        } catch (e) {
            console.error(e);
        }
    }
    const fetchSavingsList=async()=>{
        try{
            const resp=await API.get('resource/savings',{
                params: {
                    fields: '["name","field_of_savings","date","amount","remarks"]',
                    filters: `[["date", "between", ["${range[0]}","${range[1]}"]]]`,
                    order_by: 'date desc'
                }
            })
            console.log(resp.data.data)
            setSavingList(resp.data.data)
        }catch(e){
            console.error(e);
        }
    }
    useEffect(() => {
        fetchExpenseList();
        fetchIncomeList();
        fetchSavingsList();
    }, [range]);

    useEffect(() => {
        setRange(prop.range)
    }, [prop])

    return (
        <>
            {showModal.expense && <ExpenseForm handleClose={handleClose} name={docName} />}
            {showModal.income && <AddIncomeForm handleClose={handleClose} name={docName}/>}
            {showModal.savings && <SavingsForm handleClose={handleClose} name={docName}/>}
            <div className='container'>

                <Button variant="primary" className="m-4" onClick={() => {
                    handleShow("expense")
                }}>
                    Add Expense
                </Button>
                <Button variant="primary" className="m-4" onClick={() => {
                    handleShow("income")
                }}>
                    Add Income
                </Button>
                <Button variant="primary" className="m-4" onClick={() => {
                    handleShow("savings")
                }}>
                    Add Savings
                </Button>

                {/* <select value={selectedMonth} onChange={handleMonthChange}>
                    {monthList.map((ele,ind)=>{
                        return (
                            <option value={ind}>{ele}-24</option>
                        )
                    })}
                </select> */}

            </div>
            <div className="container">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab label="Expenditure" value="1" />
                                <Tab label="Income" value="2" />
                                <Tab label="Savings / Investment" value="3" />

                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Expense Type</th>
                                        <th scope='col'>Expense Name</th>
                                        <th scope='col'>Date</th>
                                        <th scope='col'>Mode of Payment</th>
                                        <th scope='col'>Amount</th>
                                        <th scope='col'>Remarks</th>
                                        <th scope='col'>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        expenseList.map((ele, ind) => {
                                            return (

                                                <tr key={ind}>
                                                    <td>{ele.expense_type}</td>
                                                    <td>{ele.expense_name}</td>
                                                    <td>{ele.date}</td>
                                                    <td>{ele.mode_of_payment}</td>
                                                    <td>{ele.amount}</td>
                                                    <td>{ele.remarks}</td>
                                                    <td><EditIcon color='primary' sx={{ cursor: 'pointer' }} onClick={() => {
                                                        handleEditExpense(ele.name)
                                                    }} /> &nbsp;&nbsp;&nbsp;
                                                        <DeleteIcon sx={{ color: 'red', cursor: "pointer" }} onClick={() => {
                                                            handleDeleteExpense(ele.name)
                                                        }} />
                                                    </td>
                                                </tr>

                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel value="2">
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Source</th>
                                        <th scope='col'>Date</th>
                                        <th scope='col'>Amount</th>
                                        <th scope='col'>Remarks</th>
                                        <th scope='col'>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        incomeList.map((ele, ind) => {
                                            return (
                                                <tr key={ind}>
                                                    <td>{ele.source}</td>
                                                    <td>{ele.date}</td>
                                                    <td>{ele.amount}</td>
                                                    <td>{ele.remarks}</td>
                                                    <td><EditIcon color='primary' sx={{ cursor: 'pointer' }} onClick={() => {
                                                        handleEditIncome(ele.name)
                                                    }} /> &nbsp;&nbsp;&nbsp;
                                                        <DeleteIcon sx={{ color: 'red', cursor: "pointer" }} onClick={() => {
                                                            handleDeleteIncome(ele.name)
                                                        }} />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                        </TabPanel>
                        <TabPanel value="3">
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Savings / Investment</th>
                                        <th scope='col'>Date</th>
                                        <th scope='col'>Amount</th>
                                        <th scope='col'>Remarks</th>
                                        <th scope='col'>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        savingList.map((ele, ind) => {
                                            return (
                                                <tr key={ind}>
                                                    <td>{ele.field_of_savings}</td>
                                                    <td>{ele.date}</td>
                                                    <td>{ele.amount}</td>
                                                    <td>{ele.remarks}</td>
                                                    <td><EditIcon color='primary' sx={{ cursor: 'pointer' }} onClick={() => {
                                                        handleEditSavings(ele.name)
                                                    }} /> &nbsp;&nbsp;&nbsp;
                                                        <DeleteIcon sx={{ color: 'red', cursor: "pointer" }} onClick={() => {
                                                            handleDeleteSavings(ele.name)
                                                        }} />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                        </TabPanel>

                    </TabContext>
                </Box>
            </div>



        </>
    )
}

export default Expenses
