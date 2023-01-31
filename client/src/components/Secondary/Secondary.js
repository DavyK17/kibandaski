import { useNavigate } from "react-router-dom";

import Nav from "./SecondaryNav";
import Account from "./Account/Account";
import Auth from "./Auth/Auth";
import Cart from "./Cart/Cart";
import ConfirmThirdPartyRegistration from "./Auth/ConfirmThirdPartyRegistration";

import { Auth as Server } from "../../api/Server";
import capitalise from "../../util/capitalise";
import displayErrorMessage from "../../util/displayErrorMessage";

const Secondary = props => {
    // Destructure props
    const { view, user, setUser, activeClassName, iconHeight, ctpr } = props;

    // Define useNavigate()
    let navigate = useNavigate();

    // Define authentication form submit function
    const handleAuthSubmit = async e => {
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

    // Define function to render correct view
    const renderView = (view, type) => {
        switch (view) {
            case "account":
                if (type === "string") return "account";
                if (type === "component") return <Account setUser={setUser} />;
                break;
            case "cart":
                if (type === "string") return "cart";
                if (type === "component") return <Cart user={user} iconHeight={iconHeight} />;
                break;
            case "register":
                if (type === "string") return "register";
                if (type === "component") return <Auth view={view} handleSubmit={handleAuthSubmit} />;
                break;
            case "login":
            default:
                if (type === "string") return "login";
                if (type === "component") return <Auth view={view} handleSubmit={handleAuthSubmit} />;
                break;
        }
    }

    // Return component
    return (
        <section className="secondary">
            <h2 className="sr-only">{capitalise(renderView(view, "string"))}</h2>
            {ctpr ? null : <Nav user={user} activeClassName={activeClassName} />}
            {ctpr ? <ConfirmThirdPartyRegistration setUser={setUser} /> : renderView(view, "component")}
            <p id="status" data-testid="status"></p>
        </section>
    )
}

export default Secondary;