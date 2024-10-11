import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const host ="http://localhost:5000";
    const [ credentials,setcredentials ] = useState({email:"",password:""})
    const navigate = useNavigate();
    const onChange = (e)=>{
        setcredentials({...credentials,[e.target.name]: e.target.value})
    }

    const handleSubmit=async (e) =>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({email: credentials.email,password:credentials.password})
        });
        const json = await response.json();
        console.log(json);
        if(json.success) {
          localStorage.setItem('token',json.authtoken);
          props.showAlert("Account successfully logged in","success");
          navigate("/");
         
        } else {
            props.showAlert("Invalid credentials","danger");
        }
    }
  return (
    <div
      className="w-full h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1496309732348-3627f3f040ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Login form container */}
      <div className="w-1/2 flex items-center justify-center h-screen bg-white bg-opacity-25 shadow-lg p-10">
        <div className="w-full px-20">
          <h3 className="text-3xl text-gray-700 mb-3">Login to give your feedback</h3>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                placeholder="Enter email"
                value={credentials.email}
                onChange={onChange}
                required
              />
              <small className="text-gray-400">
                We'll never share your email with anyone else.
              </small>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="block w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                placeholder="Enter password"
                value={credentials.password}
                onChange={onChange}
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 w-full bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login