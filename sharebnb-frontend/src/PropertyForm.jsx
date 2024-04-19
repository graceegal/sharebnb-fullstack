import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import SharebnbApi from "./api";

/** Form for adding a new property
 *
 * Props: None
 *
 * State:
 * - formData
 * - errors: array of error messages
 *
 * RoutesList -> PropertyForm -> Alert
 */

function PropertyForm() {
    const initialState =
    {
        title: "",
        description: "",
        address: "",
        price: ""
    };

    const [formData, setFormData] = useState(initialState);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState([]);

    console.log("PropertyForm %o", { formData, images, errors });

    const navigate = useNavigate();

    /** handles form submission */
    async function handleSubmit(evt) {
        evt.preventDefault();
        let multiFormData = new FormData();

        for (let image of images) {
            multiFormData.append("images", image);
        }

        // updates multiFormdata with all keys and values from formData state
        for (let field in formData) {
            multiFormData.append(field, formData[field]);
        }

        try {
            await SharebnbApi.createProperty(multiFormData);
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

    /** handles input change for images */
    function handleImageChange(evt) {
        setImages(evt.target.files);
    }

    return (
        <div className="PropertyForm text-center container col-lg-4 mt-4">
            <h2 className="text-dark mb-2">Add Property</h2>
            <div className="card">
                <div className="card-body">
                    <form
                        className="PropertyForm"
                        encType="multipart/form-data"
                        onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="title"
                            >Title</label>
                            <input
                                id="title"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="description"
                            >Description</label>
                            <input
                                id="description"
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="address"
                            >Address</label>
                            <input
                                id="address"
                                className="form-control"
                                name="address"
                                value={formData.address}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="price"
                            >Price</label>
                            <input
                                id="price"
                                className="form-control"
                                name="price"
                                value={formData.price}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label fw-bold"
                                htmlFor="images"
                            >Images</label>
                            <input
                                id="images"
                                className="form-control"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange} />
                        </div>
                        {errors.length > 0 &&
                            <Alert messages={errors} type="danger" />}
                        <div className="d-grid">
                            <button
                                type='submit'
                                className='btn btn-primary'>Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PropertyForm;