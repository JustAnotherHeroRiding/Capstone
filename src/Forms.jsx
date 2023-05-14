import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Cookies from 'js-cookie';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons'




export function AddAlbumForm({ AllEntriesData, fetchAllEntries }) {
    const [name, setName] = useState('');
    const [band, setBand] = useState('');
    const [bands, setBands] = useState([]);
    const [guitarPlayers, setGuitarPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [gear, setGear] = useState([]);
    const [selectedGear, setSelectedGear] = useState([]);
    const [coverArt, setCoverArt] = useState(null);
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const csrftoken = Cookies.get('csrftoken');


    useEffect(() => {
        setGuitarPlayers(AllEntriesData.players)
        setGear(AllEntriesData.gear)
        setBands(AllEntriesData.bands)
    }, [AllEntriesData]);


    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleBandChange = (e) => {
        const selectedBand = Array.from(e.target.selectedOptions, (option) => option.value);
        setBand(selectedBand);
    };

    const handleGuitarPlayersChange = (e) => {
        const selectedPlayers = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedPlayers(selectedPlayers);
    };

    const handleGearChange = (e) => {
        const selectedGear = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedGear(selectedGear);
    };

    const handleCoverArtChange = (e) => {
        setCoverArt(e.target.files[0]);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('band', band);
        formData.append('guitar_players', JSON.stringify(selectedPlayers));
        formData.append('gear', JSON.stringify(selectedGear));
        formData.append('cover_art', coverArt);
        formData.append('description', description);

        const response = await fetch(`entries/add/album`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken },

        });

        if (response.ok) {
            // Reset form fields
            setName('');
            setBand('');
            setSelectedPlayers([]);
            setSelectedGear([]);
            setCoverArt(null);
            setDescription('');
            fetchAllEntries()
            console.log('Album added successfully!');
        } else {
            const error = await response.json();
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col overflow-auto max-h-[400px] scrollbar-blue-thin text-Intone-300'>
            <label className='mr-4'>
                <p>Album Name:</p>
                <input className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black' type="text"
                    value={name} onChange={handleNameChange} name='name' />
            </label>
            <br />
            <label className='mr-4'>
                <p>
                    Band:
                </p>
                <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                    value={band} name='band_id' onChange={handleBandChange}>
                    {bands.map((band) => (
                        <option key={band.id} value={band.id}>
                            {band.name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label className='mr-4'>
                <p>
                    Guitar Players:
                </p>
                <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                    multiple value={selectedPlayers} onChange={handleGuitarPlayersChange}>
                    {guitarPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label className='mr-4'>
                <p>
                    Gear:
                </p>
                <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                    multiple value={selectedGear} onChange={handleGearChange}>
                    {gear.map((gear) => (
                        <option key={gear.id} value={gear.id}>
                            {gear.name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                <p>
                    Cover Art:
                </p>
                <input type="file" accept="image/*" onChange={handleCoverArtChange} />
            </label>
            <br />
            <label className='mr-4'>
                <p>
                    Description:
                </p>
                <textarea value={description} onChange={handleDescriptionChange}
                    className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black resize-none'></textarea>
            </label>
            <br />
            {errorMessage && <div>{errorMessage}</div>}
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <button type="submit" className='border-indigo-200 px-4 py-2 border rounded-3xl
             hover:bg-Intone-300 hover:text-black flex ml-auto mr-4'>Add Album</button>

        </form>
    );
};

export function AddGearForm({ AllEntriesData, fetchAllEntries }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([
        { value: 'guitar', label: 'Guitar' },
        { value: 'amp', label: 'Amplifier' },
        { value: 'pedal', label: 'Pedal' },
        { value: 'other', label: 'Other' },
    ]);
    const [tonehunt, setTonehunt] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const csrftoken = Cookies.get('csrftoken');

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('tonehunt_url', tonehunt);
        formData.append('description', description);
        formData.append('image', image);

        const response = await fetch(`entries/add/gear`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken },

        });

        if (response.ok) {

            fetchAllEntries();
            setName('');
            setCategory('');
            setTonehunt('');
            setImage(null);
            setDescription('');
            setErrorMessage('');
        } else {
            const error = await response.json();
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col overflow-auto max-h-[400px] scrollbar-blue-thin text-Intone-300'>
            <label className='mr-4'>
                Category:
                <select value={category} onChange={handleCategoryChange} className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label className='mr-4'>
                Name:
                <input type="text" className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black' value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label className='mr-4'>
                Tonehunt URL:
                <input type="text" className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black' value={tonehunt} onChange={(e) => setTonehunt(e.target.value)} />
            </label>
            <br />
            <label className='mr-4'>
                Image:
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </label>
            <br />
            <label className='mr-4'>
                Description:
                <textarea value={description} className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black resize-none' onChange={(e) => setDescription(e.target.value)} />
            </label>
            <br />
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            {errorMessage && <p>{errorMessage}</p>}
            <button type="submit" className='border-indigo-200 px-4 py-2 border rounded-3xl
             hover:bg-Intone-300 hover:text-black flex ml-auto mr-4'>Add Gear</button>
        </form>
    );
}


export function AddPlayerForm({ AllEntriesData, fetchAllEntries }) {
    const [name, setName] = useState('');

    const [gear, setGear] = useState([]);
    const [selectedGear, setSelectedGear] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbums, setSelectedAlbums] = useState([]);

    const [picture, setPicture] = useState(null);
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [band, setBand] = useState([]);
    const [bands, setBands] = useState([]);

    const csrftoken = Cookies.get('csrftoken');

    useEffect(() => {
        setGear(AllEntriesData.gear)
        setBands(AllEntriesData.bands)
        setAlbums(AllEntriesData.albums)
    }, [AllEntriesData]);

    const handleAlbumChange = (e) => {
        const selectedAlbum = Array.from(e.target.selectedOptions, (option) => option.value)
        setSelectedAlbums(selectedAlbum)
    }

    const handleGearChange = (e) => {
        const selectedGear = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedGear(selectedGear);
    };

    const handleBandChange = (e) => {
        const selectedBand = Array.from(e.target.selectedOptions, (option) => option.value);
        setBand(selectedBand);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('gear', JSON.stringify(selectedGear));
        formData.append('band', JSON.stringify(band))
        formData.append('album', JSON.stringify(selectedAlbums));
        formData.append('description', description);
        formData.append('picture', picture);

        const response = await fetch(`entries/add/player`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken },

        });

        if (response.ok) {

            fetchAllEntries();
            setSelectedGear([]);
            setBand([]);
            setPicture(null);
            setDescription('');
            setErrorMessage('');
        } else {
            const error = await response.json();
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col overflow-auto max-h-[400px] scrollbar-blue-thin text-Intone-300'>
            <label className='mr-4'>
                Name:
                <input type="text" className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black' value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label className='mr-4'>
                Image:
                <input type="file" onChange={(e) => setPicture(e.target.files[0])} />
            </label>
            <br />
            <label className='mr-4'>
                <p>
                    Band:
                </p>
                <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                    value={band} multiple name='band_id' onChange={handleBandChange}>
                    {bands.map((band) => (
                        <option key={band.id} value={band.id}>
                            {band.name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label className='mr-4'>
                <p>
                    Albums:
                </p>
                <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                    value={selectedAlbums} multiple name='album_ids' onChange={handleAlbumChange}>
                    {albums.map((album) => {
                        if (band.includes(album.band_id.toString())) {
                            return (
                                <option key={album.id} value={album.id}>
                                    {album.name}
                                </option>
                            );
                        } else {
                            return null
                        }
                    })}
                </select>
            </label>
            <br />
            <label className='mr-4'>
                <p>
                    Gear:
                </p>
                <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                    multiple value={selectedGear} onChange={handleGearChange}>
                    {gear.map((gear) => (
                        <option key={gear.id} value={gear.id}>
                            {gear.name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label className='mr-4'>
                Description:
                <textarea value={description} className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black resize-none' onChange={(e) => setDescription(e.target.value)} />
            </label>
            <br />
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            {errorMessage && <p>{errorMessage}</p>}
            <button type="submit" className='border-indigo-200 px-4 py-2 border rounded-3xl
             hover:bg-Intone-300 hover:text-black flex ml-auto mr-4'>Add Player</button>
        </form>
    );
}


export function AddBandForm({ AllEntriesData, fetchAllEntries }) {
    const [name, setName] = useState('');


    const [picture, setPicture] = useState(null);
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const csrftoken = Cookies.get('csrftoken');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('picture', picture);

        const response = await fetch(`entries/add/band`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken },

        });

        if (response.ok) {

            fetchAllEntries();
            setPicture(null);
            setDescription('');
            setErrorMessage('');
            setName('');
        } else {
            const error = await response.json();
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col overflow-auto max-h-[400px] scrollbar-blue-thin text-Intone-300'>
            <label className='mr-4'>
                Name:
                <input type="text" className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black' value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label className='mr-4'>
                Image:
                <input type="file" onChange={(e) => setPicture(e.target.files[0])} />
            </label>
            <br />
            <label className='mr-4'>
                Description:
                <textarea value={description} className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black resize-none' onChange={(e) => setDescription(e.target.value)} />
            </label>
            <br />
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            {errorMessage && <p>{errorMessage}</p>}
            <button type="submit" className='border-indigo-200 px-4 py-2 border rounded-3xl
             hover:bg-Intone-300 hover:text-black flex ml-auto mr-4'>Add Band</button>
        </form>
    );
}


export function AddNewConnection({ AllEntriesData, fetchAllEntries, origin, connection, fetchSingleEntry }) {

    const [gear, setGear] = useState([]);
    const [selectedGear, setSelectedGear] = useState([]);

    const [albums, setAlbums] = useState([]);
    const [selectedAlbums, setSelectedAlbums] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const [bands, setBands] = useState([]);
    const [band, setBand] = useState([]);

    const [guitarPlayers, setGuitarPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);




    console.log()

    const csrftoken = Cookies.get('csrftoken');


    useEffect(() => {
        if (connection === 'gear') {
            setGear(AllEntriesData.gear)
        } else if (connection === 'album') {
            setAlbums(AllEntriesData.albums)
        } else if (connection === 'band') {
            setBands(AllEntriesData.bands)
        } else if (connection === 'player') {
            setGuitarPlayers(AllEntriesData.players)
        }
    }, [AllEntriesData]);

    const handleGearChange = (e) => {
        const selectedGear = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedGear(selectedGear);
    };

    const handleAlbumChange = (e) => {
        const selectedAlbum = Array.from(e.target.selectedOptions, (option) => option.value)
        setSelectedAlbums(selectedAlbum)
    }

    const handleGuitarPlayersChange = (e) => {
        const selectedPlayers = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedPlayers(selectedPlayers);
    };

    const handleBandChange = (e) => {
        const selectedBand = Array.from(e.target.selectedOptions, (option) => option.value);
        setBand(selectedBand);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (connection === 'gear') {
            formData.append('gear_id', selectedGear);
        } else if (connection === 'album') {
            formData.append('album_id', selectedAlbums);
        } else if (connection === 'band') {
            formData.append('band_id', band)
        } else if (connection === 'player') {
            formData.append('player_id', selectedPlayers)
        }

        const response = await fetch(`entries/connection/${origin.model_type}/${parseInt(origin.id, 10)}/${connection}`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken },

        });

        if (response.ok) {

            fetchSingleEntry(origin.model_type, origin.id)
            setErrorMessage('');
        } else {
            const error = await response.json();
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col overflow-auto max-h-[400px] scrollbar-blue-thin text-Intone-300'>
            {connection === 'gear' && (
                <label className='mr-4'>
                    <p>
                        Gear:
                    </p>
                    <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black scrollbar-blue-thin'
                        multiple value={selectedGear} onChange={handleGearChange}>
                        {gear.map((gear) => {
                            if (!origin.gear.some((g) => g.id === gear.id)) {
                                return (
                                    <option key={gear.id} value={gear.id}>
                                        {gear.name}
                                    </option>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </select>
                </label>
            )}
            {connection === 'band' && (
                <label className='mr-4'>
                    <p>
                        Bands:
                    </p>
                    <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                        value={band} multiple name='band_id' onChange={handleBandChange}>
                        {bands.map((band) => {
                            if (!origin.bands.some(a => a[1] === band.id)) {
                                return (
                                    <option key={band.id} value={band.id}>
                                        {band.name}
                                    </option>
                                );
                            } else {
                                return null;
                            }
                        })}

                    </select>
                </label>
            )}
            {connection === 'album' && (
                <label className='mr-4'>
                    <p>
                        Albums:
                    </p>
                    <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black scrollbar-blue-thin'
                        value={selectedAlbums} multiple name='album_ids' onChange={handleAlbumChange}>
                        {albums.map((album) => {
                            if (!origin.albums.some(a => a.id === album.id)) {
                                return (
                                    <option key={album.id} value={album.id}>
                                        {album.name}
                                    </option>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </select>
                </label>
            )}

            {connection === 'player' && (
                <label className='mr-4'>
                    <p>
                        Guitar Players:
                    </p>
                    <select className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'
                        multiple value={selectedPlayers} onChange={handleGuitarPlayersChange}>
                        {guitarPlayers.map((player) => {
                            if (!origin.players.some(p => p.id === player.id)) {
                                return (
                                    <option key={player.id} value={player.id}>
                                        {player.name}
                                    </option>
                                )
                            }
                        })}
                    </select>
                </label>
            )}
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <button type="submit" className='border-indigo-200 px-4 py-2 border rounded-3xl
             hover:bg-Intone-300 hover:text-black flex ml-auto mr-4 mt-6'>Add Connection</button>
        </form>
    )
};


export function NewReviewForm({ singleEntryData, fetchSingleEntry, setReviewErrorMessage }) {
    const [stars, setStars] = useState(0);

    const MIN_TEXTAREA_HEIGHT = 32;

    // Consts for the new post textarea
    const textareaRef = useRef(null);
    const [value, setValue] = useState("");
    const onChange = (event) => setValue(event.target.value);

    // Logic for the resizing textarea
    useLayoutEffect(() => {
        // Reset height - important to shrink on delete
        textareaRef.current.style.height = "inherit";
        // Set height
        textareaRef.current.style.height = `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [value]);

    const csrftoken = Cookies.get('csrftoken');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('stars', stars);
        formData.append('text', value);

        const response = await fetch(`review/post/${singleEntryData.model_type}/${singleEntryData.id}`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken },
        });

        if (response.ok) {
            fetchSingleEntry(singleEntryData.model_type, singleEntryData.id)
            setStars(0);
            setReviewErrorMessage('');
            setValue('');
        } else {
            const error = await response.json();
            setReviewErrorMessage(error.error);
        }
    };



    return (
        <form onSubmit={handleSubmit} className='flex flex-col overflow-auto max-h-[400px] scrollbar-blue-thin text-Intone-300'>
            <label>
                <p>Stars:</p>
                <select className='w-1/4 border-solid border-2 rounded-lg py-2 px-4 text-black scrollbar-blue-thin'
                    value={stars} onChange={(e) => setStars(e.target.value)}>
                    <option value="">Select a rating</option>
                    <option value="0">0</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                    <option value="3.5">3.5</option>
                    <option value="4">4</option>
                    <option value="4.5">4.5</option>
                    <option value="5">5</option>
                </select>
            </label>
            <br />
            <label className='flex flex-col'>
                <p className='font-bold mx-auto mb-4'>
                    Text:
                </p>
                <textarea type="text"
                    onChange={onChange}
                    ref={textareaRef}
                    style={{
                        minHeight: MIN_TEXTAREA_HEIGHT,
                        maxHeight: 400
                    }}
                    value={value}
                    name="body"
                    id="body-textarea"
                    placeholder="What did you think about it?"
                    rows='4'
                    className='bg-Intone-200 px-6 placeholder:text-gray-500 outline-none resize-none border rounded-xl w-3/4 mx-auto py-2 scrollbar-blue-thin text-Intone-600' />
            </label>
            <br />
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
            <button type="submit" className='border-indigo-200 px-4 py-2 border rounded-3xl
             hover:bg-Intone-300 hover:text-black flex ml-auto mr-4 mt-6'>Submit</button>
        </form>
    );
}


export function NewEntryComment({ singleEntryData, fetchSingleEntry, handleUserMessageClick }) {

    const MIN_TEXTAREA_HEIGHT = 32;
    const csrftoken = Cookies.get('csrftoken');



    // Consts for the new post textarea
    const textareaRef = useRef(null);
    const [value, setValue] = useState("");
    const onChange = (event) => setValue(event.target.value);

    // Logic for the resizing textarea
    useLayoutEffect(() => {
        // Reset height - important to shrink on delete
        textareaRef.current.style.height = "inherit";
        // Set height
        textareaRef.current.style.height = `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [value]);

    function send_comment(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('text', value);

        fetch(`entries/add/comment/${singleEntryData.model_type}/${singleEntryData.id}`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to send comment.');
                }
            })
            .then(data => {
                setValue("")
                fetchSingleEntry(singleEntryData.model_type, singleEntryData.id)
            })
            .catch(error => {
                console.error(error);
            });
    }

    function handleEmojiSelect(emoji) {
        setValue(prevValue => prevValue + emoji.native)
      }
    
      const [showEntryCommentEmoji, setShowEntryCommentEmoji] = useState(false)
    
      function handleEmojiShow() {
        setShowEntryCommentEmoji(!showEntryCommentEmoji)
        
      }


    return (

        <div>
            <h1 className='mt-12 mb-6 text-3xl font-bold'>Comments</h1>
            <div className='flex flex-row max-md:flex-col justify-between border border-indigo-200 px-6 py-4 rounded-2xl'>
                <div className=''>
                    {showEntryCommentEmoji && (
                        <div className='absolute top-28'>
                            <Picker data={data} onEmojiSelect={(emoji) => handleEmojiSelect(emoji)} />
                        </div>
                    )}
                    <form id='newpost' onSubmit={send_comment} className='flex-col flex my-6 border px-4 rounded-3xl border-indigo-200 pt-6 w-96'>
                        <textarea type="text"
                            onChange={onChange}
                            ref={textareaRef}
                            style={{
                                minHeight: MIN_TEXTAREA_HEIGHT,
                                maxHeight: 400
                            }}
                            value={value}
                            name="postbody"
                            id="postbody"
                            placeholder={`What did you think about ${singleEntryData.name}`}
                            rows='3'
                            className='bg-Intone-200 px-6 placeholder:text-gray-500 outline-none resize-none' />
                        <hr className="border-gray-500" />
                        <div>
                            <FontAwesomeIcon icon={faFaceSmile} onClick={() => handleEmojiShow('profile_comment')}
                                className='cursor-pointer w-6 h-6 hover:scale-125 transition-transform duration-200 z-10 mt-6' />
                        </div>
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
                        <button type="submit" className='border-indigo-200 px-4 py-2 border rounded-3xl
             hover:bg-Intone-300 hover:text-black flex ml-auto mr-4 mb-6'>Submit</button>
                    </form>
                </div>
                <div className='px-2 py-4 md:ml-6'>
                    <div className='w-96 max-h-[350px] scrollbar-blue-thin overflow-y-auto'>
                        <div className='mr-4'>
                            {singleEntryData.comments.map(comment => (
                                <div key={comment.id} className='w-full flex flex-col border px-4 pt-2 rounded-lg border-indigo-900 mb-6 pb-4'>
                                    <p className='whitespace-pre-line mb-2'>{comment.text}</p>
                                    <div className='flex justify-between'>
                                        <div className='flex flex-row'>
                                            <img src={`static/profile_pictures/${comment.user_profile_pic}`} className='object-cover w-8 h-8 rounded-full mr-2'></img>
                                            <p className='text-Intone-300 hover:text-Intone-900 cursor-pointer font-bold'
                                                onClick={() => handleUserMessageClick(comment.user)}>{comment.username}</p>
                                        </div>
                                        <p>{comment.created_at}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



