import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PatientTable from './PatientTable'
import PatientRegistrationForm from './PatientRegistrationForm'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientTable />} />
        <Route path="/register" element={<PatientRegistrationForm />} />
      </Routes>
    </Router>
  )
}

export default App
