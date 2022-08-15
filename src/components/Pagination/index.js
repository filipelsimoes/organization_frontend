import React from 'react'
import './style.css'

export function Pagination({numberOfPages, currentPage, handlePage}) {

  return (
    <div>
      {currentPage !== 1 & 
       <button onClick={() => handlePage(currentPage-1)} className="button-pagination">Previous</button>
      }
        {Array.from(Array(Math.ceil(numberOfPages)), (e, i) => {
    return <button key={i} onClick={() => handlePage(i+1)} className="button-pagination">{i+1}</button>
  })}
  {numberOfPages !== currentPage && 
  <button onClick={() => handlePage(currentPage+1)} className="button-pagination">Next</button>
}
    </div>
  )
}
