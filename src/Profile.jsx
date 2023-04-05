import { useState } from 'react'
import './App.css'
import Cookies from 'js-cookie';



function Profile({ username }) {
    const csrftoken = Cookies.get('csrftoken');

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
    
        fetch('/upload/profile/pic', {
          method: 'POST',
          body: formData,
          headers: { 'X-CSRFToken': csrftoken },
        })
          .then((response) => {
            if (response.ok) {
              console.log('Profile picture uploaded successfully');
              form.reset(); // Reset the form
            } else {
              console.error('Profile picture upload failed');
            }
          })
          .catch((error) => {
            console.error('Profile picture upload failed:', error);
          });
      };
    


    return (
        <div className='mx-auto h-screen flex flex-col items-center'>
            <h1 className='text-Intone-600'>Welcome {username}</h1>
            <div className='text-Intone-600 border border-indigo-200 rounded-xl px-2 py-4'>
                <h1>Upload Profile Picture</h1>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div>
                        <label htmlFor="profile_pic">Choose a file:</label>
                        <input type="file" name="profile_pic" id="profile_pic" accept="image/*"></input>
                    </div>
                    <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

                    <button type="submit" className='rounded-3xl px-2 py-2 bg-Intone-300'>Upload</button>
                </form>
            </div>

        </div>

    );
}
export default Profile