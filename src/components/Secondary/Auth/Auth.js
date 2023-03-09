import FacebookIcon from "../../../assets/icons/facebook.svg";
import GoogleIcon from "../../../assets/icons/google.svg";

import capitalise from "../../../util/capitalise";

const Auth = props => {
    // Destructure props
    const { view, handleSubmit } = props;

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