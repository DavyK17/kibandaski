import Auth from "./Auth/Auth";
import Account from "./Account/Account";
import Cart from "./Cart/Cart";
import Nav from "./SecondaryNav";

import capitalise from "../../util/capitalise";

const Secondary = props => {
    const { view, user, setUser, activeClassName, iconHeight } = props;

    const renderView = (view, type) => {
        switch (view) {
            case "account":
                if (type === "string") return "account";
                if (type === "component") return <Account user={user} />;
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

    return (
        <section className="secondary">
            <h2 className="sr-only">{capitalise(renderView(view, "string"))}</h2>
            <Nav user={user} activeClassName={activeClassName} />
            {renderView(view, "component")}
            <p id="status"></p>
        </section>
    )
}

export default Secondary;