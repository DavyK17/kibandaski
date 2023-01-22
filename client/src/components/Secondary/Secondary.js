import Nav from "./SecondaryNav";

import Auth from "./Auth/Auth";
import ConfirmFederated from "./Auth/ConfirmFederated";

import Account from "./Account/Account";
import Cart from "./Cart/Cart";

import capitalise from "../../util/capitalise";

const Secondary = props => {
    // Destructure props
    const { view, user, setUser, activeClassName, iconHeight } = props;

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
            case "confirm-federated":
                if (type === "string") return "confirm federated details";
                if (type === "component") return <ConfirmFederated user={user} setUser={setUser} />;
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
            {view === "confirm-federated" ? null : <Nav user={user} activeClassName={activeClassName} />}
            {renderView(view, "component")}
            <p id="status"></p>
        </section>
    )
}

export default Secondary;