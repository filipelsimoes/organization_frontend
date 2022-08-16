import {useEffect, useState} from "react"
import './App.css';
import { Header } from './components/header';
import {Organization} from './components/organization';
import { Pagination } from "./components/Pagination";
import { Search } from './components/search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createOrganizationEndpoint, getAllOrganizationsEndpoint, getOrganizationEndpoint, uploadFileEndpoint } from "./endpoints";
import { FaPlusCircle } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  border: 0,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column'
};

const axios = require("axios").default;

function App() {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newOrgnizationName, setNewOrganizationName] = useState('');
  const [newOrgnizationParent, setNewOrgnizationParent] = useState('');


  const notifySuccess = () => toast("Success!", {type: "success"});
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
    setNumberOfPages(Math.ceil(organizations.length/5))


   
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
        .post(uploadFileEndpoint, formData, config)
        .then(() => {
          getAllOrganizations();
          notifySuccess();
        });
    } catch (error) {
      notifyError();
    }
  }

  const createOrganization = async (name, parent) => {
    if(name!==""){

     try {
      await axios
        .post(createOrganizationEndpoint, null, { params: {
              name,
              parent
          }})
        .then(() => {
          getAllOrganizations();
          notifySuccess();
        });
    } catch (error) {
      notifyError();
    }
    }
  }

  const searchByName = async (name) => {
    if(name === ""){
      getAllOrganizations();
    }
     try {
      await axios
        .get(getOrganizationEndpoint +  name.charAt(0).toUpperCase() + name.slice(1))
        .then((response) => {
          const indexOfLastRecord = currentPage * 5;
          const indexOfFirstRecord = indexOfLastRecord - 5;
          setOrganizations(response.data)
          setCurrentRecords(response.data.slice(indexOfFirstRecord, indexOfLastRecord));
          setNumberOfPages(Math.ceil(response.data.length/5))
        });
    } catch (error) {
        notifyError();
    }
  }

  const searchByNameWithoutBackend = (name) => {
   setCurrentRecords(organizations.filter(organization => 
    organization.name.toLowerCase().includes(name)
    ));
    setNumberOfPages(Math.ceil(currentRecords.length/5));
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

      <button onClick={() => handleOpen()} className="modal-button"><FaPlusCircle className="add-icon" /></button>
       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a new organization to the database
          </Typography>
          <div className="container-inputs">
             <label>Name</label>
          <input  className="inputs" onChange={(event) => setNewOrganizationName(event.target.value)}/>
          <label>Parent</label>
          <input className="inputs" onChange={(event) => setNewOrgnizationParent(event.target.value)} />
          </div>
          <button onClick={() => {createOrganization(newOrgnizationName, newOrgnizationParent)
          handleClose()}} className="create-button">Add</button>
         

        </Box>
      </Modal>
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
