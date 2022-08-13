import React from 'react'
import { FaBuilding } from 'react-icons/fa';
import './style.css'

export function Organization({name, parent}) {
  return (
    <div className='card'>
        
        <div><FaBuilding /><span>{name}</span></div>
        <div>
        <span>Parent:</span><span> {parent}</span>

        </div>
    </div>
  )
}
