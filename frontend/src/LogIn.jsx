import { useState, useEffect } from 'react'
import './App.css'
import Cookies from 'js-cookie';


function LogIn({ handleRegisterClick }) {

    const [csrftoken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('/api/get-csrf-token/');
                const data = await response.json();
                const csrfToken = data.csrfToken;
                setCsrfToken(csrfToken);
                // Set the obtained CSRF token
                Cookies.set('csrftoken', csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    console.log(csrftoken)


    const handleLogInSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData,
            });

            if (response.ok) {
                // Successful login, redirect to index page
                window.location.reload();
            } else {
                // Failed login, display error message
                setUsername("")
                setPassword("")
                const data = await response.json();
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="items-center flex justify-center flex-col w-1/3 mx-auto">
            <h2 className="text-3xl font-bold mb-4 mx-auto mt-12 text-Intone-600">Login</h2>


            <form onSubmit={handleLogInSubmit} className="max-w-md mx-auto mt-6 w-full px-6 py-12 border border-indigo-200 rounded-3xl shadow-2xl">
                <div className="mb-4">
                    <label htmlFor="username" className="block font-medium mb-1 text-Intone-600">Username:</label>
                    <input
                        id="username"
                        autoFocus
                        className="w-full border-solid border-2 rounded-lg py-2 px-4"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block font-medium mb-1 text-Intone-600">Password:</label>
                    <input
                        id="password"
                        className="w-full border-solid border-2 rounded-lg py-2 px-4"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

                <input
                    className="hover:bg-Intone-500 bg-white text-Intone-700 cursor-pointer font-bold py-2 px-4 rounded border"
                    type="submit"
                    value="Login"
                />
            </form>

            <p className="mt-4 mx-auto text-Intone-600 cursor-pointer">Don't have an account? <a
                className="text-blue-500 hover:text-blue-700" onClick={handleRegisterClick}>Register here.</a></p>

        </div>
    );
}
export default LogIn