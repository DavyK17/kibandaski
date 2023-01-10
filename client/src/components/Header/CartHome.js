import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CartHome = props => {
    const { iconHeight, user } = props;
    let location = useLocation();
    let navigate = useNavigate();

    const primary = ["/", "/menu", "/admin"];
    const secondary = ["/login", "/register", "/account", "/cart"];
    const checkPathFor = type => {
        let current;
        if (type === "primary") current = primary;
        if (type === "secondary") current = secondary;

        current = current.filter(pathname => location.pathname === pathname);
        return current.length > 0 ? true : false;
    }

    const Cart = (
        <svg id="iconCart" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path id="pathCart" style={{ fill:"#ffffff" }} d="M4.558 7l4.701-4.702c.199-.198.46-.298.721-.298.613 0 1.02.505 1.02 1.029 0 .25-.092.504-.299.711l-3.26 3.26h-2.883zm12.001 0h2.883l-4.701-4.702c-.199-.198-.46-.298-.721-.298-.613 0-1.02.505-1.02 1.029 0 .25.092.504.299.711l3.26 3.26zm3.703 4l-.016.041-3.598 8.959h-9.296l-3.597-8.961-.016-.039h16.523zm3.738-2h-24v2h.643c.534 0 1.021.304 1.256.784l4.101 10.216h12l4.102-10.214c.233-.481.722-.786 1.256-.786h.642v-2z" />
        </svg>
    )

    const Home = (
        <svg id="iconHome" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path id="pathHome" style={{ fill:"#ffffff" }}  d="M12 9.185l7 6.514v6.301h-3v-5h-8v5h-3v-6.301l7-6.514zm0-2.732l-9 8.375v9.172h7v-5h4v5h7v-9.172l-9-8.375zm12 5.695l-12-11.148-12 11.133 1.361 1.465 10.639-9.868 10.639 9.883 1.361-1.465z" />
        </svg>
    )

    const handleClick = e => {
        e.preventDefault();
        if (e.target.id === "iconCart" && checkPathFor("primary") && user) navigate("/cart");
        if (e.target.id  === "iconHome" && checkPathFor("secondary")) navigate("/");
    }
    
    let [icon, setIcon] = useState(user ? (checkPathFor("primary") ? Cart : Home) : Home);
    useEffect(() => {
        if (user) setIcon(checkPathFor("primary") ? Cart : Home);
        // eslint-disable-next-line
    }, [location]);

    return (
        <span onClick={handleClick}>
            {icon}
        </span>
    )
}

export default CartHome;