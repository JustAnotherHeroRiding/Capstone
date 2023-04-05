import { useState } from 'react'
import './App.css'
import Register from './Register'
import LogIn from './LogIn'
import Profile from './Profile'

function Sidebar({ isLoggedIn, username }) {

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

    const [showProfile, setShowProfile] = useState(false)

    const handleProfileClick = () => {
        setShowProfile(showProfile => !showProfile);
    }


    return (
        <div>
            <nav className="md:left-0 md:top-0 md:fixed md:h-screen md:flex lg:w-72 md:w-48 md:flex-col text-Intone-600 px-2 text-xl bg-Intone-100">
                <h1 className="mb-12 md:mt-4 hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer"><a className="text-4xl font-bold mx-auto" href=''>inTone</a></h1>

                <div className="">
                    <ul className="max-md:flex max-md:justify-between max-md:mx-auto ">
                        {username && (
                            <li className='mb-4 max-md:mx-2'>
                                <a className=" hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" onClick={handleProfileClick}>{username}</a>
                            </li>
                        )}
                        <li className="mb-4 max-md:mx-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3" id='sidebar-all-posts' href="">Albums</a>
                        </li>
                        <li className="mb-4 max-md:mx-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3" id='sidebar-following' href="">Artists</a>
                        </li>
                        <li className="mb-4 max-md:mx-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3" id='sidebar-following' href="">Gear</a>
                        </li>
                        {isLoggedIn ? (
                            <li className="mb-4 max-md:mx-2">
                                <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3" href="/logout">Log Out</a>
                            </li>
                        ) : null}
                        {!isLoggedIn && (
                            <div className="max-md:flex max-md:justify-between">
                                <li className="mb-4 max-md:mx-2">
                                    <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer"
                                        onClick={handleLogInClick}>Log In</a>
                                </li>
                                <li className="mb-4 max-md:mx-2">
                                    <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer"
                                        onClick={handleRegisterClick}>Register</a>
                                </li>
                            </div>
                        )}
                    </ul>
                </div>

            </nav>
            {showLogIn && <LogIn handleRegisterClick={handleRegisterClick} />}
            {showRegister && <Register handleLogInClick={handleLogInClick} />}
            {showProfile && <Profile username={username} />}
        </div>
    )
}

export default Sidebar