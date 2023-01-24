import { useNavigate } from "react-router-dom";

import FacebookIcon from "../../../assets/icons/facebook.svg";
import GoogleIcon from "../../../assets/icons/google.svg";

import { Auth as Server } from "../../../api/Server";
import capitalise from "../../../util/capitalise";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Auth = props => {
    // Destructure props
    const { view, setUser } = props;

    // Define useNavigate()
    let navigate = useNavigate();

    // Define third-party icons
    const icons = { google: GoogleIcon, facebook: FacebookIcon };

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

    // Define function to return third-party link/unlink buttons
    const renderThirdPartyButton = provider => {
        return (
            <a className="third-party-login" href={`/api/auth/login/${provider}`} title={`Authenticate with ${capitalise(provider)}`}>
                <img src={icons[provider]} alt={`${capitalise(provider)} icon`} />
            </a>
        )
    }

    // Define form submit function
    const handleSubmit = async e => {
        e.preventDefault();
        const status = document.getElementById("status");

        if (view === "login") {
            let email = e.target[0].value;
            let password = e.target[1].value;
            status.textContent = "Logging in…";

            let response = await Server.login(email, password);
            if (typeof response !== "object") return displayErrorMessage(response);

            setUser(response);
            status.textContent = null;
            e.target.reset();
            navigate("/cart");
        }

        if (view === "register") {
            status.textContent = "Creating account…";

            let password = e.target[4].value;
            let confirmPassword = e.target[5].value;
            if (password && !confirmPassword) return status.textContent = "Kindly confirm your password.";
            if (password !== confirmPassword) return status.textContent = "Passwords do not match.";
            
            let firstName = e.target[0].value;
            let lastName = e.target[1].value;
            let phone = e.target[2].value;
            let email = e.target[3].value;
            let response = await Server.register(firstName, lastName, phone, email, confirmPassword);
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
                {renderThirdPartyButton("google")}
                {renderThirdPartyButton("facebook")}
            </div>
        </form>
    )
}

export default Auth;