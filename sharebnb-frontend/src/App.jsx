import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import LoadingSpinner from './LoadingSpinner';
import SharebnbApi from './api';
import userContext from './userContext';
import NavBar from './Nav';
import RoutesList from './RoutesList';

/** Component for ShareBnB App.
 *
 * Props: none
 * State:
 *  - isLoaded (boolean)
 *  - currUser { username, firstName, lastName, email, phone, isAdmin, bookings, properties }
 *              where bookings is [{ id, propertyId, guestUsername, startDate, endDate }... ]
 *              where properties is [{ id, title, address, description, price, owner }... ]
 *  - token (null || "")
 *
 * Index -> App -> { RoutesList, Nav }
*/

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currUser, setCurrUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));

  console.log("app %o", { token, currUser, isLoaded });

  useEffect(function fetchUserOnLoadAndTokenChange() {
    console.log("Inside fetchUserOnLoadAndTokenChange use Effect");
    async function fetchUser() {
      if (token) {
        SharebnbApi.token = token;
        localStorage.setItem('token', token);
        const decodedPayload = jwtDecode(token);
        const username = decodedPayload.username;
        const user = await SharebnbApi.getUser(username);
        setCurrUser(user);
      }
      else {
        localStorage.removeItem('token');
        setCurrUser(null);
      }
      setIsLoaded(true);
    }
    fetchUser();
  }, [token]);


  /** logs a user in */
  async function login(formData) {
    const token = await SharebnbApi.login(formData);
    setToken(token);
  }

  /** registers a user */
  async function signup(formData) {
    const token = await SharebnbApi.signup(formData);
    setToken(token);
  }

  /** logs a user out */
  async function logout() {
    setToken(null);
    alert("You have been logged out.");
  }

  if (!isLoaded) return <LoadingSpinner />;


  return (
    <div className="App">
      <BrowserRouter>
        <userContext.Provider value={{ currUser, setCurrUser }}>
          <NavBar logout={logout} />
          <RoutesList
            login={login}
            signup={signup} />
        </userContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
