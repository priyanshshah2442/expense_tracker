import { useState } from 'react'
import './App.css'
import { FrappeProvider } from 'frappe-react-sdk'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Expenses from './ components/Expenses';
import Dashboard from './ components/Dashboard';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
	const port = 9000

	const currentDate = new Date();

	const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const yearList = [2023, 2024]
	const [date, setDate] = useState('')
	const maxDate = currentDate.toISOString().split('T')[0].slice(0, 7);
	const [range, setRange] = useState([`2024-${String(Number(new Date().getMonth()) + 1).padStart(2, '0')}-01`, `2024-${String(Number(new Date().getMonth()) + 1).padStart(2, '0')}-31`]);

	const [selectedMonth, setSelectedMonth] = useState(String(new Date().getUTCMonth()+1).padStart(2,'0'))
	const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear())
	
	
	const handleMonthYearChange = (e) => {
		let month = e.target.value.slice(5)
		let year = e.target.value.slice(0, 4)
		setSelectedMonth(month)
		setSelectedYear(year)
		handleSetRange(month, year)
	}
	const handleSetRange = (month, year) => {
		if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			setRange([`${year}-${String(Number(month) ).padStart(2, '0')}-01`, `${year}-${String(Number(month) ).padStart(2, '0')}-31`])
		}
		else {
			setRange([`${year}-${String(Number(month) ).padStart(2, '0')}-01`, `${year}-${String(Number(month)).padStart(2, '0')}-30`])
		}
		if (month == 2) {
			setRange([String(`${year}-${String(Number(month)).padStart(2, '0')}-01`), String(`${year}-${String(Number(month) ).padStart(2, '0')}-29`)])
		}
	}
	return (
		<div className="App">
			<FrappeProvider socketPort={port}
			>
				<BrowserRouter basename="/">

					<div>
						<Navbar />
						<div className="container mt-4 row ms-4">
							
								<input type="month" max={maxDate} value={`${selectedYear}-${selectedMonth}`} onChange={handleMonthYearChange} />
								
						
							

						</div>
						<Routes>
							<Route path="/" element={<h2>Wrong PAth</h2>} />
							<Route path="/expenses"
								element={<Expenses range={range} />} />


							<Route path="/dashboard" element={<Dashboard range={range} />} />
						</Routes>
					</div>

				</BrowserRouter>
			</FrappeProvider>
		</div>
	)
}

export default App
