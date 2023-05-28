import { useState, useEffect } from 'react'
import { debounce } from 'lodash'
import './App.css'
import Register from './Register'
import LogIn from './LogIn'
import Profile from './Profile'
import Entry from './AlbumGearArtist'
import MainPageItems from './AlbumGearArtist'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faL, faBars } from '@fortawesome/free-solid-svg-icons'

function Sidebar({ isLoggedIn, userData, fetchUserData, fetchOtherUserData, currentUserId }) {

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

    const [currentUser, setCurrentUser] = useState(false)



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
            if (userData) {
                if (result.id === userData.id || result.recipient === userData.id || result === userData.id) {
                    setCurrentUser(true);
                } else {
                    setCurrentUser(false);
                }
            }
            await fetchOtherUserData(result.id);
            setShowProfile(false);
            setShowOtherProfile(true);
            setQuery('')
            setResults([])
            setShowResults(false)
        } else if (result.model_type === 'gear' || result.model_type === 'band' || result.model_type === 'album' || result.model_type === 'player') {
            fetchSingleEntry(result.model_type, result.id)
            setQuery('')
            setResults([])
            setShowResults(false)
        };
    };

    const handleUserMessageClick = (entry) => {
        if (!currentUser) {
            handleSearchResultClick(entry);
        } else if (userData && entry.id === userData.id) {
            handleProfileClick();
        } else {
            handleSearchResultClick(entry);
        }
    };



    const [singleView, setSingleView] = useState(false)
    const [singleViewType, setSingleViewType] = useState('')

    const [singleEntryData, setSingleEntryData] = useState([])
    const [showEntryType, setShowEntryType] = useState('')
    const [showOnlyEntryType, setShowOnlyEntryType] = useState(false)

    const fetchSingleEntry = (entryType, entryId) => {
        fetch(`entries/${entryType}/${entryId}`)
            .then(response => response.json())
            .then(data => {
                setSingleEntryData(data)
                setSingleViewType(entryType)
                setSingleView(true)
                setShowOnlyEntryType(false)
                if (showProfile || showOtherProfile) {
                    setShowProfile(false)
                    setShowOtherProfile(false)
                }
            })
            .catch(error => console.error(error));
    }

    function exitSingleView() {
        if (singleView) {
            setSingleView(false)
        }
    }



    const ShowAllX = (type) => {
        setShowEntryType(type)
        if (showEntryType === type) {
            setShowOnlyEntryType(false)
            setShowEntryType('')
        } else {
            setShowOnlyEntryType(true)
        }
        setShowProfile(false)
        setShowOtherProfile(false)
    }



    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [nrResults, setNrResults] = useState(0);

    const [data, setData] = useState([]);

    const FetchSearchData = debounce(() => {
        fetch(`/search`)
            .then(response => response.json())
            .then(data => {
                setData(data);
            });
    }, 50); // Adjust the debounce delay as needed


    const [reviews, setReviews] = useState([])

    const fetchAllReviews = debounce(() => {
        fetch('review/get/all')
            .then(response => response.json())
            .then(data => setReviews(data))
            .catch(error => console.log(error))
    }, 50); // Adjust the debounce delay as needed

    useEffect(() => {
        FetchSearchData();
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


    const [isMenuOpen, setIsMenuOpen] = useState(false);

    



    return (
        <div>
            <nav className="z-10 3xl:left-0 3xl:top-0 3xl:fixed 3xl:h-screen 3xl:flex 3xl:w-60 3xl:flex-col text-Intone-600 px-2 text-xl bg-Intone-100 ">
                <div className='flex 3xl:flex-col max-2xl:justify-between relative'>
                    <h1 className="3xl:my-4 hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer">
                        <a className="text-4xl font-bold mx-auto text-Intone-500" href=''>inTone</a></h1>
                    <input type='text'
                        placeholder='Search Albums,Gear,Players and more' name='sidebar-search'
                        className='text-sm h-10 my-auto 3xl:w-full max-2xl:w-1/2 rounded-3xl px-4 py-2 3xl:mb-4 text-black'
                        value={query}
                        onChange={handleInputChange}
                        autoComplete='off'
                        ></input>
                    {showResults && results && nrResults > 0 && (
                        <div className='bg-gray-800 absolute 3xl:top-[134px] max-2xl:top-12 right-4 z-50 px-2 mt-2 py-2 rounded-2xl cursor-pointer max-h-[300px] overflow-auto scrollbar-blue-thin'>
                            <>
                                {results.map((result) => (
                                    <div key={`${result.id}-${result.model_type}`} className='flex justify-between hover:bg-gray-700 p-2 rounded-2xl'
                                        onClick={() => handleSearchResultClick(result)}>
                                        <p>{result.name}</p>
                                        <p className='ml-2 text-Intone-300'>{result.model_type.charAt(0).toUpperCase() + result.model_type.slice(1).toLowerCase()}</p>
                                    </div>
                                ))}
                            </>
                        </div>
                    )}
                </div>

                <div className="flex">
                    <ul className="max-2xl:flex justify-between max-2xl:mx-auto max-md:hidden ">
                        {userData && (
                            <li className='3xl:mb-4 max-2xl:mx-2 flex flex-row max-2xl:flex-col justify-start max-2xl:mb-2'>
                                <a className=" hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer max-2xl:hidden" onClick={handleProfileClick}>{userData.name}</a>
                                {userData.profile_pic && (
                                    <img src={`static/profile_pictures/${userData.profile_pic}`} className='object-cover w-12 h-12 cursor-pointer rounded-2xl' onClick={handleProfileClick} />

                                )}
                            </li>
                        )}
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-all-posts' onClick={() => ShowAllX('albums')}>Albums</a>
                        </li>
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-following' onClick={() => ShowAllX('bands')}>Bands</a>
                        </li>
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-following' onClick={() => ShowAllX('gear')}>Gear</a>
                        </li>
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-following' onClick={() => ShowAllX('players')}>Players</a>
                        </li>
                        {isLoggedIn ? (
                            <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                                <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3" href="/logout">Log Out</a>
                            </li>
                        ) : null}
                        {!isLoggedIn && (
                            <div className="max-2xl:flex max-2xl:justify-between">
                                <li className="3xl:mb-4 max-md:mx-2 max-2xl:mb-2">
                                    <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer"
                                        onClick={handleLogInClick}>Log In</a>
                                </li>
                                <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                                    <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer"
                                        onClick={handleRegisterClick}>Register</a>
                                </li>
                            </div>
                        )}
                    </ul>
                    {isMenuOpen && (
                        <ul className="md:hidden absolute right-6 top-32 bg-gray-600 px-4 py-4 z-50 rounded-2xl">
                        {userData && (
                            <li className='3xl:mb-4 max-2xl:mx-2 flex flex-row max-2xl:flex-col justify-start max-2xl:mb-2'>
                                <a className=" hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" onClick={handleProfileClick}>{userData.name}</a>
                                {userData.profile_pic && (
                                    <img src={`static/profile_pictures/${userData.profile_pic}`} className='object-cover w-12 h-12 cursor-pointer rounded-2xl' onClick={handleProfileClick} />

                                )}
                            </li>
                        )}
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-all-posts' onClick={() => ShowAllX('albums')}>Albums</a>
                        </li>
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-following' onClick={() => ShowAllX('bands')}>Bands</a>
                        </li>
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-following' onClick={() => ShowAllX('gear')}>Gear</a>
                        </li>
                        <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                            <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer" id='sidebar-following' onClick={() => ShowAllX('players')}>Players</a>
                        </li>
                        {isLoggedIn ? (
                            <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                                <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3" href="/logout">Log Out</a>
                            </li>
                        ) : null}
                        {!isLoggedIn && (
                            <div className="max-2xl:flex max-2xl:justify-between">
                                <li className="3xl:mb-4 max-md:mx-2 max-2xl:mb-2">
                                    <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer"
                                        onClick={handleLogInClick}>Log In</a>
                                </li>
                                <li className="3xl:mb-4 max-2xl:mx-2 max-2xl:mb-2">
                                    <a className="hover:bg-Intone-700 rounded-3xl px-3 py-3 cursor-pointer"
                                        onClick={handleRegisterClick}>Register</a>
                                </li>
                            </div>
                        )}
                    </ul>   
                    )}
                    <button
        className="md:hidden hover:bg-Intone-700 rounded-3xl cursor-pointer ml-auto p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
      <FontAwesomeIcon icon={faBars} className='' />
      </button>
                                     

                </div>

            </nav>
            {showLogIn && <LogIn handleRegisterClick={handleRegisterClick} />}
            {showRegister && <Register handleLogInClick={handleLogInClick} />}
            {!showLogIn && !showRegister && (
                <>
                    {showProfile && (
                        <Profile
                            userData={userData}
                            fetchUserData={fetchUserData}
                            current_user={currentUser}
                            handleProfileClick={handleProfileClick}
                            handleSearchResultClick={handleSearchResultClick}
                            currentUserId={currentUserId}
                            fetchSingleEntry={fetchSingleEntry}
                            AllEntriesData={data}
                        />
                    )}

                    {otherUserData && showOtherProfile && (
                        <Profile
                            userData={otherUserData}
                            fetchUserData={fetchOtherUserData}
                            current_user={currentUser}
                            handleProfileClick={handleProfileClick}
                            handleSearchResultClick={handleSearchResultClick}
                            currentUserId={currentUserId}
                            fetchSingleEntry={fetchSingleEntry}
                            AllEntriesData={data}
                        />
                    )}
                </>
            )}
            {!showLogIn && !showRegister && !showOtherProfile && !showProfile && (
                <MainPageItems
                    fetchSingleEntry={fetchSingleEntry}
                    exitSingleView={exitSingleView}
                    singleView={singleView}
                    setSingleView={setSingleView}
                    singleViewType={singleViewType}
                    singleEntryData={singleEntryData}
                    showEntryType={showEntryType}
                    showOnlyEntryType={showOnlyEntryType}
                    AllEntriesData={data}
                    currentUserId={currentUserId}
                    handleUserMessageClick={handleUserMessageClick}
                />
            )}

        </div>
    )
}

export default Sidebar