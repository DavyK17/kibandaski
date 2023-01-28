import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import SecondaryNav from "../../components/Secondary/SecondaryNav";
import testNavItem from "../util/testNavItem";

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
        let userMock = {
            id: "7355234",
            email: "thisisan@email.com",
            role: "customer",
            cartId: "3599584",
            federatedCredentials: [{
                id: "1234567890",
                provider: "google",
                confirm: false
            }]
        };

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