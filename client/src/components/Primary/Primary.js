import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "./PrimaryNav";
import Account from "./Account/Account";
import Admin from "./Admin/Admin";
import Menu from "./Menu/Menu";

const Primary = props => {
    const { user, activeClassName } = props;

    return (
        <Router>
            <section className="primary">
                <h2 className="sr-only">
                    <Routes>
                        <Route path="/account" element={"Account"} />
                        <Route path="/admin" element={"Admin"} />
                        <Route path="/menu" element={"Menu"} />
                        <Route path="*" element={"Menu"} />
                    </Routes>
                </h2>
                <Nav user={user} activeClassName={activeClassName} />
                <Routes>
                    <Route path="/account" element={<Account />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="*" element={<Menu />} />
                </Routes>
            </section>
        </Router>
    )
}

export default Primary;