import { useNavigate } from "react-router-dom";

import Nav from "./PrimaryNav";
import Admin from "./Admin/Admin";
import Menu from "./Menu/Menu";
import Orders from "./Orders/Orders";

import capitalise from "../../util/capitalise";

const Primary = props => {
    // Destructure props
    const { view, user, activeClassName, windowWidth, iconHeight } = props;

    // Redirect to federated details confirmation if not confirmed
    let navigate = useNavigate();
    if (user && user.confirmDetails) return navigate("/register");

    // Define function to render correct view
    const renderView = (view, type) => {
        switch (view) {
            case "admin":
                if (type === "string") return "admin";
                if (type === "component") return <Admin user={user} />;
                break;
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
                <h2 className="sr-only">{capitalise(renderView(view, "string"))}</h2>
                <Nav user={user} activeClassName={activeClassName} />
                {renderView(view, "component")}
            </section>
    )
}

export default Primary;