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
  
  const sampleTask = {
    title: "Task 1",
    description: "This is a description of Task 1.",
    mediaFiles: [
      "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  };
  

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
          <Route path='/workspace/:workspaceId' element={<WorkspaceDetails userRole="owner"/>} />
          <Route path='/tasks/:taskId' element={<TaskDetails userRole="editor" task={sampleTask}/>} />
        </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
