import { Card, CardBody, CardTitle, CardImg, CardText } from "reactstrap";
import { Link } from 'react-router-dom';
import SharebnbApi from "./api";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

/** Booking Card
 *
 * Props:
 *  - booking { id, guestUsername, propertyId, startDate, endDate }
 *
 * State:
 *  - property { title, description, address, price, owner, images }
 *
 * UserBookings -> BookingCard
 */

function BookingCard({ booking }) {
    const [property, setProperty] = useState(null);

    const dateStartDate = new Date(booking.startDate);
    const formattedStartDate = dateStartDate.toLocaleDateString();
    const dateEndDate = new Date(booking.endDate);
    const formattedEndDate = dateEndDate.toLocaleDateString();

    console.log("property %o", { property });

    useEffect(function fetchPropertyWhenMounted() {
        console.log("Inside of fetchProperty use effect.");
        async function fetchProperty() {
            const resp = await SharebnbApi.getProperty(booking.propertyId);
            setProperty(resp);
        }
        fetchProperty();
    }, []);

    if (!property) return <LoadingSpinner />;

    return (
        <Card className="m-3 p-4 d-flex"
            style={{ width: "30em" }}>
            <CardBody>
                <div className='mt-1 text-center'>
                    <Link to={`/properties/${booking.propertyId}`} className='text-decoration-none col-md-4'>
                        <CardTitle className='text-capitalize' tag="h5">{property.title}</CardTitle>
                    </Link>
                    <CardText className='fw-bold' >Price: ${property.price}/night</CardText>
                    <CardText className='fw-bold' >{formattedStartDate} to {formattedEndDate}</CardText>
                </div>
            </CardBody>
        </Card>
    );
}

export default BookingCard;