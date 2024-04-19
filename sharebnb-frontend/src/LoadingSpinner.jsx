import "./LoadingSpinner.css";

/** LoadingSpinner component for Jobly.
 *
 * Props: none
 * State: none
 *
 *  App -> LoadingSpinner
 */

function LoadingSpinner() {
    const spinnerStyles = {
        width: "6rem",
        height: "6rem",
    };

    return (
        <div className="LoadingSpinner">
            <div
                className="spinner-border text-dark"
                style={spinnerStyles}
                role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default LoadingSpinner;