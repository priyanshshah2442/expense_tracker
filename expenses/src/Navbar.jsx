import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav >
    <ul>
      <li>
        <Link to="/expenses">Expenses</Link>
      </li>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
    </ul>
  </nav>
  )
}
export default Navbar

