import { useEffect, useState } from 'react'
import './App.css'
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faCircleLeft, faFaceSmile, faPlus, faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { AddAlbumForm, AddGearForm, AddPlayerForm, AddBandForm, AddNewConnection, NewReviewForm, NewEntryComment,WishlistAddRemove } from './Forms.jsx';

function MainPageItems({
    fetchSingleEntry, exitSingleView, singleView, singleViewType,
    singleEntryData, showEntryType, showOnlyEntryType, AllEntriesData, setSingleView, currentUserId, handleUserMessageClick }) {
    const csrftoken = Cookies.get('csrftoken');

    const [AllEntries, setAllEntries] = useState([])
    const [reviewScore, setReviewScore] = useState(0);

    const calculateReviewScore = () => {
        if (singleEntryData.model_type === 'gear' | singleEntryData.model_type === 'album') {
            if (singleEntryData.reviews.length !== 0) {
                const totalScore = singleEntryData.reviews.reduce((accumulator, review) => {
                    return accumulator + review.stars;
                }, 0);
                const averageScore = totalScore / singleEntryData.reviews.length;
                setReviewScore(averageScore);
            } else if (singleEntryData.reviews.length === 0) {
                setReviewScore(0)
            }
        }
    }

    const [reviewErrorMessage, setReviewErrorMessage] = useState('')


    const fetchAllEntries = () => {
        fetch('entries/get/all')
            .then(response => response.json())
            .then(data => setAllEntries(data))
            .catch(error => console.error(error));
    }

    useEffect(() => {
        setAllEntries(AllEntriesData)
    }, [AllEntriesData]);

    useEffect(() => {
        setReviewErrorMessage('');
        calculateReviewScore()
    }, [singleEntryData]);


    const [showForm, setShowForm] = useState(false)
    const [addEntryType, setAddEntryType] = useState('')

    const toggleAddForm = () => {
        setShowForm(!showForm)
        setAddEntryType('')
    }

    const typeToBeAdded = (type) => {
        setAddEntryType(type)
    }

    const [newConnection, setNewConnection] = useState(false)
    const [connectionType, setConnectionType] = useState('')

    const toggleConnectionForm = (connection_type) => {
        setNewConnection(!newConnection)
        setConnectionType(connection_type)
    }


    const deleteEntry = (entryType, entryId) => {
        fetch(`entries/delete/${entryType}/${entryId}`)
            .then(response => response.json())
            .then(data => {
                fetchAllEntries()
                setSingleView(false)
            })
            .catch(error => console.error(error));
    }

    const deleteConnection = (origin, connection_type, connection_id) => {
        fetch(`entries/connection/delete/${origin.model_type}/${parseInt(origin.id, 10)}/${connection_type}/${parseInt(connection_id, 10)}`)
            .then(response => response.json())
            .then(data => {
                fetchSingleEntry(origin.model_type, origin.id)
            })
            .catch(error => console.error(error));
    }






    return (
        <div className='relative'>
            <div className={showForm ? 'newentryparent z-10' : 'hidden'}>
                <div className="max-w-md mx-auto mt-6 w-full px-6 py-12 right-1/2 popup
        border border-indigo-200 rounded-3xl shadow-2xl z-10 bg-Intone-700">
                    <h1 className='flex justify-center mb-4'>What Would you like to add?</h1>
                    <ul className='flex flex-row justify-between mb-6'>
                        <li className={`border border-indigo-200 px-4 py-2 rounded-2xl cursor-pointer ${addEntryType === 'album' ? 'bg-Intone-300' : 'hover:bg-Intone-100'}`}
                            onClick={() => typeToBeAdded('album')}>
                            Album
                        </li>
                        <li className={`border border-indigo-200 px-4 py-2 rounded-2xl cursor-pointer ${addEntryType === 'band' ? 'bg-Intone-300' : 'hover:bg-Intone-100'}`}
                            onClick={() => typeToBeAdded('band')}>
                            Band
                        </li>
                        <li className={`border border-indigo-200 px-4 py-2 rounded-2xl cursor-pointer ${addEntryType === 'gear' ? 'bg-Intone-300' : 'hover:bg-Intone-100'}`}
                            onClick={() => typeToBeAdded('gear')}>
                            Gear
                        </li>
                        <li className={`border border-indigo-200 px-4 py-2 rounded-2xl cursor-pointer ${addEntryType === 'player' ? 'bg-Intone-300' : 'hover:bg-Intone-100'}`}
                            onClick={() => typeToBeAdded('player')}>
                            Player
                        </li>
                    </ul><a className="cursor-pointer border border-indigo-200 absolute top-4 right-4 rounded-2xl bg-Intone-300 px-2"
                        onClick={toggleAddForm} >X</a>
                    {addEntryType === 'album' && (
                        <AddAlbumForm AllEntriesData={AllEntries} fetchAllEntries={fetchAllEntries} />
                    )}
                    {addEntryType === 'gear' && (
                        <AddGearForm AllEntriesData={AllEntries} fetchAllEntries={fetchAllEntries} />
                    )}
                    {addEntryType === 'player' && (
                        <AddPlayerForm AllEntriesData={AllEntries} fetchAllEntries={fetchAllEntries} />
                    )}
                    {addEntryType === 'band' && (
                        <AddBandForm AllEntriesData={AllEntries} fetchAllEntries={fetchAllEntries} />
                    )}



                </div>
            </div>
            {currentUserId && (
                <button className='flex border border-indigo-200 px-4 py-2 rounded-3xl mx-auto mt-6 hover:bg-Intone-300 hover:text-black' onClick={toggleAddForm}>Add</button>
            )}
            {showOnlyEntryType ? (
                <div className='flex justify-center flex-col'>
                    <h1 className='mx-auto mt-6 text-3xl text-Intone-500'>{showEntryType.charAt(0).toUpperCase() + showEntryType.slice(1).toLowerCase()}</h1>
                    <div className='mt-6'>
                        {AllEntries[showEntryType] && (
                            <div className='flex justify-center md:flex-row flex-col'>
                                {AllEntries[showEntryType].map((entry) => (
                                    <div key={entry.id} onClick={() => fetchSingleEntry(entry.model_type, entry.id)}
                                        className='border cursor-pointer border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100 mr-6 max-md:mb-6 max-md:mx-auto'>
                                        <h1 className='text-2xl font-bold flex justify-center w-40'
                                        >{entry.name}</h1>
                                        {entry.model_type === 'band' && (
                                            <img src={`static/band_pics/${entry.picture}`} className='object-cover w-40 h-40 mx-auto ' />
                                        )}
                                        {entry.model_type === 'gear' && (
                                            <img src={`static/gear_images/${entry.picture}`} className='object-cover mx-auto w-40 h-40' />
                                        )}
                                        {entry.model_type === 'player' && (
                                            <img src={`static/player_pics/${entry.picture}`} className='object-cover mx-auto w-40 h-40' />
                                        )}
                                        {entry.model_type === 'album' && (
                                            <img src={`static/album_covers/${entry.cover_art_url}`} className='object-cover mx-auto w-40 h-40 flex' />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    {!singleView && (
                        <ul className='flex md:flex-row max-md:flex-col justify-center mt-6 '>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto max-w-[80%] overflow-auto scrollbar-blue-thin'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Bands</h1>
                                <div className='mt-6 '>
                                    {AllEntries.bands && (
                                        <div className='flex flex-row md:flex-col'>
                                            {AllEntries.bands.map((band) => (
                                                <div key={band.id} onClick={() => fetchSingleEntry(band.model_type, band.id)}
                                                    className='border cursor-pointer border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100 mb-4 mr-4'>
                                                    <h1 className='text-2xl font-bold flex justify-center w-40'
                                                    >{band.name}</h1>
                                                    <img src={`static/band_pics/${band.picture}`} className='object-cover w-40 h-40 mx-auto' />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto max-w-[80%] overflow-auto scrollbar-blue-thin'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Albums</h1>
                                <div className='mt-6'>
                                    {AllEntries.albums && (
                                        <div className='flex flex-row md:flex-col'>
                                            {AllEntries.albums.map((album) => (
                                                <div key={album.id} onClick={() => fetchSingleEntry(album.model_type, album.id)}
                                                    className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4 mr-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                    <h1 className='text-2xl font-bold flex justify-center w-40'
                                                    >{album.name}</h1>
                                                    <img src={`static/album_covers/${album.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto max-w-[80%] overflow-auto scrollbar-blue-thin'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Gear</h1>

                                <div className='mt-6'>
                                    {AllEntries.gear && (
                                        <div className='flex flex-row md:flex-col'>
                                            {AllEntries.gear.map((gear) => (
                                                <div key={gear.id} onClick={() => fetchSingleEntry(gear.model_type, gear.id)}
                                                    className='border border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100 cursor-pointer mb-4 mr-4'>
                                                    <h1 className='text-2xl font-bold flex justify-center w-40'
                                                    >{gear.name}</h1>
                                                    <img src={`static/gear_images/${gear.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div></li>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto max-w-[80%] overflow-auto scrollbar-blue-thin'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Players</h1>
                                <div className='mt-6 '>
                                    {AllEntries.players && (
                                        <div className='flex flex-row md:flex-col'>
                                            {AllEntries.players.map((player) => (
                                                <div key={player.id} onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                    className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer mr-4'>
                                                    <h1 className='text-2xl font-bold flex justify-center w-40'
                                                    >{player.name}</h1>
                                                    <img src={`static/player_pics/${player.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </li>

                        </ul>
                    )}
                    {singleView && (
                        <div className='flex justify-center relative'>
                            {newConnection && (
                                <div className='newentryparent z-10'>
                                    <div
                                        className="max-w-md mx-auto mt-6 w-full px-6 py-12 right-1/2 popup
                                                                border border-indigo-200 rounded-3xl shadow-2xl z-10 bg-Intone-700">
                                        <a className="cursor-pointer border border-indigo-200 absolute top-4 right-4 rounded-2xl bg-Intone-300 px-2"
                                            onClick={toggleConnectionForm} >X</a>
                                        <AddNewConnection AllEntriesData={AllEntries}
                                            fetchAllEntries={fetchAllEntries} origin={singleEntryData}
                                            connection={connectionType} fetchSingleEntry={fetchSingleEntry} />
                                    </div>
                                </div>
                            )}
                            <div className='flex flex-col'>
                                <FontAwesomeIcon
                                    icon={faCircleLeft}
                                    onClick={exitSingleView}
                                    className='cursor-pointer h-8 w-8 ml-auto hover:scale-110 transition-transform duration-200 my-6'
                                />
                                {singleViewType === 'gear' && (
                                    <>
                                        <div className='flex flex-col'>
                                            <WishlistAddRemove singleEntryData={singleEntryData} currentUserId={currentUserId} />
                                            <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl pt-6 relative'>

                                                {currentUserId === 2 && (
                                                    <a className="cursor-pointer border border-indigo-200 top-4 justify-end 
                                        flex absolute ml-auto right-4 rounded-2xl hover:bg-Intone-300 px-2"
                                                        onClick={() => deleteEntry(singleEntryData.model_type, singleEntryData.id)} >X</a>
                                                )}
                                                <div className='mb-auto'>
                                                    <h1 className='text-2xl font-bold my-4 w-72'>{singleEntryData.name}</h1>
                                                    <img src={`static/gear_images/${singleEntryData.picture}`} className='object-cover w-60 h-60 mb-6' />
                                                    <p className='w-80'>{singleEntryData.description}</p>
                                                    {singleEntryData.tonehunt_url !== 'N/A' && (
                                                        <a className='text-Intone-300 hover:underline' href={singleEntryData.tonehunt_url}>Nam Capture</a>
                                                    )}
                                                </div>
                                                <div className='mb-auto mr-6'>
                                                    <h1 className='flex justify-center my-4 text-2xl font-bold'>Used By
                                                        <FontAwesomeIcon icon={faPlus}
                                                            className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                            onClick={() => toggleConnectionForm('player')}
                                                        /></h1>
                                                    {singleEntryData.players.map((player) => (
                                                        <div key={player.id} className='flex flex-col'>
                                                            {currentUserId === 2 && (
                                                                <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                    onClick={() => deleteConnection(singleEntryData, player.model_type, player.id)} >X</a>
                                                            )}
                                                            <div onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                                className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                                <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                                >{player.name}</h1>
                                                                <img src={`static/player_pics/${player.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                            </div>
                                                        </div>

                                                    ))}
                                                </div>
                                                <div className='mb-auto'>
                                                    <h1 className='flex justify-center my-4 text-2xl font-bold'>Used On
                                                        <FontAwesomeIcon icon={faPlus}
                                                            className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                            onClick={() => toggleConnectionForm('album')}
                                                        /></h1>
                                                    {singleEntryData.albums.map((album) => (
                                                        <div key={album.id} className='flex flex-col'>
                                                            {currentUserId === 2 && (
                                                                <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                    onClick={() => deleteConnection(singleEntryData, album.model_type, album.id)} >X</a>
                                                            )}
                                                            <div onClick={() => fetchSingleEntry(album.model_type, album.id)}
                                                                className='border border-indigo-200 px-4 py-6 rounded-2xl  mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                                <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                                >{album.name}</h1>
                                                                <img src={`static/album_covers/${album.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='flex flex-col border border-indigo-200 rounded-2xl px-4 py-2 mt-6'>
                                                <p className='text-Intone-300 font-bold text-xl mx-auto'>
                                                    {reviewScore}<FontAwesomeIcon icon={faStar} className='text-yellow-400' /></p>
                                                <NewReviewForm
                                                    singleEntryData={singleEntryData} fetchSingleEntry={fetchSingleEntry} setReviewErrorMessage={setReviewErrorMessage} />
                                                <p className='mx-auto text-red-400'>{reviewErrorMessage}</p>
                                                <div className='px-2 py-4 md:ml-6'>
                                                    <div className='w-96 max-h-[350px] scrollbar-blue-thin overflow-y-auto'>
                                                        <div className='mr-4'>
                                                            {singleEntryData.reviews.map(review => (
                                                                <div key={review.id}>
                                                                    {review.gear && review.gear.id === singleEntryData.id && (
                                                                        <div className='w-full flex flex-col border px-4 pt-2 rounded-lg border-indigo-900 mb-6 pb-4'>
                                                                            <div className='flex'>
                                                                                {[...Array(Math.floor(review.stars))].map((_, index) => (
                                                                                    <FontAwesomeIcon icon={faStar} className='text-yellow-400' key={`full-star-${index}`} />
                                                                                ))}
                                                                                {review.stars % 1 !== 0 && (
                                                                                    <FontAwesomeIcon icon={faStarHalfStroke} className='text-yellow-400' key={`half-star-${review.id}`} />)}
                                                                                {[...Array(5 - Math.ceil(review.stars))].map((_, index) => (
                                                                                    <FontAwesomeIcon icon={farStar} className='text-yellow-400' key={`empty-star-${index}`} />
                                                                                ))}
                                                                            </div>
                                                                            <p className='whitespace-pre-line mb-2'>{review.text}</p>
                                                                            <div className='flex justify-between'>
                                                                                <div className='flex flex-row'>
                                                                                    <img src={`static/profile_pictures/${review.user.profile_pic}`}
                                                                                        className='object-cover w-8 h-8 rounded-full mr-2'></img>
                                                                                    <p className='text-Intone-300 hover:text-Intone-900 cursor-pointer font-bold'
                                                                                        onClick={() => handleUserMessageClick(review.user)}>{review.user.name}</p>
                                                                                </div>
                                                                                <p>
                                                                                    {review.is_edited && (
                                                                                        <span className=' text-gray-500'>*</span>
                                                                                    )}
                                                                                    {review.created_at}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <NewEntryComment singleEntryData={singleEntryData} fetchSingleEntry={fetchSingleEntry} handleUserMessageClick={handleUserMessageClick} />

                                        </div>
                                    </>
                                )}
                                {singleViewType === 'band' && (
                                    <>
                                        <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl pt-6 relative'>
                                            {currentUserId === 2 && (
                                                <a className="cursor-pointer border border-indigo-200 top-4 justify-end 
                                        flex absolute ml-auto right-4 rounded-2xl hover:bg-Intone-300 px-2"
                                                    onClick={() => deleteEntry(singleEntryData.model_type, singleEntryData.id)} >X</a>
                                            )}
                                            <div className='mb-auto'>
                                                <h1 className='text-2xl font-bold my-4 w-72'>{singleEntryData.name}</h1>
                                                <img src={`static/band_pics/${singleEntryData.picture}`} className='object-cover w-60 h-60' />
                                                <p className='w-80'>{singleEntryData.description}</p>
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Albums
                                                    <FontAwesomeIcon icon={faPlus}
                                                        className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                        onClick={() => toggleConnectionForm('album')}
                                                    /></h1>
                                                {singleEntryData.albums.map((album) => (
                                                    <div key={album.id} className='flex flex-col'>
                                                        <div onClick={() => fetchSingleEntry(album.model_type, album.id)}
                                                            className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                            <h1 className='text-2xl font-bold flex justify-center mb-4 w-40'
                                                            >{album.name}</h1>
                                                            <img src={`static/album_covers/${album.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Guitar Players
                                                    <FontAwesomeIcon icon={faPlus}
                                                        className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                        onClick={() => toggleConnectionForm('player')}
                                                    />
                                                </h1>
                                                {singleEntryData.players.map((player) => (
                                                    <div key={player.id} className='flex flex-col'>
                                                        {currentUserId === 2 && (
                                                            <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                onClick={() => deleteConnection(singleEntryData, player.model_type, player.id)} >X</a>
                                                        )}
                                                        <div onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                            className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                            <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                            >{player.name}</h1>
                                                            <img src={`static/player_pics/${player.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <NewEntryComment singleEntryData={singleEntryData} fetchSingleEntry={fetchSingleEntry} handleUserMessageClick={handleUserMessageClick} />

                                    </>
                                )}
                                {singleViewType === 'album' && (
                                    <>
                                        <div className='flex flex-col'>
                                            <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl relative pt-6'>
                                                {currentUserId === 2 && (
                                                    <a className="cursor-pointer border border-indigo-200 top-4 justify-end 
                                        flex absolute ml-auto right-4 rounded-2xl hover:bg-Intone-300 px-2"
                                                        onClick={() => deleteEntry(singleEntryData.model_type, singleEntryData.id)} >X</a>
                                                )}
                                                <div className='mb-auto'>

                                                    <h1 className='text-2xl font-bold my-4 w-72'>{singleEntryData.name}</h1>
                                                    <h1 className='text-2xl font-bold my-4 cursor-pointer text-Intone-300 hover:underline'
                                                        onClick={() => fetchSingleEntry('band', singleEntryData.band_id)}>
                                                        {singleEntryData.band}</h1>
                                                    <img src={`static/album_covers/${singleEntryData.cover_art_url}`} className='object-cover w-40 h-40' />
                                                    <p className='w-80'>{singleEntryData.description}</p>

                                                </div>
                                                <div className='mb-auto mr-6'>
                                                    <h1 className='flex justify-center my-4 text-2xl font-bold'>Guitar Players
                                                        <FontAwesomeIcon icon={faPlus}
                                                            className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                            onClick={() => toggleConnectionForm('player')}
                                                        /></h1>
                                                    {singleEntryData.players.map((player) => (
                                                        <div key={player.id} className='flex flex-col'>
                                                            {currentUserId === 2 && (
                                                                <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                    onClick={() => deleteConnection(singleEntryData, player.model_type, player.id)} >X</a>
                                                            )}
                                                            <div onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                                className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                                <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                                >{player.name}</h1>
                                                                <img src={`static/player_pics/${player.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className='mb-auto'>
                                                    <h1 className='flex justify-center my-4 text-2xl font-bold'>Gear Used
                                                        <FontAwesomeIcon icon={faPlus}
                                                            className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                            onClick={() => toggleConnectionForm('gear')}
                                                        /></h1>
                                                    {singleEntryData.gear.map((gear) => (
                                                        <div key={gear.id} className='flex flex-col'>
                                                            {currentUserId === 2 && (
                                                                <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                    onClick={() => deleteConnection(singleEntryData, gear.model_type, gear.id)} >X</a>
                                                            )}
                                                            <div onClick={() => fetchSingleEntry(gear.model_type, gear.id)}
                                                                className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                                <h1 className='text-2xl font-bold flex justify-center mb-4 w-40'
                                                                >{gear.name}</h1>
                                                                <img src={`static/gear_images/${gear.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='flex flex-col border border-indigo-200 rounded-2xl px-4 py-2 mt-6'>
                                                <p className='text-Intone-300 font-bold text-xl mx-auto'>
                                                    {reviewScore}<FontAwesomeIcon icon={faStar} className='text-yellow-400' /></p>
                                                <NewReviewForm
                                                    singleEntryData={singleEntryData} fetchSingleEntry={fetchSingleEntry} setReviewErrorMessage={setReviewErrorMessage} />
                                                <p className='mx-auto text-red-400'>{reviewErrorMessage}</p>
                                                <div className='px-2 py-4 md:ml-6'>
                                                    <div className='w-96 max-h-[350px] scrollbar-blue-thin overflow-y-auto'>
                                                        <div className='mr-4'>
                                                            {singleEntryData.reviews.map(review => (
                                                                <div key={review.id}>
                                                                    {review.album && review.album.id === singleEntryData.id && (
                                                                        <div className='w-full flex flex-col border px-4 pt-2 rounded-lg border-indigo-900 mb-6 pb-4'>
                                                                            <div className='flex'>
                                                                                {[...Array(Math.floor(review.stars))].map((_, index) => (
                                                                                    <FontAwesomeIcon icon={faStar} className='text-yellow-400' key={`full-star-${index}`} />
                                                                                ))}
                                                                                {review.stars % 1 !== 0 && (
                                                                                    <FontAwesomeIcon icon={faStarHalfStroke} className='text-yellow-400' key={`half-star-${review.id}`} />)}
                                                                                {[...Array(5 - Math.ceil(review.stars))].map((_, index) => (
                                                                                    <FontAwesomeIcon icon={farStar} className='text-yellow-400' key={`empty-star-${index}`} />
                                                                                ))}
                                                                            </div>
                                                                            <p className='whitespace-pre-line mb-2'>{review.text}</p>
                                                                            <div className='flex justify-between'>
                                                                                <div className='flex flex-row'>
                                                                                    <img src={`static/profile_pictures/${review.user.profile_pic}`}
                                                                                        className='object-cover w-8 h-8 rounded-full mr-2'></img>
                                                                                    <p className='text-Intone-300 hover:text-Intone-900 cursor-pointer font-bold'
                                                                                        onClick={() => handleUserMessageClick(review.user)}>{review.user.name}</p>
                                                                                </div>
                                                                                <p>
                                                                                    {review.is_edited && (
                                                                                        <span className=' text-gray-500'>*</span>
                                                                                    )}
                                                                                    {review.created_at}
                                                                                </p>
                                                                            </div>

                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <NewEntryComment singleEntryData={singleEntryData} fetchSingleEntry={fetchSingleEntry} handleUserMessageClick={handleUserMessageClick} />
                                        </div>
                                    </>
                                )}
                                {singleViewType === 'player' && (
                                    <>
                                        <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl pt-6 relative'>
                                            {currentUserId === 2 && (
                                                <a className="cursor-pointer border border-indigo-200 top-4 justify-end 
                                        flex absolute ml-auto right-4 rounded-2xl hover:bg-Intone-300 px-2"
                                                    onClick={() => deleteEntry(singleEntryData.model_type, singleEntryData.id)} >X</a>
                                            )}
                                            <div className='mb-auto'>
                                                <h1 className='text-2xl font-bold my-4 w-72'>{singleEntryData.name}</h1>
                                                <img src={`static/player_pics/${singleEntryData.picture}`} className='object-cover w-40 h-40' />
                                                <p className='w-80'>{singleEntryData.description}</p>
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Bands
                                                    <FontAwesomeIcon icon={faPlus}
                                                        className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                        onClick={() => toggleConnectionForm('band')}
                                                    /></h1>
                                                {singleEntryData.bands.map((band) => (
                                                    <div key={band[1]} className='flex flex-col'>
                                                        {currentUserId === 2 && (
                                                            <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                onClick={() => deleteConnection(singleEntryData, 'band', band[1])} >X</a>
                                                        )}
                                                        <div onClick={() => fetchSingleEntry('band', band[1])}
                                                            className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                            <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                            >{band[0]}</h1>
                                                            <img src={`static/band_pics/${band[2]}`} className='object-cover mx-auto w-40 h-40' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Albums
                                                    <FontAwesomeIcon icon={faPlus}
                                                        className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                        onClick={() => toggleConnectionForm('album')}
                                                    /></h1>
                                                {singleEntryData.albums.map((album) => (
                                                    <div key={album.id} className='flex flex-col'>
                                                        {currentUserId === 2 && (
                                                            <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                onClick={() => deleteConnection(singleEntryData, album.model_type, album.id)} >X</a>
                                                        )}
                                                        <div onClick={() => fetchSingleEntry('album', album.id)}
                                                            className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                            <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                            >{album.name}</h1>
                                                            <img src={`static/album_covers/${album.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold items-center'>Gear
                                                    <FontAwesomeIcon icon={faPlus}
                                                        className='cursor-pointer hover:scale-110 hover:text-Intone-300 transition-transform 
                                                duration-200 ml-2 border border-indigo-200 p-1 rounded-2xl'
                                                        onClick={() => toggleConnectionForm('gear')}
                                                    />
                                                </h1>
                                                {singleEntryData.gear.map((gear) => (
                                                    <div key={gear.id} className='flex flex-col'>
                                                        {currentUserId === 2 && (
                                                            <a className="cursor-pointer border border-indigo-200 rounded-2xl bg-Intone-300 hover:bg-Intone-900 px-2 ml-auto mb-2"
                                                                onClick={() => deleteConnection(singleEntryData, gear.model_type, gear.id)} >X</a>
                                                        )}
                                                        <div onClick={() => fetchSingleEntry(gear.model_type, gear.id)}
                                                            className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                            <h1 className='text-2xl font-bold flex justify-center mb-4 w-40'
                                                            >{gear.name}</h1>
                                                            <img src={`static/gear_images/${gear.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <NewEntryComment singleEntryData={singleEntryData} fetchSingleEntry={fetchSingleEntry} handleUserMessageClick={handleUserMessageClick} />
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>)}


        </div>
    )

}

export default MainPageItems