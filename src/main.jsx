import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Sidebar from './Sidebar';


function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] =useState('')

  function fetchUserData() {
    fetch('/check/login')
      .then(response => response.json())
      .then(data => {
        setIsLoggedIn(data.is_authenticated);
        setUserData(data.user_data);
        setCurrentUserId(data.user_data.id)
        setIsLoading(false);
      })
      .catch(error => {
     //console.error(error);
       setIsLoading(false);
      });
  }
  
  useEffect(() => {
    fetchUserData();
  }, []);

  function handleUploadSuccess() {
    fetchUserData();
  }

  if (isLoading) {
    // Show a loading indicator while waiting for the response
    return <div>Loading...</div>;
  }

  return (
    <React.StrictMode>
      <div className='text-Intone-600'>
        <Sidebar isLoggedIn={isLoggedIn} userData={userData} fetchUserData={handleUploadSuccess} currentUserId={currentUserId} />
      </div>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);

