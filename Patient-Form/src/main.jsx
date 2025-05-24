import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PGliteProvider } from '@electric-sql/pglite-react';
import { PGlite } from '@electric-sql/pglite';

const db = new PGlite("idb://patient-db");

const createPgDatabase = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    phone TEXT NOT NULL
  );
`)
}
createPgDatabase();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PGliteProvider db={db}>
      <App />
    </PGliteProvider>
  </StrictMode>,
)
