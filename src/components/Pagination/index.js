import React from 'react'
import './style.css'

export function Pagination({numberOfPages, currentPage, handlePage}) {

  console.log("current page -> ", currentPage);

  return (
    <div>
      {currentPage !== 1 && 
       <button onClick={() => handlePage(currentPage-1)} className="button-pagination">{'<<'}</button>
      } 
        {Array.from(Array(Math.ceil(numberOfPages)), (e, i) => {
          if(currentPage !== i+1){
            return <button key={i} onClick={() => handlePage(i+1)} className="button-pagination">{i+1}</button>
          }
          return <button key={i} onClick={() => handlePage(i+1)} className="button-pagination-selected">{i+1}</button>
  })}
    {numberOfPages !== currentPage && 
      <button onClick={() => handlePage(currentPage+1)} className="button-pagination">{'>>'}</button>
    }
    </div>
  )
}
