import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';



export function AddAlbumForm ({AllEntriesData}) {
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
        console.log(selectedGear)
        formData.append('cover_art', coverArt);
        formData.append('description', description);

        const response = await fetch(`entries/add/album`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken },

        });

        if (response.ok) {
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
                 multiple value={band} name='band_id' onChange={handleBandChange}>
        {bands.map((band) => (
            <option key={band.id} value={band.id}>
                {band.name}
            </option>
        ))}
    </select>            </label>
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
            <label>
                <p>                
                Description:
                </p>
                <textarea value={description} onChange={handleDescriptionChange} 
                className='w-full border-solid border-2 rounded-lg py-2 px-4 text-black'></textarea>
            </label>
            <br />
            {errorMessage && <div>{errorMessage}</div>}
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <button type="submit">Add Album</button>
            
        </form>
    );
};