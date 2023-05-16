import { useState, useLayoutEffect, useRef, useEffect } from 'react'
import './App.css'
import Cookies from 'js-cookie';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faCircleLeft, faFaceSmile, faPlus, faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


const MIN_TEXTAREA_HEIGHT = 32;


function Profile({ userData, fetchUserData, current_user, handleProfileClick, handleSearchResultClick, currentUserId, fetchSingleEntry }) {
  const csrftoken = Cookies.get('csrftoken');

  const [showReviews, setShowReviews] = useState(false)

  const handleReviewsClick = () => {
    setShowReviews(showReviews => !showReviews);
  };

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

  const [messages, setMessages] = useState([]);

  function fetchMessages() {
    fetch('profile/messages')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => {
        if (currentUserId) {
          console.error(error);
        }
      });
  }

  const [usersMessages, setUsersMessages] = useState([])

  function GetUsersWithMessage() {
    fetch('profile/messages/user')
      .then(response => response.json())
      .then(data => setUsersMessages(data))
      .catch(error => {
        if (currentUserId) {
          console.error(error);
        }
      });

  }

  const [conversation, setConversation] = useState(null)
  const [messageHistory, setMessageHistory] = useState([])
  const [conversationUserId, setConversationUserId] = useState(0)
  const [conversationName, setConversationName] = useState('')



  function fetchMessageHistory(user_id) {
    fetch(`profile/messages/conversation/${user_id}`)
      .then(response => response.json())
      .then(data => {
        setMessageHistory(data.messages)
        if (!conversation) {
          setConversation(true)
        }
        setConversationUserId(user_id)
        setConversationName(data.user.name)
      })
      .catch(error => {
        if (currentUserId) {
          console.error(error);
        }
      });
  }

  function exitConversation() {
    if (conversation) {
      setConversation(false)
    }
  }

  // Debounce the fetchComments function
  const debouncedFetchComments = _.debounce(fetchComments, 10);
  const debouncedFetchMessages = _.debounce(fetchMessages, 10);
  const debounchedConversations = _.debounce(GetUsersWithMessage, 10);



  // Call the debounced function in useEffect
  useEffect(() => {
    debouncedFetchComments();
    //debouncedFetchMessages();
    debounchedConversations();
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

  function send_message(event) {
    event.preventDefault();
    const profile_id = conversationUserId

    const formData = new FormData(event.target);
    const text = formData.get('message');
    const image = formData.get('image');

    formData.append('sender', profile_id);

    fetch(`send/profile/message/${profile_id}`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': csrftoken
      },
    })
      .then(response => {
        if (response.ok) {
          //fetchMessages();
          fetchMessageHistory(profile_id);
          return response.json();
        } else {
          throw new Error('Failed to send message.');
        }
      })
      .then(data => {
        setMessageValue("");
        // Do something with the returned data, like update the UI or show a success message
      })
      .catch(error => {
        console.error(error);
        // Show an error message or handle the error in some way
      });
  }



  const [showChat, setShowChat] = useState(false);

  const handleInboxClick = () => {
    setShowChat(showChat => !showChat);
  };

  const handleMessageClick = () => {
    setShowChat(showChat => !showChat);
    setConversation(false)
  };


  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedImageMessageId, setExpandedImageMessageId] = useState(null)

  const handleImageMessageClick = (message_id) => {
    if (message_id !== expandedImageMessageId) {
      setIsExpanded(true)
      setExpandedImageMessageId(message_id)

    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const handleUserMessageClick = (user_id) => {
    if (current_user && user_id === userData.id) {
      handleProfileClick()
    } else {
      handleSearchResultClick(user_id)
    }
  }

  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messageHistory changes
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messageHistory]);


  function handleEmojiSelect(emoji, origin) {
    if (origin === 'message') {
      setMessageValue(prevValue => prevValue + emoji.native);
    } else if (origin === 'profile_comment') {
      setValue(prevValue => prevValue + emoji.native)
    }
  }

  const [showMessageEmoji, setShowMessageEmoji] = useState(false)
  const [showProfileCommentEmoji, setShowProfileCommentEmoji] = useState(false)

  function handleEmojiShow(chat) {
    if (chat === 'message') {
      setShowMessageEmoji(!showMessageEmoji)
    } else if (chat === 'profile_comment') {
      setShowProfileCommentEmoji(!showProfileCommentEmoji)
    }
  }

  function checkIfFollowing(current_user_id, followers_users) {
    return followers_users.includes(current_user_id);
  }

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(checkIfFollowing(currentUserId, userData.followers_users));
  }, [currentUserId, userData.followers_users]);



  function handleFollowSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Send the follow request using AJAX
    fetch(`profile/follow/${userData.id}`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
      .then(response => {
        if (response.ok) {
          // Handle a successful follow request
          setIsFollowing(true)
          if (current_user) {
            fetchUserData()
          } else {
            fetchUserData(userData.id)
          }
          return response.json(); // Parse the response data as JSON
        } else {
          // Handle an error in the follow request
          console.error('Failed to follow user.');
        }
      })
      .then(data => {
        // Log the response data
        console.log(data.message);
      })
      .catch(error => {
        // Handle a network or other error
        console.error('An error occurred:', error);
      });
  }

  function handleUnfollowSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Send the follow request using AJAX
    fetch(`profile/unfollow/${userData.id}`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
      .then(response => {
        if (response.ok) {
          // Handle a successful follow request
          if (current_user) {
            fetchUserData()
          } else {
            fetchUserData(userData.id)
          }
          setIsFollowing(false)
          return response.json(); // Parse the response data as JSON
        } else {
          // Handle an error in the follow request
          console.error('Failed to unfollow user.');
        }
      })
      .then(data => {
        // Log the response data
        console.log(data.message);
      })
      .catch(error => {
        // Handle a network or other error
        console.error('An error occurred:', error);
      });
  }



  return (

    <div className='mx-auto h-screen flex flex-col items-center relative'>
      {current_user && <h1 className='text-Intone-600 items-center font-bold text-3xl'>Welcome {userData.name}</h1>}
      {!current_user && <h1 className='text-intone-600 items-center font-bold text-3xl'> {userData.name}</h1>}
      <div className='flex flex-row justify-between'>
        <h4 className='mr-4'>Followers<p className='flex justify-center'>{userData.followers_count}</p></h4>
        <h4 className='ml-4'>Following<p className='flex justify-center'>{userData.following_count}</p></h4>
      </div>

      <div className='flex flex-row justify-between mt-12'>
        {current_user && <div className='text-Intone-600 border border-indigo-200 rounded-xl px-6 py-4 mr-12'>
          <h1>Upload Profile Picture</h1>
          <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <div className='flex flex-col'>
              <label htmlFor="profile_pic">Choose a file:</label>
              {/*               <input type="file" name="profile_pic" id="profile_pic" accept="image/*"></input>*/}
              <label className='cursor-pointer hover:bg-Intone-900 rounded-lg  justify-center items-center flex'>
                <input type='file' name='profile_pic' id='profile_pic' accept='image/*' className='opacity-0 absolute -z-10 cursor-pointer' />
                <FontAwesomeIcon icon={faPaperclip} className='h-10 w-10 hover:bg-Intone-900 my-2' />
              </label>

            </div>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

            <button type="submit" className='rounded-3xl px-2 py-2 bg-Intone-300 hover:bg-Intone-500 text-white'>Upload</button>
          </form>
        </div>}

        <img src={`static/profile_pictures/${userData.profile_pic}`} className='object-cover w-40 h-40 rounded-full' />
      </div>
      <h1 className='text-Intone-600'> Member since {userData.date_joined}</h1>
      {currentUserId !== userData.id && (
        <>
          {!isFollowing ? (
            <form onSubmit={handleFollowSubmit}>
              <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
              <button
                type="submit"
                className="border-indigo-200 px-4 py-2 border rounded-3xl hover:bg-Intone-300 hover:text-black mr-4 mt-6"
              >
                Follow
              </button>
            </form>
          ) : (
            <form onSubmit={handleUnfollowSubmit}>
              <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
              <button
                type="submit"
                className="border-red-200 px-4 py-2 border rounded-3xl hover:bg-red-300 hover:text-black mr-4 mt-6"
              >
                Unfollow
              </button>
            </form>
          )}
        </>
      )}


      <div className='border border-indigo-200 rounded-2xl px-2 mt-12 py-2'>
        <ul className='flex flex-row justify-center'>
          <li className='mr-6 cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl' onClick={handleReviewsClick}
          >Reviews</li>
          <li className='mr-6 cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'>
            Following</li>
          <li className='mr-6 cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl'>
            Wishlist</li>
          <li className='cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl mr-6'>
            Charts
          </li>
          {currentUserId && (
            <>
              {current_user && (
                <li className='cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl' onClick={handleInboxClick}>
                  Inbox
                </li>
              )}
              {!current_user && (
                <li className='cursor-pointer hover:bg-Intone-500 px-4 py-2 rounded-3xl' onClick={handleMessageClick}>
                  Message
                </li>
              )}
            </>
          )}


        </ul>
        {showReviews && (
          <div className='flex flex-col border border-indigo-200 rounded-2xl px-4 py-2 mt-6'>
            <div className='px-2 py-4 md:ml-6'>
              <div className='w-96 max-h-[350px] scrollbar-blue-thin overflow-y-auto'>
                <div className='mr-4'>
                  {userData.reviews.map(review => (
                    <div key={review.id}>
                      {review.gear || review.album ? (
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
                            {review.gear && (
                              <div className='flex flex-row'>
                                <img src={`static/gear_images/${review.gear.picture}`}
                                  className='object-cover w-8 h-8 rounded-full mr-2'></img>
                                <p className='text-Intone-300 hover:text-Intone-900 cursor-pointer font-bold'
                                  onClick={() => fetchSingleEntry(review.gear.model_type, review.gear.id)}>{review.gear.name}</p>
                              </div>
                            )}
                            {review.album && (
                              <div className='flex flex-row'>
                                <img src={`static/album_covers/${review.album.cover_art_url}`}
                                  className='object-cover w-8 h-8 rounded-full mr-2'></img>
                                <p className='text-Intone-300 hover:text-Intone-900 cursor-pointer font-bold'
                                  onClick={() => fetchSingleEntry(review.album.model_type, review.album.id)}>{review.album.name}</p>
                              </div>
                            )}

                            <p>
                              {review.is_edited && (
                                <span className=' text-gray-500'>*</span>
                              )}
                              {review.created_at}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {showChat && (
          <div className='border border-indigo-200 z-50 bg-Intone-100 rounded-2xl px-2 mt-4 py-2 bottom-0 fixed right-0 w-96 h-[600px] m-4'>

            <h1 className='flex justify-center my-6 font-bold'>{conversation ? conversationName : "Messages"}</h1>
            <h1 className='font-3xl font-bold absolute top-2 right-5 cursor-pointer border border-indigo-200 rounded-full px-2 hover:bg-Intone-700' onClick={handleMessageClick}>X</h1>
            <div className=''>
              {!conversation &&
                <div className=''>
                  {usersMessages.map((user) => (
                    <div key={user.id} className='flex flex-row justify-end cursor-pointer' onClick={() => fetchMessageHistory(user.id)}>
                      <h1 >{user.name}</h1>
                      <img src={`static/profile_pictures/${user.profile_pic}`} className='object-cover w-8 h-8 rounded-full mr-2'></img>

                    </div>
                  ))}
                </div>}
              {conversation &&
                <div className='max-h-[380px] scrollbar-thumb-Intone-300 
            scrollbar-thin scrollbar-track-rounded-3xl scrollbar-thumb-rounded-3xl 
             scrollbar-track-white overflow-auto' ref={containerRef}>
                  <FontAwesomeIcon icon={faCircleLeft} onClick={exitConversation} className='absolute top-2 left-5 cursor-pointer h-8 w-8 hover:scale-110 transition-transform duration-200' />
                  {messageHistory.map((message) => (
                    <div className={`border border-indigo-200s max-w-[250px] 
                rounded-xl px-4 py-2 whitespace-pre-line flex flex-col mb-4 mr-4 ${message.sender.id == currentUserId ? 'ml-auto' : ''}`}
                      key={message.id}>
                      <div className='flex justify-between'>
                        <h1 className='font-bold cursor-pointer text-Intone-300 hover:text-Intone-900'
                          onClick={() => handleUserMessageClick(
                            message.sender
                          )}
                        >
                          {message.sender.name}
                        </h1>

                        <h1 className='text-xs text-Intone-800'>{message.sent_at}</h1>
                      </div>
                      <h1>{message.body}</h1>
                      {message.image && (
                        <img
                          className={`object-contain w-16 h-16 cursor-pointer
          ${isExpanded && expandedImageMessageId == message.id ? 'w-full h-full absolute right-full bottom-1/3' : ''}`}
                          src={`static/message_images${message.image}`}
                          onClick={() => handleImageMessageClick(message.id)}

                        />)}
                    </div>
                  ))}
                  <div className='absolute bottom-0'>
                    {showMessageEmoji && (
                      <Picker data={data} onEmojiSelect={(emoji) => handleEmojiSelect(emoji, 'message')} />
                    )}
                    <form id='newpost' onSubmit={send_message}
                      className='flex-row justify-between flex my-2 px-4 pt-6 w-full' encType='multipart/form-data'>
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
                        className='bg-Intone-200 px-6 placeholder:text-gray-500 mr-5 outline-none resize-none border rounded-xl w-64 py-2 scrollbar-blue-thin' />
                      <div className='flex flex-col'>
                        <label className='cursor-pointer hover:bg-Intone-900 rounded-lg flex justify-center items-center'>
                          <input type='file' name='image' accept='image/*' className='opacity-0 absolute -z-10 cursor-pointer' />
                          <FontAwesomeIcon icon={faPaperclip} className='h-10 w-10 hover:bg-Intone-900 my-2' />
                        </label>


                        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
                        <input type="submit" id="post-submit"
                          className="cursor-pointer	hover:bg-Intone-500 bg-Intone-300 text-white font-bold 
            px-4 rounded-3xl h-12 shadow resize-none text-4xl" value=">" />
                      </div>

                    </form>
                    <div>
                      {!showMessageEmoji && (
                        <FontAwesomeIcon icon={faFaceSmile} onClick={() => handleEmojiShow('message')}
                          className='cursor-pointer w-6 h-6 hover:scale-125 transition-transform duration-200 absolute top-0 right-8 z-10' />
                      )}
                      {showMessageEmoji && (
                        <FontAwesomeIcon icon={faFaceSmile} className='cursor-pointer w-6 h-6 hover:scale-125 transition-transform duration-200 absolute right-8 z-10
                         bottom-28' onClick={() => handleEmojiShow('message')} />

                      )}
                    </div>
                  </div>

                </div>

              }

            </div>
          </div>
        )}
      </div>
      <h1 className='mt-12 mb-6 text-3xl font-bold'>Comments</h1>
      <div className='flex flex-row max-md:flex-col justify-between border border-indigo-200 px-6 py-4 rounded-2xl'>
        <div className=''>
          {showProfileCommentEmoji && (
            <div className='absolute top-28'>
              <Picker data={data} onEmojiSelect={(emoji) => handleEmojiSelect(emoji, 'profile_comment')} />
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
              placeholder={`Let ${userData.name} know`}
              rows='3'
              className='bg-Intone-200 px-6 placeholder:text-gray-500 outline-none resize-none' />
            <hr className="border-gray-500" />
            <div>
              <FontAwesomeIcon icon={faFaceSmile} onClick={() => handleEmojiShow('profile_comment')}
                className='cursor-pointer w-6 h-6 hover:scale-125 transition-transform duration-200 z-10 mt-6' />
            </div>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
            <input type="submit" id="post-submit" className="cursor-pointer	hover:bg-Intone-500 bg-Intone-300 text-white font-semibold py-2 px-6 rounded-3xl shadow mb-10 w-24 ml-auto mr-6 resize-none" value="Send" />
          </form>
        </div>
        <div className='px-2 py-4 md:ml-6'>
          <div className='w-96 max-h-[350px] scrollbar-blue-thin overflow-y-auto'>
            <div className='mr-4'>
              {comments.map(comment => (
                <div key={comment.id} className='w-full flex flex-col border px-4 pt-2 rounded-lg border-indigo-900 mb-6 pb-4'>
                  <p className='whitespace-pre-line mb-2'>{comment.text}</p>
                  <div className='flex justify-between'>
                    <div className='flex flex-row'>
                      <img src={`static/profile_pictures/${comment.user_picture_poster}`} className='object-cover w-8 h-8 rounded-full mr-2'></img>
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
  );
}
export default Profile