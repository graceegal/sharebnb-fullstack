import { Card, CardBody, CardTitle, CardImg, CardText } from "reactstrap";
import { Link } from 'react-router-dom';

/**Property Card component for Sharebnb
 *
 * Props:
 *  - property {id, title, description, address, price, images}
 *
 * State: None
 *
 * PropertiesList -> PropertyCard
 */

const benSrc = `https://sharebnb-bucket-bb1016.s3.us-west-1.amazonaws.com`;


function PropertyCard({ property }) {
    return (
        <Link to={`properties/${property.id}`} className='text-decoration-none col-md-4'>
            <Card className="m-3 d-flex"
                style={{ width: "30em" }}>
                <CardBody>
                    <CardImg src={`${benSrc}/${property.images[1]}`}
                        style={{ height: "20em", objectFit: "cover" }}
                        top
                        width="100%" />
                    <div className='mt-1 text-center'>
                        <CardTitle className='text-capitalize' tag="h5">{property.title}</CardTitle>
                        <CardText className='fst-italic' >{property.address}</CardText>
                        <CardText className='fw-bold' >Price: ${property.price}/night</CardText>
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}

export default PropertyCard;