import { useEffect, useState } from 'react'
import './App.css'
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faCircleLeft, faFaceSmile } from '@fortawesome/free-solid-svg-icons'


function MainPageItems() {
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

    const [singleView, setSingleView] = useState(false)
    const [singleViewType, setSingleViewType] = useState('')

    const [singleEntryData, setSingleEntryData] = useState([])

    const fetchSingleEntry = (entryType, entryId) => {
        fetch(`entries/${entryType}/${entryId}`)
            .then(response => response.json())
            .then(data => {
                setSingleEntryData(data)
                setSingleViewType(entryType)
                setSingleView(true)
            })
            .catch(error => console.error(error));
    }

    function exitSingleView() {
        if (singleView) {
            setSingleView(false)
        }
    }


    return (
        <div className=''>
            {!singleView && (
                <ul className='flex md:flex-row max-md:flex-col justify-center mt-6 max-md:ml-0 md:ml-[500px]'>
                    <li className='mr-12 min-w-[200px]'>
                        <h1 className='flex justify-center'>Bands</h1>
                        <div className='mt-6'>
                            {AllEntries.bands && (
                                <div>
                                    {AllEntries.bands.map((band) => (
                                        <div key={band.id} className='border border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100s'>
                                            <h1 className='cursor-pointer text-2xl font-bold flex justify-center'
                                             onClick={() => fetchSingleEntry(band.model_type, band.id)}>{band.name}</h1>
                                            <img src={`static/band_pics/${band.picture}`} className='object-cover w-40 h-40 mx-auto' />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </li>
                    <li className='mr-12 min-w-[200px]'>
                        <h1 className='flex justify-center'>Albums</h1>

                    </li>
                    <li className='mr-12 min-w-[200px]'>
                        <h1 className='flex justify-center'>Gear</h1>

                        <div className='mt-6'>
                            {AllEntries.gear && (
                                <div>
                                    {AllEntries.gear.map((gear) => (
                                        <div key={gear.id} className='border border-indigo-200 px-4 py-6 rounded-2xl hover:bg-Intone-100'>
                                            <h1 className='cursor-pointer text-2xl font-bold flex justify-center'
                                                onClick={() => fetchSingleEntry(gear.model_type, gear.id)}>{gear.name}</h1>
                                            <img src={`static/gear_images/${gear.image}`} className='object-cover mx-auto w-40 h-40' />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div></li>
                    <li className='mr-12 min-w-[200px]'>
                        <h1 className='flex justify-center'>Players</h1>

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
                                <div className='flex items-center flex-col border border-indigo px-6 py-4 rounded-3xl'>
                                    <h1 className='text-2xl font-bold my-4'>{singleEntryData.name}</h1>
                                    <img src={`static/gear_images/${singleEntryData.image}`} className='object-cover w-60 h-60' />
                                    <p className='w-80'>{singleEntryData.description}</p>
                                </div>
                            </>
                        )}
                        {singleViewType === 'band' && (
                            <>
                            <div className='flex items-center flex-col border border-indigo px-6 py-4 rounded-3xl'>

                                <h1 className='text-2xl font-bold my-4'>{singleEntryData.name}</h1>
                                <img src={`static/band_pics/${singleEntryData.picture}`} className='object-cover w-60 h-60' />
                                <p className='w-80'>{singleEntryData.description}</p>
                                </div>
                            </>
                        )}
                        {singleViewType === 'album' && (
                            <>
                                <h1 className='text-2xl font-bold my-4'>{singleEntryData.title}</h1>
                                <img src={`static/album_art/${singleEntryData.cover}`} className='object-cover w-40 h-40' />
                                <p className='w-80'>{singleEntryData.description}</p>
                            </>
                        )}
                        {singleViewType === 'player' && (
                            <>
                                <h1 className='text-2xl font-bold my-4'>{singleEntryData.name}</h1>
                                <img src={`static/artist_pics/${singleEntryData.picture}`} className='object-cover w-40 h-40' />
                                <p className='w-80'>{singleEntryData.bio}</p>
                            </>
                        )}
                    </div>
                </div>
            )}


        </div>
    )

}

export default MainPageItems