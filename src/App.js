/* eslint-disable array-callback-return */
import {useEffect, useState} from "react"
import './App.css';
import { Header } from './components/header';
import {Organization} from './components/organization';
import { Pagination } from "./components/Pagination";
import { Search } from './components/search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllOrganizationsEndpoint, getOrganizationEndpoint, uploadFileEndpoint } from "./endpoints";

const axios = require("axios").default;

function App() {

  const notifySuccess = () => toast("Loaded CSV file!", {type: "success"});
  const notifyError = () => toast("Error!", {type: "error"});

  const [organizations, setOrganizations] = useState([]);
  const [currentRecords, setCurrentRecords] = useState([]);

  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handlePage = (pageNumber) => {
   setCurrentPage(pageNumber);
  }

  useEffect(() => {
    const indexOfLastRecord = currentPage * 5;
    const indexOfFirstRecord = indexOfLastRecord - 5;
    setCurrentRecords(organizations.slice(indexOfFirstRecord, indexOfLastRecord));
  }, [currentPage, organizations])

  const getAllOrganizations = async () => {
      try {
      await axios
        .get(getAllOrganizationsEndpoint)
        .then((response) => {
          setOrganizations(response.data);
          setNumberOfPages(response.data.length/5);
        });
    } catch (error) {
      notifyError();
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    let config = {
        header : {
          'content-type' : 'multipart/form-data'
        }
    }
     try {
      await axios
        .post(uploadFileEndpoint, formData, config
        
        )
        .then(() => {
          getAllOrganizations();
          notifySuccess();
        });
    } catch (error) {
      notifyError();
    }
  }

  const searchByName = async (name) => {
     try {
      await axios
        .get(getOrganizationEndpoint + name)
        .then((response) => {
          const indexOfLastRecord = currentPage * 5;
          const indexOfFirstRecord = indexOfLastRecord - 5;
          setCurrentRecords(response.data.slice(indexOfFirstRecord, indexOfLastRecord));
          setNumberOfPages(Math.ceil(response.data.length/5))
        });
    } catch (error) {
        notifyError();
    }
  }

  const searchByNameWithoutBackend = (name) => {
    let aux = [];
    organizations.filter(organization => { 
      if(organization.name.toLowerCase().includes(name)){
        aux.push(organization);
      }
    });
    setNumberOfPages(Math.ceil(aux.length/5));
    console.log("number of Pages -> ", numberOfPages);
    setCurrentRecords(aux);
    if(name === ""){
      const indexOfLastRecord = currentPage * 5;
      const indexOfFirstRecord = indexOfLastRecord - 5;
      setCurrentRecords(organizations.slice(indexOfFirstRecord, indexOfLastRecord));
      setNumberOfPages(Math.ceil(organizations.length/5))
    }
  }

  return (
    <div className="App">
     <Header handleFile={uploadFile}/>
     
     <div className="list">
       <Search handleSearch={searchByName} handleSearchWithoutBackend={searchByNameWithoutBackend}/>
       {currentRecords.map((organization) => {
         return <Organization key={organization.id} name={organization.name} parent={organization.parent}/>
       })}
       {currentRecords.length === 0 && 
       <div className="container-no-results">
          <img src={require('./assets/images/noresults.png')} className="no-results" alt="no-results"/>
        </div>
       }
       {currentRecords.length !== 0 && 
       <Pagination numberOfPages={numberOfPages} currentPage={currentPage} handlePage={handlePage}/>
      }
       
     </div>
     <ToastContainer 
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        
        />
    </div>
  );
}

export default App;
