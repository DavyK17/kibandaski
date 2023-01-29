import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import SecondaryNav from "../../components/Secondary/SecondaryNav";

import testNavItem from "../util/testNavItem";
import { user } from "../util/dataMock";

// Define tests
describe("Secondary section navigation", () => {
    describe("Unauthenticated", () => {
        beforeEach(() => {
            render(
                <Router>
                    <SecondaryNav />
                </Router>
            );
        });

        testNavItem("Login", true);
        testNavItem("Register", true);
        testNavItem("Cart", false);
        testNavItem("Account", false);
    });

    describe("Authenticated", () => {
        let userMock = user("customer");

        beforeEach(() => {
            render(
                <Router>
                    <SecondaryNav user={userMock} />
                </Router>
            );
        });

        testNavItem("Login", false);
        testNavItem("Register", false);
        testNavItem("Cart", true);
        testNavItem("Account", true);
    });
});