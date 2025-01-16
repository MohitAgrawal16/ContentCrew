import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {login , logout} from './store/authSlice'
import {BrowserRouter as Router, Route ,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Workspace from './pages/Workspace'
import WorkspaceDetails from './pages/WorkspaceDetails'
import TaskDetails from './pages/TaskDetails'
import PrivateRoute from './components/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import LoginAgain from './pages/LoginAgain'


function App() {
  
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/loginAgain' element={<LoginAgain />} />

        <Route element={<PrivateRoute />} >
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/workspace' element={<Workspace />} />
          <Route path='/workspace/:workspaceId' element={<WorkspaceDetails />} />
          <Route path='/workspace/:workspaceId/task/:taskId' element={<TaskDetails />} />
        </Route>
        
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
