import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Secondary from "../../components/Secondary/Secondary";

import { Customer } from "../../api/Server";
import { account } from "../util/dataMock";

// Define server
const Server = Customer.users;

// Define tests
describe("Secondary section", () => {
    describe("General", () => {
        beforeEach(() => {
            render(
                <Router>
                    <Secondary />
                </Router>
            );
        });

        test("renders heading", () => {
            let heading = screen.getByRole("heading");
            expect(heading).toBeInTheDocument();
        });

        test("renders status", () => {
            let status = screen.getByTestId("status");
            expect(status).toBeInTheDocument();
        });
    });

    describe("Third-party registration confirmed", () => {
        beforeEach(() => {
            render(
                <Router>
                    <Secondary view="login" ctpr={false} />
                </Router>
            );
        });

        test("renders navigation", () => {
            let nav = screen.getByRole("navigation");
            expect(nav).toBeInTheDocument();
        });

        test("does not render third-party registration confirmation", () => {
            let ctpr = screen.queryByTestId("confirm-third-party-registration");
            expect(ctpr).not.toBeInTheDocument();
        });

        test("renders view component", () => {
            let component = screen.getByTestId("auth");
            expect(component).toBeInTheDocument();
        });
    });

    describe("Third-party registration not confirmed", () => {
        const mockGetAccount = jest.spyOn(Server, "getAccount");

        test("does not render navigation", async() => {
            render(
                <Router>
                    <Secondary view="login" ctpr={true} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("ctpr-loading"));

            let nav = screen.queryByRole("navigation");
            expect(nav).not.toBeInTheDocument();
        });

        test("does not render view component", async() => {
            render(
                <Router>
                    <Secondary view="login" ctpr={true} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("ctpr-loading"));

            let component = screen.queryByTestId("menu");
            expect(component).not.toBeInTheDocument();
        });

        test("renders loading skeleton during API call", async() => {
            render(
                <Router>
                    <Secondary view="login" ctpr={true} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("ctpr-loading"));
        });

        test("renders error message if API call fails", async() => {
            mockGetAccount.mockRejectedValue(new Error("An unknown error occurred. Kindly try again."));
            render(
                <Router>
                    <Secondary view="login" ctpr={true} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("ctpr-loading"));

            let error = await screen.findByText("An unknown error occurred. Kindly refresh the page and try again.");
            expect(error).toBeInTheDocument();
        });

        test("renders component if API call succeeds", async() => {
            let data = account(true);
            mockGetAccount.mockResolvedValue(data);
            render(
                <Router>
                    <Secondary view="login" ctpr={true} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("ctpr-loading"));

            let ctpr = await screen.findByTestId("confirm-third-party-registration");
            expect(ctpr).toBeInTheDocument();
        });
    });
});