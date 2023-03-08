import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AdminNav from "../../../components/Admin/AdminNav"

import testNavItem from "../util/testNavItem";
import { user } from "../util/dataMock";

// Define tests
describe("Admin section navigation", () => {
    describe("Unauthenticated", () => {
        beforeEach(() => {
            render(
                <Router>
                    <AdminNav />
                </Router>
            );
        });

        testNavItem("Orders", false);
        testNavItem("Products", false);
        testNavItem("Users", false);
    });

    describe("Authenticated", () => {
        describe("Customer", () => {
            let userMock = user("customer");

            beforeEach(() => {
                render(
                    <Router>
                        <AdminNav user={userMock} />
                    </Router>
                );
            });

            testNavItem("Orders", false);
            testNavItem("Products", false);
            testNavItem("Users", false);
        });

        describe("Admin", () => {
            let userMock = user("admin");

            beforeEach(() => {
                render(
                    <Router>
                        <AdminNav user={userMock} />
                    </Router>
                );
            });

            testNavItem("Orders", true);
            testNavItem("Products", true);
            testNavItem("Users", true);
        });
    });
});