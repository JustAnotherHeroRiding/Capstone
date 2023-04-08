import { useState, useEffect } from 'react'
import './App.css'
import Register from './Register'
import LogIn from './LogIn'
import Profile from './Profile'

function Sidebar({ isLoggedIn, userData, fetchUserData }) {

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


    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [nrResults, setNrResults] = useState(0);

    const [data, setData] = useState([]);

    function FetchSearchData() {
        fetch(`/search`)
            .then(response => response.json())
            .then(data => {
                setData(data);
            });
    }
    useEffect(() => {
        FetchSearchData()
    }, []);


    const handleInputChange = (event) => {
        const value = event.target.value
        setQuery(value);

        if (value !== '') {
            const filteredData = Object.values(data).flat().filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
            console.log(filteredData)

            setResults(filteredData);
            setNrResults(filteredData.length);
            setShowResults(true);
        } else {
            setResults([]);
            setNrResults(0);
            setShowResults(false);
        }
    };


    return (
        <div>
            <nav className="md:left-0 md:top-0 md:fixed md:h-screen md:flex lg:w-72 md:w-48 md:flex-col text-Intone-600 px-2 text-xl bg-Intone-100">

                <h1 className="mb-12 md:mt-4 hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer">
                    <a className="text-4xl font-bold mx-auto" href=''>inTone</a></h1>

                <div className="">
                    <ul className="max-md:flex max-md:justify-between max-md:mx-auto ">
                        {userData && (
                            <li className='mb-4 max-md:mx-2 flex flex-row justify-start'>
                                <a className=" hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" onClick={handleProfileClick}>{userData.name}</a>
                                {userData.profile_pic && (
                                    <img src={`static/profile_pictures/${userData.profile_pic}`} className='object-cover w-12 h-12 cursor-pointer rounded-2xl' onClick={handleProfileClick} />

                                )}
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
                    <input type='text'
                        placeholder='Search Albums,Gear,Players and more' name='sidebar-search'
                        className='text-sm w-full rounded-3xl px-4 py-2 text-black'
                        value={query}
                        onChange={handleInputChange}></input>
                    {showResults && results && nrResults > 0 && (
                        <>
                            {results.map((result) => (
                                <p key={result.id}>{result.name}</p>
                            ))}
                        </>
                    )}
                    </div>

            </nav>
            {showLogIn && <LogIn handleRegisterClick={handleRegisterClick} />}
            {showRegister && <Register handleLogInClick={handleLogInClick} />}
            {showProfile && <Profile userData={userData} fetchUserData={fetchUserData} />}
        </div>
    )
}

export default Sidebar