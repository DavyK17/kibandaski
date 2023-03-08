import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import Admin from "../../../components/Admin/Admin"

import { user } from "../util/dataMock";

// Define function to return tests
const testElement = (name, renders) => {
    return test(`${renders ? "renders" : "does not render"} ${name === "admin orders" ? "view component" : name}`, () => {
        let element = name === "admin-orders" ? screen.queryByTestId(name) : screen.queryByRole(name);
        renders ? expect(element).toBeInTheDocument() : expect(element).not.toBeInTheDocument();
    });
}

// Define tests
describe("Admin section", () => {
    describe("Unauthenticated", () => {
        beforeEach(() => {
            render(
                <Router>
                    <Admin />
                </Router>
            );
        });

        testElement("heading", false);
        testElement("navigation", false);
        testElement("admin-orders", false);
    });

    describe("Authenticated", () => {
        describe("Customer", () => {
            let userMock = user("customer");

            beforeEach(() => {
                render(
                    <Router>
                        <Admin user={userMock} />
                    </Router>
                );
            });

            testElement("heading", false);
            testElement("navigation", false);
            testElement("admin-orders", false);
        });

        describe("Admin", () => {
            let userMock = user("admin");

            beforeEach(() => {
                render(
                    <Router>
                        <Admin user={userMock} />
                    </Router>
                );
            });

            testElement("heading", true);
            testElement("navigation", true);
            testElement("admin-orders", true);
        });
    });
});