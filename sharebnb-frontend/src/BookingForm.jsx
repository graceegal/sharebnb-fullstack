import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import Calendar from "react-calendar";
import SharebnbApi from "./api";
import { Form, FormGroup } from "reactstrap";
import userContext from "./userContext";
import './calendar.css';

/** Form for making a new booking
 *
 * Props:
 * - propertyId
 *
 * State:
 * - formData
 * - errors: array of error messages
 *
 * PropertyDetail -> BookingForm -> Alert
 */

function BookingForm({ propertyId }) {

    const { currUser } = useContext(userContext);
    const guestUsername = currUser.username;

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [alerts, setAlerts] = useState({
        messages: [],
        type: "danger"
    });

    // console.log("BookingForm %o", { startDate, endDate, alerts });

    const navigate = useNavigate();

    /** handles form submission */
    async function handleSubmit(evt) {
        evt.preventDefault();
        setAlerts({ messages: [], type: "danger" });
        if ((startDate > endDate) || (startDate < Date.now())) {
            setAlerts({ messages: ["Invalid check in or check out date."], type: "danger" });
        } else {
            try {
                await SharebnbApi.createBooking({ propertyId, guestUsername, startDate, endDate });
                navigate(`/properties/${propertyId}`);
                const formattedStartDate = startDate.toLocaleDateString();
                const formattedEndDate = endDate.toLocaleDateString();
                setAlerts({
                    messages: [`Booked from ${formattedStartDate} to ${formattedEndDate}!`],
                    type: "success"
                });
            }
            catch (err) {
                setAlerts({ messages: [...err], type: "danger" });
            }
        }
    }

    return (
        <>
            <h2 className="text-dark text-center mb-2 mt-4">Book This Property</h2>
            <div className="BookingForm text-center d-flex justify-content-center">

                <form
                    className="BookingForm" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Check-In</label>
                            <Calendar className="startDate"
                                value={startDate}
                                onChange={setStartDate}
                                required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Check-Out</label>
                            <Calendar className="endDate"
                                value={endDate}
                                onChange={setEndDate}
                                required />
                        </div>
                    </div>
                    <div className="">

                        {alerts.messages.length > 0 &&
                            <Alert messages={alerts.messages} type={alerts.type} />}
                    </div>
                    <button
                        type='submit'
                        className='btn btn-primary mt-2'>Book</button>
                </form>

            </div>
        </>
    );
}

export default BookingForm;