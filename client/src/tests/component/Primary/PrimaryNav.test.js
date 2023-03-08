import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import PrimaryNav from "../../../components/Primary/PrimaryNav";

import testNavItem from "../util/testNavItem";
import { user } from "../util/dataMock";

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
            let userMock = user("customer");

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
            let userMock = user("admin");

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