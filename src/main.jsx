import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Sidebar from './Sidebar';
import LogIn from './LogIn';
import Register from './Register';

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Send a request to `/check/login`
    fetch('/check/login')
      .then(response => response.json())
      .then(data => {
        setIsLoggedIn(data.is_authenticated);
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
      <div>
        <Sidebar isLoggedIn={isLoggedIn} />
        {/* <LogIn isLoggedIn={isLoggedIn} />
        <Register isLoggedIn={isLoggedIn} /> */}
      </div>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);

