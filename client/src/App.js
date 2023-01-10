import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";

import Header from "./components/Header/Header";
import Primary from "./components/Primary/Primary";
import Secondary from "./components/Secondary/Secondary";
import NotFound from "./components/Other/NotFound";

// import { Auth } from "./api/Server";

const App = () => {
    const [user, setUser] = useState(null);
    let activeClassName = "selected";

    useEffect(() => {
        // const fetchUser = async() => {
        //     let user = await Auth.getUser();
        //     if (user) setUser(user);
        // }

        // fetchUser();
        console.log(Cookies.get());
    });

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.onresize = () => setWindowWidth(window.innerWidth);
    });

    return (
        <>
            <Header user={user} setUser={setUser} windowWidth={windowWidth} />
            <main>
                <Routes>
                    <Route path="/" exact element={<Primary view="menu" user={user} activeClassName={activeClassName} />} />
                    <Route path="/menu" element={<Primary view="menu" user={user} activeClassName={activeClassName} />} />
                    <Route path="/admin" element={<Primary view={user ? "admin" : "login"} user={user} activeClassName={activeClassName} />} />

                    <Route path="/account" element={<Secondary view={user ? "account" : "login"} user={user} setUser={setUser} activeClassName={activeClassName} />} />
                    <Route path="/cart" element={<Secondary view={user ? "cart" : "login"} user={user} setUser={setUser} activeClassName={activeClassName} />} />
                    <Route path="/login" element={<Secondary view={user ? "account" : "login"} user={user} setUser={setUser} activeClassName={activeClassName} />} />
                    <Route path="/register" element={<Secondary view={user ? "account" : "register"} user={user} setUser={setUser} activeClassName={activeClassName} />} />
                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}

export default App;