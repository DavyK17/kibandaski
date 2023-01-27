import { useNavigate } from "react-router-dom";

import Nav from "./AdminNav";
import Orders from "./Orders/Orders";
import Products from "./Products/Products";
import Users from "./Users/Users";

import capitalise from "../../util/capitalise";

const Admin = props => {
    // Destructure props and define useNavigate()
    const { view, user, activeClassName, windowWidth, iconHeight, ctpr } = props;
    let navigate = useNavigate();

    // Redirect user to account details if not admin
    if (user && user.role !== "admin") return navigate("/account");

    // Redirect to third-party details confirmation if not confirmed
    if (ctpr) return navigate("/register");

    // Define function to render correct view
    const renderView = (view, type) => {
        switch (view) {
            case "products":
                if (type === "string") return "products";
                if (type === "component") return <Products user={user} windowWidth={windowWidth} iconHeight={iconHeight} />;
                break;
            case "users":
                if (type === "string") return "users";
                if (type === "component") return <Users windowWidth={windowWidth} iconHeight={iconHeight} />;
                break;
            case "orders":
            default:
                if (type === "string") return "orders";
                if (type === "component") return <Orders windowWidth={windowWidth} iconHeight={iconHeight} />;
                return undefined;
        }
    }

    // Return component
    return (
        <section className="admin">
            <h2 className="sr-only">{capitalise(renderView(view, "string"))}</h2>
            <Nav activeClassName={activeClassName} />
            {renderView(view, "component")}
        </section>
    )
}

export default Admin;