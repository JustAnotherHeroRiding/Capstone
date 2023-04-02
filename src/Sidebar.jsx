import { useState } from 'react'
import './App.css'
import Register from './Register'
import LogIn from './LogIn'

function Sidebar({ isLoggedIn }) {

    const [showLogIn, setShowLogIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogInClick = () => {
        setShowLogIn(showLogIn => !showLogIn);
        setShowRegister(false)
    };

    const handleRegisterClick = () => {
        setShowRegister(showRegister => !showRegister);
        setShowLogIn(false)
    };


    return (
        <div>
            <nav className="md:left-0 md:top-0 md:fixed md:h-screen md:flex lg:w-72 md:w-48 md:flex-col text-green-600 px-2 text-xl bg-gray-900">
                <h1 className="mb-12 md:mt-4 hover:bg-gray-700 rounded-3xl px-3 py-3"><a className="text-4xl font-bold mx-auto" href="">Slava</a></h1>

                <div className="">
                    <ul className="max-md:flex max-md:justify-between max-md:mx-auto ">
                        <li className="mb-8 max-md:mx-2">
                            <a className="hover:bg-gray-700 rounded-3xl px-3 py-3" id='sidebar-all-posts' href="">All Posts</a>
                        </li>
                        <li className="mb-8 max-md:mx-2">
                            <a className="hover:bg-gray-700 rounded-3xl px-3 py-3" id='sidebar-following' href="">Following</a>
                        </li>
                        {isLoggedIn ? (
                            <li className="mb-4 max-md:mx-2">
                                <a className="hover:bg-gray-700 rounded-3xl px-3 py-3" href="/logout">Log Out</a>
                            </li>
                        ) : null}
                        {!isLoggedIn && (
                            <div>
                                <li className="mb-4 max-md:mx-2">
                                    <button className="hover:bg-gray-700 rounded-3xl px-3 py-3"
                                        onClick={handleLogInClick}>Log In</button>
                                </li>
                                <li className="mb-4 max-md:mx-2">
                                    <button className="hover:bg-gray-700 rounded-3xl px-3 py-3"
                                        onClick={handleRegisterClick}>Register</button>
                                </li>
                            </div>
                        )}
                        <li className="mb-4 w-full items-center max-md:mx-2">
                            <button className="hover:bg-spectrum-h2 bg-orange-600 rounded-3xl px-4 py-3 text-white" id="sidebar-new-post">New Post</button>
                        </li>
                    </ul>
                </div>

            </nav>
            {showLogIn && <LogIn />}
            {showRegister && <Register />}
        </div>
    )
}

export default Sidebar