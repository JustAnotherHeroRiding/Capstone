import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';



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

