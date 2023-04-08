import { useState, useLayoutEffect, useRef } from 'react'
import './App.css'
import Cookies from 'js-cookie';

const MIN_TEXTAREA_HEIGHT = 32;


function Profile({ userData, fetchUserData }) {
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
          fetchUserData()
        } else {
          console.error('Profile picture upload failed');
        }
      })
      .catch((error) => {
        console.error('Profile picture upload failed:', error);
      });
  };

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
    const form = event.target;
    const body = form.postbody.value;
    
    // new post view to save the new post
    const data = { body };
    console.log("Comment is sent")
  }


  return (
    <div className='mx-auto h-screen flex flex-col items-center'>
      <h1 className='text-Intone-600 items-center mb-12'>Welcome {userData.username}</h1>

      <div className='flex flex-row justify-between'>
        <div className='text-Intone-600 border border-indigo-200 rounded-xl px-2 py-4 mr-12'>
          <h1>Upload Profile Picture</h1>
          <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <div>
              <label htmlFor="profile_pic">Choose a file:</label>
              <input type="file" name="profile_pic" id="profile_pic" accept="image/*"></input>
            </div>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <button type="submit" className='rounded-3xl px-2 py-2 bg-Intone-300 hover:bg-Intone-500'>Upload</button>
          </form>
        </div>
        <img src={`static/profile_pictures/${userData.profile_pic}`} className='object-cover w-40 h-40 rounded-full' />
      </div>
      <h1 className='text-Intone-600'> Member since {userData.date_joined}</h1>
      <div className='border border-indigo-200 rounded-2xl px-2 mt-12 py-2'>
        <ul className='flex flex-row justify-center'>
          <li className='mr-6 cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'
          >Reviews</li> 
          <li className='mr-6 cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'>
            Following</li> 
          <li className='mr-6 cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'>
            Wishlist</li>
          <li className='mr-6 cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'>
            Charts</li>
          <li className='cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'>
            Inbox</li>
        </ul>
      </div>
      <div className='mt-12'>
        <h1>Comments</h1>
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
                  placeholder={`Let ${userData.username} know`}
                  rows='3'
                  className='bg-Intone-200 px-6 placeholder:text-gray-500 outline-none resize-none' />
                <hr className="border-gray-500" />
                <input type="submit" id="post-submit" className="cursor-pointer	hover:bg-Intone-500 bg-Intone-300 text-white font-semibold py-2 mt-6 px-6 rounded-3xl shadow mb-10 w-24 ml-auto mr-6 resize-none" value="Send" />
              </form>
      </div>
    </div>

  );
}
export default Profile