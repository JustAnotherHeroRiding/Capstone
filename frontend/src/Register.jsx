import { useState } from 'react'
import './App.css'
import Cookies from 'js-cookie';


function Register({handleLogInClick}) {
    const csrftoken = Cookies.get('csrftoken');


    return (
        <div className="items-center flex justify-center flex-col w-1/3 mx-auto text-Intone-600">

        <h2 className="text-3xl font-bold mb-4 mx-auto mt-12 text-Intone-600">Register</h2>

    
        <form action="/register" method="post" className="max-w-md mx-auto mt-6 w-full px-6 py-12 text-black border border-indigo-200 rounded-3xl shadow-2xl">
            <div className="mb-4">
                <label htmlFor="username" className="block font-medium mb-1 text-Intone-600 ">Username:</label>
    
                <input className="w-full border-solid border-2 rounded-lg py-2 px-4" 
                autoFocus type="text" name="username" placeholder="Username"></input>
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block font-medium mb-1 text-Intone-600">Email:</label>
    
                <input className="w-full border-solid border-2 rounded-lg py-2 px-4" type="email" 
                name="email" placeholder="Email Address"></input>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block font-medium mb-1 text-Intone-600">Password:</label>
    
                <input className="form-input w-full border-solid border-2 rounded-lg py-2 px-4" 
                type="password" name="password" placeholder="Password"></input>
            </div>
            <div className="mb-4">
                <label htmlFor="confirmation" className="block font-medium mb-1 text-Intone-600">Confirm Password:</label>
    
                <input className="w-full border-solid border-2 rounded-lg py-2 px-4"
                 type="password" name="confirmation" placeholder="Confirm Password"></input>
            </div>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <input className="hover:bg-Intone-500 bg-white text-Intone-700 cursor-pointer font-bold py-2 px-4 rounded border" 
            type="submit" value="Register"></input>
        </form>
    
        <p className="mt-4 mx-auto text-Intone-600 cursor-pointer">Already have an account? <a onClick={handleLogInClick} className="text-blue-500 hover:text-blue-700">Log In here.</a></p>
    
    </div>
    );
}
export default Register