import { useNavigate } from "react-router-dom";

import { Auth as Server } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Auth = props => {
    const { view, setUser } = props;
    let navigate = useNavigate();

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

    const password = (
        <>
            <label className="sr-only" htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Password" required />
        </>
    )

    const handleSubmit = async e => {
        e.preventDefault();
        const status = document.getElementById("status");

        if (view === "login") {
            status.textContent = "Logging in…";

            let response = await Server.login(e.target[0].value, e.target[1].value);
            if (typeof response !== "object") return displayErrorMessage(response);

            setUser(response);
            status.textContent = null;
            navigate("/cart");
        }

        if (view === "register") {
            status.textContent = "Creating account…";
            
            let response = await Server.register(e.target[0].value, e.target[1].value, e.target[2].value, e.target[3].value, e.target[4].value);
            if (!response.includes("User created")) return displayErrorMessage(response);

            status.textContent = "Account created. Kindly log in.";
        }
    }

    return (
        <form className="auth" autoComplete="off" onSubmit={handleSubmit}>
            {view === "register" ? names : null}
            {view === "register" ? phone : null}
            {email}
            {password}
            <button type="submit">{view === "register" ? "Register" : "Log in"}</button>
        </form>
    );
}

export default Auth;