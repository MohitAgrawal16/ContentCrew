import { useState, useEffect, useRef } from "react"
import apiClient from "../utils/apiClient"
import { Search, User } from "lucide-react"

const UserSearch = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length >= 2 && (!selectedUser  || searchTerm !== selectedUser?.username)) {
        searchUsers(searchTerm)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm , selectedUser])

  const searchUsers = async (query) => {
    if (!query.trim()) return
    query = query.trim()
    setIsLoading(true)
    try {
      const response = await apiClient.get("/user/search", {
        params: {query },
      })
      setSearchResults(response.data.data.users)
      setShowResults(true)
    } catch (error) {
      console.error("Error searching users:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectUser = (user) => {
    setSearchTerm(user.username)
    setSelectedUser(user)
    setShowResults(false)
  }

  const handleAdd = () => {
    if (selectedUser) {
      onSelectUser(selectedUser.username)
      setSelectedUser(null)
      setSearchTerm("")
      setSearchResults([])
    }
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setSelectedUser(null)
            }}
            onFocus={() => {
              if (searchResults.length > 0) setShowResults(true)
            }}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="w-4 h-4 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {selectedUser && (
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul>
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelectUser(user)}
              >
                <User className="w-5 h-5 mr-2 text-gray-500" />
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.firstName+ " "+ user.lastName}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && searchTerm.length >= 2 && searchResults.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  )
}

export default UserSearch
