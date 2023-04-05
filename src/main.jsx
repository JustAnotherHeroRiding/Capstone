import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Sidebar from './Sidebar';

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Send a request to `/check/login`
    fetch('/check/login')
      .then(response => response.json())
      .then(data => {
        setIsLoggedIn(data.is_authenticated);
        setUsername(data.username)
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    // Show a loading indicator while waiting for the response
    return <div>Loading...</div>;
  }

  return (
    <React.StrictMode>
      <div className='bg-Intone-200 h-screen w-screen'>
        <Sidebar isLoggedIn={isLoggedIn} username={username} />
      </div>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);

