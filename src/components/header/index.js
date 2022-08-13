import React from 'react'
import './style.css';
import { FaDownload } from 'react-icons/fa';

export function Header({handleFile}) {
  return (
    <header className='header'>
        <img src={require('../../assets/images/pipedrive.png')} className="logo" alt="logo"/>
        <input id="files" type={"file"} className="input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {
            handleFile(event.target.files[0]);
          }}></input>
        <label htmlFor="files" className='input-button'>Import <FaDownload /></label>
    </header>
  )
}
