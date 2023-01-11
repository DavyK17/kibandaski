import { useNavigate } from "react-router-dom";
import { Auth as Server } from "../../../api/Server";

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
        console.log("Attempting login...");

        if (view === "login") {
            let response = await Server.login(e.target[0].value, e.target[1].value);
            if (response === "Login successful") {
                response = await Server.getUser();
                setUser(response);
                navigate("/cart");
            };
        };
    }

    return (
        <form className="auth" onSubmit={handleSubmit}>
            {view === "register" ? names : null}
            {view === "register" ? phone : null}
            {email}
            {password}
            <button type="submit">{view === "register" ? "Register" : "Log in"}</button>
        </form>
    );
}

export default Auth;