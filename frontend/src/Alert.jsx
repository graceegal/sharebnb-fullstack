import './Alert.css';

/** Alert component for Sharebnb
 *
 * Props:
 * - messages: array of messages to display to user [message, ...]
 * - type: represents color of alert (ex. "success", "danger", "warning")
 *
 * State: none
 *
 * { LoginForm, SignupForm} -> Alert
 */

function Alert({ messages, type }) {
    return (
        <div className="Alert">
            <div className={`alert alert-${type}`} role="alert">
                {messages.map((m, idx) =>
                    <p key={idx} className="mb-0 small">{m}</p>)}
            </div>
        </div>
    );
}

export default Alert;