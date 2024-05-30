import { useState, useEffect, useContext } from 'react';
import userContext from './userContext';
import BookingCard from './BookingCard';

/** User bookings page
 *
 * Props: None
 *
 * State: None
 *
 * RoutesList -> UserBookings -> BookingCard
 */

function UserBookings() {
    const { currUser } = useContext(userContext);
    const bookings = currUser.bookings;

    // console.log("userBookings", bookings);

    return (
        <div className='row justify-content-center'>
            <h1 className='text-center m-3'>{bookings.length === 0 ? "No bookings" : "Bookings"}</h1>
            {bookings.map((booking) => <BookingCard booking={booking} />)}
        </div>
    );
}

export default UserBookings;