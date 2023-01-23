import { useNavigate } from "react-router-dom";

import FacebookIcon from "../../../assets/icons/facebook.svg";
import GoogleIcon from "../../../assets/icons/google.svg";

import { Auth as Server } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Auth = props => {
    // Destructure props
    const { view, setUser } = props;

    // Define useNavigate()
    let navigate = useNavigate();

    // Define form elements
    const names = (
        <div className="names">
            <label className="sr-only" htmlFor="firstName">First name</label>
            <input id="firstName" type="text" placeholder="First name" required />

            <label className="sr-only" htmlFor="lastName">Last name</label>
            <input id="lastName" type="text" placeholder="Last name" required />
        </div>
    )

    const phone = (
        <>
            <label className="sr-only" htmlFor="phone">Phone</label>
            <input id="phone" type="tel" pattern="^254((20|4[0-6]|5\d|6([0-2]|[4-9]))\d{7}|1[0-1]\d{7}|7\d{8})$" placeholder='Phone (i.e. "254XXXXXXXXX")' required />
        </>
    )

    const email = (
        <>
            <label className="sr-only" htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="Email address" required />
        </>
    )

    const password = () => {
        if (view === "login") return (
            <>
                <label className="sr-only" htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Password" required />
            </>
        )

        if (view === "register") return (
            <div className="password">
                <label className="sr-only" htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Password" required />
    
                <label className="sr-only" htmlFor="confirm-password">Confirm password</label>
                <input type="password" id="confirm-password" placeholder="Confirm password" required />
            </div>
        )
    }

    // Define form submit function
    const handleSubmit = async e => {
        e.preventDefault();
        const status = document.getElementById("status");

        if (view === "login") {
            status.textContent = "Logging in…";

            let response = await Server.login(e.target[0].value, e.target[1].value);
            if (typeof response !== "object") return displayErrorMessage(response);

            setUser(response);
            status.textContent = null;
            e.target.reset();
            navigate("/cart");
        }

        if (view === "register") {
            status.textContent = "Creating account…";

            if (e.target[4].value && !e.target[5].value) return status.textContent = "Kindly confirm your password.";
            if (e.target[4].value !== e.target[5].value) return status.textContent = "Passwords do not match.";
            
            let response = await Server.register(e.target[0].value, e.target[1].value, e.target[2].value, e.target[3].value, e.target[4].value);
            if (!response.includes("User created")) return displayErrorMessage(response);

            status.textContent = "Account created. Kindly log in.";
            e.target.reset();
            setTimeout(() => status.textContent = null, 3000);
        }
    }

    // Return component
    return (
        <form className="auth" autoComplete="off" onSubmit={handleSubmit} data-testid="auth">
            {view === "register" ? names : null}
            {view === "register" ? phone : null}
            {email}
            {password()}
            <div className="buttons">
                <button type="submit">{view === "register" ? "Register" : "Log in"}</button>
                <a className="third-party-login" href="/api/auth/login/google" title="Authenticate with Google">
                    <img src={GoogleIcon} alt="Google icon" />
                </a>
                <a className="third-party-login" href="/api/auth/login/facebook" title="Authenticate with Facebook">
                    <img src={FacebookIcon} alt="Facebook icon" /> 
                </a>
            </div>
        </form>
    )
}

export default Auth;