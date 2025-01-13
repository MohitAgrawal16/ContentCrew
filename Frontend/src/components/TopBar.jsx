import React from 'react'
import { useSelector } from 'react-redux'

function TopBar({value}) {
   
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h1 className="text-lg font-semibold">{value}</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="relative">
              <span className="material-icons cursor-pointer">notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={user.dp}
                alt="dp"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm font-medium">{user.username}</span>
            </div>
          </div>
        </div>
    </>
  )
}

export default TopBar
