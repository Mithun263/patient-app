import React, { useEffect, useState } from 'react';
import './PatientTable.css';
import { useNavigate } from 'react-router';
import { usePGlite } from '@electric-sql/pglite-react';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

export default function PatientTable() { 
    
  const navigate = useNavigate();
  const db = usePGlite();
    
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPatients();
  }, [db]);
  
  const loadPatients = async () => {
    const { rows } = await db.query('SELECT * FROM patients');
    setPatients(rows);
  };

  const escape = (str) => str.replace(/'/g, "''");

  const handleDelete = async (patientId) => {
    await db.exec(`
      DELETE FROM patients
      WHERE id = ${parseInt(patientId)}
    `);
    alert("The patient was successfully deleted from the records.");
    loadPatients();
  };
  
  const handleSearch = async (search) => {
    setSearch(search);
    
    let data;
    if(search.trim() === '') {
      data = await db.query('SELECT * FROM patients');
      setPatients(data.rows);
    } else {
      const escapedText = escape(search.trim());
      data = await db.query(`
        SELECT * FROM patients
        WHERE name LIKE '%${escapedText}%'
      `);
      setPatients(data.rows);  
    }
  }

  const handleAddPatient = () => {
    navigate("/register");
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Patients</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button className="new-btn" onClick={handleAddPatient}>
            New Patient&nbsp;<PlusCircleOutlined />
          </button>
          </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age, Gender</th>
            <th>Phone</th>
          
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients?.map((patient, idx) => (
            <tr key={idx}>
              <td className="name-link">{patient.name}</td>
              <td>{patient.age}, {patient.gender}</td>
              <td>{patient.phone}</td>

              <td> 
                <button className="delete" onClick={() => handleDelete(patient.id)}>
                  Delete&nbsp;<DeleteOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  
