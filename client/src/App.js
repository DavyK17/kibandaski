import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Primary from "./components/Primary/Primary";
import Secondary from "./components/Secondary/Secondary";
import NotFound from "./components/Other/NotFound";

import { Auth } from "./api/Server";

const App = () => {
    const [user, setUser] = useState(null);
    let activeClassName = "selected";
    const iconHeight = "30";

    useEffect(() => {
        const fetchUser = async() => {
            let user = await Auth.getUser();
            if (user) setUser(user);
        }

        fetchUser();
    }, []);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.onresize = () => setWindowWidth(window.innerWidth);
    });

    const renderRoute = (type, path, view, exact = false) => {
        if (type === 1) return (
            <Route path={path} exact={exact} element={
                <Primary view={view} user={user} activeClassName={activeClassName} windowWidth={windowWidth} iconHeight={iconHeight} />
            } />
        )
        
        if (type === 2) return (
            <Route path={path} element={
                <Secondary view={view} user={user} setUser={setUser} activeClassName={activeClassName} iconHeight={iconHeight} />
            } />
        )

        throw new Error("No route type provided.");
    }

    return (
        <>
            <Header user={user} setUser={setUser} windowWidth={windowWidth} iconHeight={iconHeight} />
            <main>
                <Routes>
                    {renderRoute(1, "/", "menu", true)}
                    {renderRoute(1, "/menu", "menu")}
                    {renderRoute(1, "/admin", user ? "admin" : "login")}
                    {renderRoute(1, "/orders", user ? "orders" : "login")}

                    {renderRoute(2, "/account", user ? "account" : "login")}
                    {renderRoute(2, "/cart", user ? "cart" : "login")}
                    {renderRoute(2, "/login", user ? "account" : "login")}
                    {renderRoute(2, "/register", user ? "account" : "register")}
                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}

export default App;