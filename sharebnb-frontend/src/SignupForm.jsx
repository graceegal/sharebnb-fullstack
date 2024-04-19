import { useState } from "react";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

/** Form for Signing up
 *
 * Props:
 * - signup(): function to call in parent
 *
 * State:
 *
 * - formData
 * - errors: array of error messages
 *
 * RoutesList -> SignupForm -> Alert
 */

function SignupForm({ signup }) {
    const initialState =
    {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState([]);

    console.log("signup form %o", { formData, errors });

    const navigate = useNavigate();

    /** handles form submission */
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            await signup(formData);
            navigate("/");
        }
        catch (err) {
            setErrors([...err]);
        }
    }

    /** handles input change */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(d => ({
            ...d,
            [name]: value,
        }));
    }

    return (
        <div className="SignupForm container text-center col-lg-4 mt-4">
            <h2 className="text-dark mb-2">Signup</h2>
            <div className="card">
                <div className="card-body">
                    <form
                        className="SignupForm" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="username"
                            >Username</label>
                            <input
                                id="username"
                                className="form-control"
                                name="username"
                                value={formData.username}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="password"
                            >Password</label>
                            <input
                                id="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                type="password"
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="firstName"
                            >First Name</label>
                            <input
                                id="firstName"
                                className="form-control"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="lastName"
                            >Last Name</label>
                            <input
                                id="lastName"
                                className="form-control"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="email"
                            >Email</label>
                            <input
                                id="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="phone"
                            >Phone</label>
                            <input
                                id="phone"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange} />
                        </div>
                        {errors.length > 0 &&
                            <Alert messages={errors} type="danger" />}
                        <div className="d-grid">
                            <button
                                type='submit'
                                className='btn btn-primary'>Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;