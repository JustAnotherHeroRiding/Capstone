import { useState, useEffect } from 'react'
import './App.css'
import Register from './Register'
import LogIn from './LogIn'
import Profile from './Profile'

function Sidebar({ isLoggedIn, userData, fetchUserData, fetchOtherUserData }) {

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

    const [showOtherProfile, setShowOtherProfile] = useState(false)
    const [otherUserData, setOtherUserData] = useState(null);

    const [currentUser, setCurrentUser] = useState(true)

      

    function fetchOtherUserData(user_id) {
        const id = parseInt(user_id, 10);

        fetch(`/user/data/${id}`)
          .then(response => response.json())
          .then(data => {
            setOtherUserData(data);
          })
          .catch(error => {
            console.error(error);
          });
      }



    const handleProfileClick = () => {
        setShowOtherProfile(false)
        setCurrentUser(true)
        setShowProfile(showProfile => !showProfile);
        fetchUserData()
    }

    const handleSearchResultClick = async (result) => {
        if (result.model_type === 'user') {
          if (result.id === userData.id || result.recipient === userData.id || result === userData.id) {
            setCurrentUser(true);
          } else {
            setCurrentUser(false);
          }
          await fetchOtherUserData(result.id);
          setShowProfile(false);
          setShowOtherProfile(true);
        }
      };
      
      


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
            <nav className="z-10 md:left-0 md:top-0 md:fixed md:h-screen md:flex lg:w-72 md:w-48 md:flex-col text-Intone-600 px-2 text-xl bg-Intone-100">

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
                        <div className='bg-gray-800 px-2 mt-2 py-2 rounded-2xl cursor-pointer'>
                            <>
                                {results.map((result) => (
                                    <div key={`${result.id}-${result.model_type}`}  className='flex justify-between hover:bg-gray-700 p-2 rounded-2xl'
                                        onClick={() => handleSearchResultClick(result)}>                        
                                        <p>{result.name}</p>
                                        <p>{result.model_type.charAt(0).toUpperCase() + result.model_type.slice(1).toLowerCase()}</p>
                                    </div>
                                ))}
                            </>
                        </div>
                    )}
                </div>

            </nav>
            {showLogIn && <LogIn handleRegisterClick={handleRegisterClick} />}
            {showRegister && <Register handleLogInClick={handleLogInClick} />}
            {showProfile && <Profile userData={userData} fetchUserData={fetchUserData} current_user={currentUser} handleProfileClick={handleProfileClick} handleSearchResultClick={handleSearchResultClick} />}
            {otherUserData && showOtherProfile && <Profile userData={otherUserData} fetchUserData={fetchOtherUserData} current_user={currentUser} handleProfileClick={handleProfileClick} handleSearchResultClick={handleSearchResultClick} />}

        </div>
    )
}

export default Sidebar