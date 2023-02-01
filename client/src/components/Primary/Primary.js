import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Nav from "./PrimaryNav";
import Menu from "./Menu/Menu";
import Orders from "./Orders/Orders";

import capitalise from "../../util/capitalise";

const Primary = props => {
    // Destructure props and define useNavigate()
    const { view, user, activeClassName, windowWidth, iconHeight, ctpr } = props;
    let navigate = useNavigate();

    // Redirect to third-party details confirmation if not confirmed
    useEffect(() => {
        if (ctpr) navigate("/register");
    }, [navigate, ctpr]);

    // Define function to render correct view
    const renderView = (view, type) => {
        switch (view) {
            case "orders":
                if (type === "string") return "orders";
                if (type === "component") return <Orders windowWidth={windowWidth} iconHeight={iconHeight} />;
                break;
            case "menu":
            default:
                if (type === "string") return "menu";
                if (type === "component") return <Menu user={user} windowWidth={windowWidth} iconHeight={iconHeight} />;
                return undefined;
        }
    }

    // Return component
    return (
        <section className="primary">
            {
                ctpr ? null : (
                    <>
                        <h2 className="sr-only">{capitalise(renderView(view, "string"))}</h2>
                        <Nav user={user} activeClassName={activeClassName} />
                        {renderView(view, "component")}
                    </>
                )
            }
        </section>
    )
}

export default Primary;