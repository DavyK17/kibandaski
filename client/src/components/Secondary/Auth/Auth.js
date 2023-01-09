import { Auth as Server } from "../../../api/Server";

const Auth = props => {
    const { setUser, secondaryView } = props;

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
            <input id="phone" type="tel" placeholder='Phone (i.e. "254XXXXXXXXX")' required />
        </>
    )

    const email = (
        <>
            <label className="sr-only" htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="Email address" required />
        </>
    )

    const password = (
        <>
            <label className="sr-only" htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Password" required />
        </>
    )

    const handleSubmit = async e => {
        e.preventDefault();
        console.log("Attempting login...");

        if (secondaryView === "login") {
            let response = await Server.login(e.target[0].value, e.target[1].value);
            return console.log(response);
            if (response === "Login successful") response = await Server.getUser();
            // setUser(response);
        };
    }

    return (
        <form className="auth" onSubmit={handleSubmit}>
            {secondaryView === "register" ? names : null}
            {secondaryView === "register" ? phone : null}
            {email}
            {password}
            <button type="submit">{secondaryView === "login" ? "Log in" : "Register"}</button>
        </form>
    );
}

export default Auth;