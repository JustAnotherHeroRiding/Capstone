import { useEffect, useState } from 'react'
import './App.css'
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faCircleLeft, faFaceSmile } from '@fortawesome/free-solid-svg-icons'


function MainPageItems({ fetchSingleEntry, exitSingleView, singleView, singleViewType, singleEntryData, showEntryType, showOnlyEntryType }) {
    const csrftoken = Cookies.get('csrftoken');

    const [AllEntries, setAllEntries] = useState([])

    const fetchAllEntries = () => {
        fetch('entries/get/all')
            .then(response => response.json())
            .then(data => setAllEntries(data))
            .catch(error => console.error(error));
    }

    useEffect(() => {
        fetchAllEntries()
    }, []);


    const [showForm, setShowForm] = useState(false)
    const [addEntryType, setAddEntryType] = useState('')

    const toggleAddForm = () => {
        setShowForm(!showForm)
        setAddEntryType('')
    }

    const typeToBeAdded = (type) => {
        setAddEntryType(type)
    }



    return (
        <div className='relative'>
            <div className={showForm ? 'newentryparent' : 'hidden'}>
            <div className="max-w-md mx-auto mt-6 w-full px-6 py-12 right-1/2 popup
        border border-indigo-200 rounded-3xl shadow-2xl z-10 bg-Intone-700">
        <h1 className='flex justify-center mb-4'>What Would you like to add?</h1>
            <ul className='flex flex-row justify-between mb-6'>
                <li className={`border border-indigo-200 px-4 py-2 rounded-2xl hover:bg-Intone-100 cursor-pointer ${addEntryType === 'album' && 'bg-Intone-300'}`}
                onClick={() => typeToBeAdded('album')}>
                Album
                </li>
                <li className={`border border-indigo-200 px-4 py-2 rounded-2xl hover:bg-Intone-100 cursor-pointer ${addEntryType === 'band' && 'bg-Intone-300'}`}
                onClick={() => typeToBeAdded('band')}>
                Band
                </li>
                <li className={`border border-indigo-200 px-4 py-2 rounded-2xl hover:bg-Intone-100 cursor-pointer ${addEntryType === 'gear' && 'bg-Intone-300'}`}
                onClick={() => typeToBeAdded('gear')}>
                Gear
                </li>
                <li className={`border border-indigo-200 px-4 py-2 rounded-2xl hover:bg-Intone-100 cursor-pointer ${addEntryType === 'player' && 'bg-Intone-300'}`}
                onClick={() => typeToBeAdded('player')}>
                Player
                </li>
            </ul>
            <form className=''>
                    <a className="cursor-pointer border border-indigo-200 absolute top-4 right-4 rounded-2xl bg-Intone-300 px-2"
                        onClick={toggleAddForm} >X</a>

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
        </div>
            </div>
            <button className='flex border border-indigo-200 px-4 py-2 rounded-3xl mx-auto mt-6' onClick={toggleAddForm}>Add</button>
            {showOnlyEntryType ? (
                <div className='flex justify-center flex-col'>
                    <h1 className='mx-auto mt-6 text-3xl text-Intone-500'>{showEntryType.charAt(0).toUpperCase() + showEntryType.slice(1).toLowerCase()}</h1>
                    <div className='mt-6'>
                        {AllEntries[showEntryType] && (
                            <div className='flex justify-center md:flex-row flex-col'>
                                {AllEntries[showEntryType].map((entry) => (
                                    <div key={entry.id} onClick={() => fetchSingleEntry(entry.model_type, entry.id)}
                                        className='border cursor-pointer border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100 mr-6 max-md:mb-6 max-md:mx-auto'>
                                        <h1 className='text-2xl font-bold flex justify-center'
                                        >{entry.name}</h1>
                                        {entry.model_type === 'band' && (
                                            <img src={`static/band_pics/${entry.picture}`} className='object-cover w-40 h-40 mx-auto' />
                                        )}
                                        {entry.model_type === 'gear' && (
                                            <img src={`static/gear_images/${entry.image}`} className='object-cover mx-auto w-40 h-40' />
                                        )}
                                        {entry.model_type === 'player' && (
                                            <img src={`static/player_pics/${entry.picture}`} className='object-cover mx-auto w-40 h-40' />
                                        )}
                                        {entry.model_type === 'album' && (
                                            <img src={`static/album_covers/${entry.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
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
                        <ul className='flex md:flex-row max-md:flex-col justify-center mt-6 md:ml-[600px] max-md:ml-0 medium-large:ml-[500px] 2xl:ml-[100px]'>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Bands</h1>
                                <div className='mt-6 '>
                                    {AllEntries.bands && (
                                        <div className='flex flex-row md:flex-col'>
                                            {AllEntries.bands.map((band) => (
                                                <div key={band.id} onClick={() => fetchSingleEntry(band.model_type, band.id)}
                                                    className='border cursor-pointer border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100 mb-4 mr-4'>
                                                    <h1 className='text-2xl font-bold flex justify-center'
                                                    >{band.name}</h1>
                                                    <img src={`static/band_pics/${band.picture}`} className='object-cover w-40 h-40 mx-auto' />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Albums</h1>
                                <div className='mt-6'>
                                    {AllEntries.albums && (
                                        <div className='flex flex-row md:flex-col'>
                                            {AllEntries.albums.map((album) => (
                                                <div key={album.id} onClick={() => fetchSingleEntry(album.model_type, album.id)}
                                                    className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4 mr-4
                                        hover:bg-Intone-100 cursor-pointer'>
                                                    <h1 className='text-2xl font-bold flex justify-center'
                                                    >{album.name}</h1>
                                                    <img src={`static/album_covers/${album.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Gear</h1>

                                <div className='mt-6'>
                                    {AllEntries.gear && (
                                        <div className='flex flex-row md:flex-col'>
                                            {AllEntries.gear.map((gear) => (
                                                <div key={gear.id} onClick={() => fetchSingleEntry(gear.model_type, gear.id)}
                                                    className='border border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100 cursor-pointer mb-4 mr-4'>
                                                    <h1 className='text-2xl font-bold flex justify-center'
                                                    >{gear.name}</h1>
                                                    <img src={`static/gear_images/${gear.image}`} className='object-cover mx-auto w-40 h-40' />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div></li>
                            <li className='mr-12 min-w-[200px] max-md:mx-auto'>
                                <h1 className='flex justify-center text-3xl text-Intone-500'>Players</h1>
                                <div className='mt-6'>
                                    {AllEntries.players && (
                                        <div className='flex flex-row md:flex-col overflow-x-auto'>
                                            {AllEntries.players.map((player) => (
                                                <div key={player.id} onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                    className='border border-indigo-200 px-4 py-6 rounded-2xl mb-4
                                        hover:bg-Intone-100 cursor-pointer mr-4'>
                                                    <h1 className='text-2xl font-bold flex justify-center'
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
                            <div className='flex flex-col'>
                                <FontAwesomeIcon
                                    icon={faCircleLeft}
                                    onClick={exitSingleView}
                                    className='cursor-pointer h-8 w-8 hover:scale-110 transition-transform duration-200 my-6'
                                />
                                {singleViewType === 'gear' && (
                                    <>
                                        <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl'>
                                            <div className='mb-auto'>
                                                <h1 className='text-2xl font-bold my-4'>{singleEntryData.name}</h1>
                                                <img src={`static/gear_images/${singleEntryData.image}`} className='object-cover w-60 h-60 mb-6' />
                                                <p className='w-80'>{singleEntryData.description}</p>
                                                <a className='text-Intone-300 hover:underline ' href={singleEntryData.tonehunt_url}>Nam Capture</a>
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Used By</h1>
                                                {singleEntryData.players.map((player) => (
                                                    <div key={player.id} onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{player.name}</h1>
                                                        <img src={`static/player_pics/${player.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Used On</h1>
                                                {singleEntryData.albums.map((album) => (
                                                    <div key={album.id} onClick={() => fetchSingleEntry(album.model_type, album.id)}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{album.name}</h1>
                                                        <img src={`static/album_covers/${album.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </>
                                )}
                                {singleViewType === 'band' && (
                                    <>
                                        <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl'>
                                            <div className='mb-auto'>
                                                <h1 className='text-2xl font-bold my-4'>{singleEntryData.name}</h1>
                                                <img src={`static/band_pics/${singleEntryData.picture}`} className='object-cover w-60 h-60' />
                                                <p className='w-80'>{singleEntryData.description}</p>
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Albums</h1>
                                                {singleEntryData.albums.map((album) => (
                                                    <div key={album.id} onClick={() => fetchSingleEntry(album.model_type, album.id)}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center'
                                                        >{album.name}</h1>
                                                        <img src={`static/album_covers/${album.cover_art_url}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Guitar Players</h1>
                                                {singleEntryData.members.map((player) => (
                                                    <div key={player.id} onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{player.name}</h1>
                                                        <img src={`static/player_pics/${player.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {singleViewType === 'album' && (
                                    <>
                                        <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl'>
                                            <div className='mb-auto'>

                                                <h1 className='text-2xl font-bold my-4'>{singleEntryData.name}</h1>
                                                <h1 className='text-2xl font-bold my-4 cursor-pointer text-Intone-300 hover:underline' onClick={() => fetchSingleEntry('band', singleEntryData.band_id)}>
                                                    {singleEntryData.band}</h1>
                                                <img src={`static/album_covers/${singleEntryData.cover_art_url}`} className='object-cover w-40 h-40' />
                                                <p className='w-80'>{singleEntryData.description}</p>
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Guitar Players</h1>
                                                {singleEntryData.guitar_players.map((player) => (
                                                    <div key={player.id} onClick={() => fetchSingleEntry(player.model_type, player.id)}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{player.name}</h1>
                                                        <img src={`static/player_pics/${player.picture}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Gear Used</h1>
                                                {singleEntryData.gear.map((gear) => (
                                                    <div key={gear.id} onClick={() => fetchSingleEntry(gear.model_type, gear.id)}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{gear.name}</h1>
                                                        <img src={`static/gear_images/${gear.image}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {singleViewType === 'player' && (
                                    <>
                                        <div className='flex items-center md:flex-row max-md:flex-col border border-indigo px-6 py-4 rounded-3xl'>
                                            <div>
                                                <h1 className='text-2xl font-bold my-4'>{singleEntryData.name}</h1>
                                                <img src={`static/player_pics/${singleEntryData.picture}`} className='object-cover w-40 h-40' />
                                                <p className='w-80'>{singleEntryData.description}</p>
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Bands</h1>
                                                {singleEntryData.bands.map((band) => (
                                                    <div key={band[1]} onClick={() => fetchSingleEntry('band', band[1])}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{band[0]}</h1>
                                                        <img src={`static/band_pics/${band[2]}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto mr-6'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Albums</h1>
                                                {singleEntryData.albums.map((album) => (
                                                    <div key={album[1]} onClick={() => fetchSingleEntry('album', album[1])}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{album[0]}</h1>
                                                        <img src={`static/album_covers/${album[2]}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mb-auto'>
                                                <h1 className='flex justify-center my-4 text-2xl font-bold'>Gear</h1>
                                                {singleEntryData.gear.map((gear) => (
                                                    <div key={gear.id} onClick={() => fetchSingleEntry(gear.model_type, gear.id)}
                                                        className='border border-indigo-200 px-4 py-6 rounded-2xl 
                                        hover:bg-Intone-100 cursor-pointer'>
                                                        <h1 className='text-2xl font-bold flex justify-center mb-4'
                                                        >{gear.name}</h1>
                                                        <img src={`static/gear_images/${gear.image}`} className='object-cover mx-auto w-40 h-40' />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
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