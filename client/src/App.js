import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import Header from "./components/Header/Header";
import Primary from "./components/Primary/Primary";
import Secondary from "./components/Secondary/Secondary";

import { Auth } from "./api/Server";

const App = () => {
    const [user, setUser] = useState(null);
    let activeClassName = "selected";

    // useEffect(() => {
    //     const fetchUser = async() => {
    //         let user = await Auth.getUser();
    //         if (user) setUser(user);
    //     }

    //     fetchUser();
    //     console.log(Cookies.get());
    // });

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.onresize = () => setWindowWidth(window.innerWidth);
    });

    const [view, setView] = useState("primary");
    // const [main, setMain] = useState(
    //     <>
    //         <Primary user={user} activeClassName={activeClassName} />
    //         <Secondary user={user} setUser={setUser} activeClassName={activeClassName} />
    //     </>
    // )

    // useEffect(() => {
    //     if (windowWidth <= 991) {
    //         if (view === "primary") setMain(<Primary user={user} activeClassName={activeClassName} />);
    //         if (view === "secondary") setMain(<Secondary user={user} setUser={setUser} activeClassName={activeClassName} />);
    //     }
    // }, [view]);

    return (
        <>
            <Header user={user} setUser={setUser} view={view} setView={setView} windowWidth={windowWidth} />
            <main>
                <Primary user={user} activeClassName={activeClassName} />
                <Secondary user={user} setUser={setUser} activeClassName={activeClassName} />
            </main>
        </>
    );
}

export default App;