import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {login , logout} from './store/authSlice'
import {BrowserRouter as Router, Route ,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Workspace from './pages/Workspace'

import { ToastContainer } from 'react-toastify'


function App() {
  
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/workspce' element={<Workspace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App