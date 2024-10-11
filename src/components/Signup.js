import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const host = "http://localhost:5000";
  const [credentials, setcredentials] = useState({ name:"", email: "", password: "",cpassword:"" });
  const navigate = useNavigate();
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`${host}/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }),
    });
    
    
    const json = await response.json();
    console.log(json);
    if(json.success){
      localStorage.setItem('token',json.authtoken);
      navigate("/");
      props.showAlert("Success Account created!!","success")
    } else {
      props.showAlert("Invalid credentials","danger");
    }
    
    
  };
  return (
    <div
    className="w-full h-screen flex items-center justify-center"
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1496309732348-3627f3f040ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="flex w-full max-w-4xl px-10">
      {/* Centered Form without Box Layout */}
      <div className="w-full flex flex-col items-center justify-center bg-white bg-opacity-50 p-10 rounded-lg shadow-lg">
        <h2 className="text-3xl text-gray-800 mb-5">Signup to continue to give feedback</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm text-gray-800 mb-1">Name</label>
            <input
              type="text"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md mb-2"
              id="name"
              placeholder="Your Name"
              name="name"
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-800 mb-1">Email address</label>
            <input
              type="email"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md mb-2"
              id="email"
              placeholder="Enter email"
              name="email"
              onChange={onChange}
            />
            <small className="text-gray-600">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-800 mb-1">Password</label>
            <input
              type="password"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md mb-2"
              id="password"
              placeholder="Password"
              name="password"
              minLength={5}
              required
              onChange={onChange}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="cpassword" className="block text-sm text-gray-800 mb-1">Confirm Password</label>
            <input
              type="password"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md mb-2"
              id="cpassword"
              placeholder="Confirm Password"
              name="cpassword"
              minLength={5}
              required
              onChange={onChange}
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
  );
};

export default Signup;
