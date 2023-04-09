import { useState, useLayoutEffect, useRef, useEffect } from 'react'
import './App.css'
import Cookies from 'js-cookie';
import _ from 'lodash';


const MIN_TEXTAREA_HEIGHT = 32;


function Profile({ userData, fetchUserData, current_user }) {
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


  const messageTextAreaRef = useRef(null);
  const [messageValue, setMessageValue] = useState("");
  const onMessageChange = (event) => setMessageValue(event.target.value);

  // Logic for the resizing textarea
  useLayoutEffect(() => {
    if (messageTextAreaRef.current) {
      // Reset height - important to shrink on delete
      messageTextAreaRef.current.style.height = "inherit";
      // Set height
      messageTextAreaRef.current.style.height = `${Math.max(
        messageTextAreaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [messageValue, messageTextAreaRef]);

  const [comments, setComments] = useState([]);



  function fetchComments() {
    fetch(`profile/comment/${userData.id}`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error(error));
  }

  // Debounce the fetchComments function
  const debouncedFetchComments = _.debounce(fetchComments, 10);

  // Call the debounced function in useEffect
  useEffect(() => {
    debouncedFetchComments();
  }, [userData.id]);

  function send_comment(event) {
    event.preventDefault();
    const profile_id = userData.id

    const formData = new FormData(event.target);
    const text = formData.get('postbody');

    const data = {
      text: text
    };

    fetch(`/send/profile/comment/${profile_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
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
        //console.log(data);
        setValue("")
        fetchComments();
        // Do something with the returned data, like update the UI or show a success message
      })
      .catch(error => {
        console.error(error);
        // Show an error message or handle the error in some way
      });
  }


  const [showMessages, setShowMessages] = useState(false);

  const handleClick = () => {
    setShowMessages(showMessages => !showMessages);
  };


  return (

    <div className='mx-auto h-screen flex flex-col items-center relative'>
      {current_user && <h1 className='text-Intone-600 items-center mb-12'>Welcome {userData.name}</h1>}


      <div className='flex flex-row justify-between'>
        {current_user && <div className='text-Intone-600 border border-indigo-200 rounded-xl px-2 py-4 mr-12'>
          <h1>Upload Profile Picture</h1>
          <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <div>
              <label htmlFor="profile_pic">Choose a file:</label>
              <input type="file" name="profile_pic" id="profile_pic" accept="image/*"></input>
            </div>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <button type="submit" className='rounded-3xl px-2 py-2 bg-Intone-300 hover:bg-Intone-500'>Upload</button>
          </form>
        </div>}

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
          <li className={`cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl${current_user ? ' mr-6' : ''}`}>
            Charts
          </li>
          {current_user && (
            <li className='cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'
              onClick={handleClick}>Inbox</li>
          )}
        </ul>
        {showMessages && (
          <div className='border border-indigo-200 z-50 bg-Intone-700 rounded-2xl px-2 mt-4 py-2 bottom-0 fixed right-0 w-96 h-[500px] m-4'>
            <h1 className='flex justify-center'>Messages</h1>
            <div className='absolute bottom-0'>
              <form id='newpost' onSubmit={send_comment} className='flex-row justify-between flex my-6 px-4 pt-6 w-full'>
                <textarea type="text"
                  onChange={onMessageChange}
                  ref={messageTextAreaRef}
                  style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    maxHeight: 400
                  }}
                  value={messageValue}
                  name="message"
                  id="message-textarea"
                  placeholder="Say Hello!"
                  rows='3'
                  className='bg-Intone-200 px-6 placeholder:text-gray-500 outline-none resize-none border rounded-xl w-64 py-2' />
                <hr className="border-gray-500" />
                <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
                <input type="submit" id="post-submit"
                  className="cursor-pointer	hover:bg-Intone-500 bg-Intone-300 text-white font-bold 
            px-4 rounded-3xl h-12 shadow resize-none ml-4 text-4xl" value=">" />
              </form>
            </div>
          </div>
        )}
      </div>
      <h1 className='mt-12 mb-6 text-3xl font-bold'>Comments</h1>
      <div className='flex flex-row max-md:flex-col justify-between border border-indigo-200 px-6 py-4 rounded-2xl'>

        <div className=''>
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
              placeholder={`Let ${userData.name} know`}
              rows='3'
              className='bg-Intone-200 px-6 placeholder:text-gray-500 outline-none resize-none' />
            <hr className="border-gray-500" />
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
            <input type="submit" id="post-submit" className="cursor-pointer	hover:bg-Intone-500 bg-Intone-300 text-white font-semibold py-2 mt-6 px-6 rounded-3xl shadow mb-10 w-24 ml-auto mr-6 resize-none" value="Send" />
          </form>
        </div>
        <div className='w-96 flex flex-col border border-indigo-200 rounded-3xl px-6 py-4 md:ml-6'>
          {comments.map(comment => (
            <div key={comment.id} className='w-full flex flex-col mx-auto border-b border-indigo-200 mb-6'>
              <p className='whitespace-pre-line mb-2'>{comment.text}</p>
              <div className='flex justify-between'>
                <div className='flex flex-row'>
                  <img src={`static/profile_pictures/${comment.user_picture_poster}`} className='object-cover w-8 h-8 rounded-full'></img>
                  <p>{comment.user_id}</p>
                </div>
                <p>{comment.created_at}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Profile