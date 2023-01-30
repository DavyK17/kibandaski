import Nav from "./SecondaryNav";

import Auth from "./Auth/Auth";
import ConfirmThirdPartyRegistration from "./Auth/ConfirmThirdPartyRegistration";

import Account from "./Account/Account";
import Cart from "./Cart/Cart";

import capitalise from "../../util/capitalise";

const Secondary = props => {
    // Destructure props
    const { view, user, setUser, activeClassName, iconHeight, ctpr } = props;

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
                if (type === "component") return <Auth view={view} setUser={setUser} />;
                break;
            case "login":
            default:
                if (type === "string") return "login";
                if (type === "component") return <Auth view={view} setUser={setUser} />;
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