import React, {useState} from 'react'
import "./style.css"
import { FaSearch } from 'react-icons/fa';

export function Search({handleSearch, handleSearchWithoutBackend}) {

  const [searchInput, setSearchInput] = useState("");

  return (
    <div className='search'>
      <div style={{width: '100%'}}>
        <p>Search for a organization name or parent using the Backend</p>
        <input type="text" placeholder='Organization name ...' className='search-input' onChange={(event) => setSearchInput(event.target.value)}></input>
        <button onClick={() => handleSearch(searchInput)} className="search-button"><FaSearch color='white' /></button>
      </div> 
        <p>Search just for a organization name using javascript</p>
        <input type="text" placeholder='Organization name ...' className='search-input-second' onChange={(event) => handleSearchWithoutBackend(event.target.value)}></input>
    </div>
  )
}
