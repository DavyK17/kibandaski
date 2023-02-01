import { useEffect } from "react";
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

    // Redirect user to third-party details confirmation if not confirmed, or to account details if not admin
    useEffect(() => {
        if (ctpr) return navigate("/register");
        if (user && user.role !== "admin") navigate("/account");
    }, [navigate, user, ctpr]);

    // Define function to render correct view
    const renderView = (view, type) => {
        switch (view) {
            case "products":
                if (type === "string") return "products";
                if (type === "component") return user && user.role === "admin" ? <Products user={user} windowWidth={windowWidth} iconHeight={iconHeight} /> : null;
                break;
            case "users":
                if (type === "string") return "users";
                if (type === "component") return user && user.role === "admin" ? <Users windowWidth={windowWidth} iconHeight={iconHeight} /> : null;
                break;
            case "orders":
            default:
                if (type === "string") return "orders";
                if (type === "component") return user && user.role === "admin" ? <Orders windowWidth={windowWidth} iconHeight={iconHeight} /> : null;
                return undefined;
        }
    }

    // Return component
    return (
        <section className="admin">
            {
                ctpr ? null : (
                    <>
                        {user && user.role === "admin" ? <h2 className="sr-only">{capitalise(renderView(view, "string"))}</h2> : null}
                        <Nav user={user} activeClassName={activeClassName} />
                        {renderView(view, "component")}
                    </>
                )
            }
        </section>
    )
}

export default Admin;