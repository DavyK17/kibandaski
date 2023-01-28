import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import PrimaryNav from "../../components/Primary/PrimaryNav";
import testNavItem from "../util/testNavItem";

// Define tests
describe("Primary section navigation", () => {
    describe("Unauthenticated", () => {
        beforeEach(() => {
            render(
                <Router>
                    <PrimaryNav />
                </Router>
            );
        });

        testNavItem("Menu", true);
        testNavItem("Orders", false);
        testNavItem("Admin", false);
    });

    describe("Authenticated", () => {
        describe("Customer", () => {
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
                        <PrimaryNav user={userMock} />
                    </Router>
                );
            });

            testNavItem("Menu", true);
            testNavItem("Orders", true);
            testNavItem("Admin", false);
        });

        describe("Admin", () => {
            let userMock = {
                id: "7355234",
                email: "thisisan@email.com",
                role: "admin",
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
                        <PrimaryNav user={userMock} />
                    </Router>
                );
            });

            testNavItem("Menu", true);
            testNavItem("Orders", true);
            testNavItem("Admin", true);
        });
    });
});