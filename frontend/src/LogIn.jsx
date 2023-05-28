import { useState } from 'react'
import './App.css'
import Cookies from 'js-cookie';


function LogIn({ handleRegisterClick }) {
    const csrftoken = Cookies.get('csrftoken');


    return (
    <div className="items-center flex justify-center flex-col w-1/3 mx-auto">
        <h2 className="text-3xl font-bold mb-4 mx-auto mt-12 text-Intone-600">Login</h2>


        <form action="/login" method="post" className="max-w-md mx-auto mt-6 w-full px-6 py-12 border border-indigo-200 rounded-3xl shadow-2xl">
            <div className="mb-4">
                <label htmlFor="email" className="block font-medium mb-1 text-Intone-600">Username:</label>
                <input id="username" autoFocus className="w-full border-solid border-2 rounded-lg py-2 px-4" type="username"
                    name="username" placeholder="Username"></input>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block font-medium mb-1 text-Intone-600">Password:</label>
                <input id="password" className="w-full border-solid border-2 rounded-lg py-2 px-4" type="password"
                    name="password" placeholder="Password"></input>
            </div>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <input
                className="hover:bg-Intone-500 bg-white text-Intone-700 cursor-pointer font-bold py-2 px-4 rounded border "
                type="submit" value="Login"></input>
        </form>

        <p className="mt-4 mx-auto text-Intone-600 cursor-pointer">Don't have an account? <a
            className="text-blue-500 hover:text-blue-700" onClick={handleRegisterClick}>Register here.</a></p>

    </div>
    );
}
export default LogIn