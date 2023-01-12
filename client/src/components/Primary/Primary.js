import Admin from "./Admin/Admin";
import Menu from "./Menu/Menu";
import Nav from "./PrimaryNav";

import capitalise from "../../util/capitalise";

const Primary = props => {
    const { view, user, activeClassName, windowWidth, iconHeight } = props;

    const renderView = (view, type) => {
        switch (view) {
            case "admin":
                if (type === "string") return "admin";
                if (type === "component") return <Admin user={user} />;
                break;
            case "menu":
            default:
                if (type === "string") return "menu";
                if (type === "component") return <Menu windowWidth={windowWidth} iconHeight={iconHeight} />;
                return undefined;
        }
    }

    return (
            <section className="primary">
                <h2 className="sr-only">{capitalise(renderView(view, "string"))}</h2>
                <Nav user={user} activeClassName={activeClassName} />
                {renderView(view, "component")}
            </section>
    )
}

export default Primary;