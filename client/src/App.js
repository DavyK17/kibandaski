import { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Primary from "./components/Primary/Primary";
import Secondary from "./components/Secondary/Secondary";
import Admin from "./components/Admin/Admin";
import NotFound from "./components/Other/NotFound";

import { Auth } from "./api/Server";

const App = () => {
    // Define class name for active menu item and icon height
    let activeClassName = "selected";
    const iconHeight = "30";

    // STATE + FUNCTIONS
    // User
    const [user, setUser] = useState(null);
    const fetchUser = async() => {
        let user = await Auth.getUser();
        if (user) setUser(user);
    }

    useMemo(() => {
        fetchUser();
    }, []);

    // Complete third-party registration
    const ctpr = user && user.federatedCredentials.length > 0 && user.federatedCredentials[0].confirm;

    // Window width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.onresize = () => setWindowWidth(window.innerWidth);
    });

    // Define function to render route
    const renderRoute = (type, path, view, exact = false) => {
        if (type === 1) return (
            <Route path={path} exact={exact} element={
                <Primary view={view} user={user} activeClassName={activeClassName} windowWidth={windowWidth} iconHeight={iconHeight} ctpr={ctpr} />
            } />
        )

        if (type === 2) return (
            <Route path={path} element={
                <Secondary view={view} user={user} setUser={setUser} activeClassName={activeClassName} iconHeight={iconHeight} ctpr={ctpr} />
            } />
        )

        if (type === 3) return (
            <Route path={path} element={
                <Admin view={view} user={user} activeClassName={activeClassName} windowWidth={windowWidth} iconHeight={iconHeight} ctpr={ctpr} />
            } />
        )

        throw new Error("No route type provided.");
    }

    // Return app
    return (
        <>
            <Header user={user} setUser={setUser} windowWidth={windowWidth} iconHeight={iconHeight} />
            <main>
                <Routes>
                    {renderRoute(1, "/", "menu", true)}
                    {renderRoute(1, "/menu", "menu")}
                    {renderRoute(1, "/orders", user ? "orders" : "login")}

                    {renderRoute(2, "/account", user ? "account" : "login")}
                    {renderRoute(2, "/cart", user ? "cart" : "login")}
                    {renderRoute(2, "/login", user ? "account" : "login")}
                    {renderRoute(2, "/register", user ? "account" : "register")}

                    <Route path="/admin">
                        {renderRoute(3, "orders", user ? "orders" : "login")}
                        {renderRoute(3, "products", user ? "products" : "login")}
                        {renderRoute(3, "users", user ? "users" : "login")}
                        {renderRoute(3, "", user ? "orders" : "login")}
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    )
}

export default App;