import React, { useEffect, useState } from 'react';
import './PatientRegistrationForm.css';
import { usePGlite } from '@electric-sql/pglite-react';
import { useNavigate } from 'react-router';

const PatientRegistrationForm = () => {

  const navigate = useNavigate();
  const db = usePGlite();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: ''
  });
  const [patientsCount, setPatientsCount] = useState(0);
  const [isUserAddSuccessful, setIsUserAddSuccessful] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      const { rows } = await db.query('SELECT * FROM patients');
      setPatientsCount(rows.length);
    }
    fetchPatients();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, age, gender, phone } = formData;
    const escape = (str) => str.replace(/'/g, "''");
    await db.exec(`
      INSERT INTO patients (id, name, age, gender, phone)
      VALUES (
        ${patientsCount + 1},
        '${escape(name)}',
        ${parseInt(age)},
        '${escape(gender)}',
        '${escape(phone)}'
      )
    `);
    
    setIsUserAddSuccessful(true);
    setTimeout(() => {
      setIsUserAddSuccessful(false);
      navigate("/");
    }, 3000);
  };

  return (
    <div className="form-container">
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Age</label>
        <input
          type="number"
          name="age"
          placeholder="Enter age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <div className="gender-buttons">
          {['Male', 'Female', 'Other'].map((g) => (
            <button
              type="button"
              key={g}
              className={formData.gender === g ? 'selected' : ''}
              onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
            >
              {g}
            </button>
          ))}
        </div>

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-button">Submit</button>
        {
          isUserAddSuccessful
            ? <p style={{ color: "green", fontSize: "15px" }}>
                The Patient has been added successfully. Redirecting to the home page.
              </p>
            : <></>
        }
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
