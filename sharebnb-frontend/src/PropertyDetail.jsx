import { useState, useEffect, useContext } from 'react';
import SharebnbApi from './api';
import LoadingSpinner from './LoadingSpinner';
import { Link, useParams } from 'react-router-dom';
import userContext from './userContext';
import BookingForm from './BookingForm';
import ImageCarousel from './ImageCarousel';

// import SearchForm from './SearchForm';

/** Property Detail Component for Sharebnb
 *
 * Props: NOne
 *
 * State:
 *  - id
 *  - property { id, title, description, address, price, owner, images[] }
 *
 * RoutesList -> PropertyDetail -> { BookingForm, ImageCarousel }
 */
const benSrc = `https://sharebnb-bucket-bb1016.s3.us-west-1.amazonaws.com`;


function PropertyDetail() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    // console.log("PropertyDetail %o", { id, property });

    const { currUser } = useContext(userContext);

    useEffect(function fetchPropertyWhenMounted() {
        // console.log("Inside of fetchPropertyWhenMounted use effect");
        async function fetchProperty() {
            const resp = await SharebnbApi.getProperty(id);
            setProperty(resp);
        }
        fetchProperty();
    }, [id]);

    if (!property) return <LoadingSpinner />;

    return (
        <div className='Property row justify-content-center'>
            <p className='fs-2 text-capitalize text-center mb-0 mt-3'>{property.title}</p>
            <div style={{ width: '800px', height: '500px', overflow: 'hidden' }}>
                <ImageCarousel images={property.images} />
            </div>
            <div className='text-center'>
                <div className='fs-6'>Price: ${property.price}/night</div>
                <div className=' fs-6'>Address: {property.address}</div>
                <div className='fs-6 fst-italic'>{property.description}</div>
            </div>
            <div className='row justify-content-center mt-4'>
                {(currUser && currUser.username !== property.owner) && <BookingForm propertyId={id} />}
                {!currUser && <h4 className='text-center'><Link to="/login">Login</Link> to book property</h4>}
            </div>
        </div>
    );

}

export default PropertyDetail;