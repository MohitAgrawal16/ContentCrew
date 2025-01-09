import React, { useState } from 'react';
import {Link ,useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(email, password);

    if (email ==='' || password ==='') {
      console.log('Please fill all the fields');
      toast.error('Please fill all the fields');
      return;
    }
    const BACKEND_URL= import.meta.env.VITE_BACKEND_URL;
    //console.log(BACKEND_URL);

    fetch(`${BACKEND_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Login Successful');
         // localStorage.setItem('token', data.token);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-2">ContentCrew</h1>
        <h3 className="text-center text-gray-600 mb-6">Enter your login credentials</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Not registered?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
