import React from 'react'
  import { ToastContainer} from 'react-toastify';
import ManagePlayers from './pages/ManagePlayers'
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import ManageTeams from './pages/ManageTeams';
import ManageMatch from './pages/ManageMatch';
import TeamDetails from './pages/TeamDetails';
import Demo from './pages/Demo';

const App = () => {
  return (
    <div>
      <ToastContainer/>

      <div className='flex'>
        <Sidebar/>  
        <Routes>
          <Route path='/' element = {<ManagePlayers/>} />
          <Route path='/demo' element = {<Demo/>} />
          <Route path='/teams' element = {<ManageTeams/>} />
          <Route path='/matches' element = {<ManageMatch/>} />
          <Route path='/team-detail/:id' element = {<TeamDetails/>} />
        </Routes>
      
      </div>
     
    </div>
  )
}

export default App
