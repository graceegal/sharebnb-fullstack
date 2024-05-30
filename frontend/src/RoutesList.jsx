import { Routes, Route, Navigate } from "react-router-dom";
import userContext from "./userContext";
import { useContext } from "react";
import PropertiesList from "./PropertiesList";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import PropertyForm from "./PropertyForm";
import PropertyDetail from "./PropertyDetail";
import UserBookings from "./UserBookings";

/**RouteList component that contains all Routes
 *
 * Props: none
 * State: none
 *
 * App -> RoutesList ->
 *       { LoginForm, SignupForm, AddPropertyForm, PropertiesList, PropertyDetail, UserBookings }
*/


function RoutesList({ login, signup }) {
    const { currUser } = useContext(userContext);

    /** generates JSX for accessible routes when logged in */
    function routesWhenLoggedIn() {
        return (
            <Routes>
                <Route path='/' element={<PropertiesList />} />
                <Route path='/add-property' element={<PropertyForm />} />
                <Route path='/properties/:id' element={<PropertyDetail />} />
                <Route path='/bookings' element={<UserBookings />} />
                <Route path='*' element={<Navigate to="/" />} />
            </Routes>
        );
    }

    /** generates JSX for accessible routes when NOT logged in */
    function routesWhenAnon() {
        return (
            <Routes>
                <Route path='/' element={<PropertiesList />} />
                <Route path='/properties/:id' element={<PropertyDetail />} />
                <Route path='/login' element={<LoginForm login={login} />} />
                <Route path='/signup' element={<SignupForm signup={signup} />} />
                <Route path='*' element={<Navigate to="/" />} />
            </Routes>
        );
    }

    return (
        <div className="RoutesList">
            {currUser ? routesWhenLoggedIn() : routesWhenAnon()}
        </div>
    );
}

export default RoutesList;