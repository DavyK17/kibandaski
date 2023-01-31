import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Account from "../../../components/Secondary/Account/Account";

import { Customer } from "../../../api/Server";
import { account } from "../../util/dataMock";
import capitalise from "../../../util/capitalise";

// Define server
const Server = Customer.users;

// Define tests
describe("Account component", () => {
    describe("General", () => {
        test("renders status", async() => {
            render(
                <Router>
                    <Account />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("account-details-loading"));

            let status = screen.getByTestId("status");
            expect(status).toBeInTheDocument();
        });
    });

    describe("Details", () => {
        const mockGetAccount = jest.spyOn(Server, "getAccount");

        test("renders skeleton during API call", async() => {
            render(
                <Router>
                    <Account />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("account-details-loading"));
        });

        test("renders error message if API call fails", async() => {
            mockGetAccount.mockRejectedValue(new Error("An unknown error occurred. Kindly try again."));
            render(
                <Router>
                    <Account />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("account-details-loading"));

            let error = await screen.findByText("An error occurred loading your account details. Kindly refresh the page and try again.");
            expect(error).toBeInTheDocument();
        });

        describe("if API call succeeds", () => {
            beforeEach(async() => {
                let data = account(false);
                mockGetAccount.mockResolvedValue(data);
                render(
                    <Router>
                        <Account />
                    </Router>
                );
                await waitForElementToBeRemoved(() => screen.queryByTestId("account-details-loading"));
            });

            test("renders names", async() => {
                let names = await screen.findByTestId("account-names");
                expect(names).toBeInTheDocument();
            });

            test("renders phone", async() => {
                let phone = await screen.findByTestId("account-phone");
                expect(phone).toBeInTheDocument();
            });

            test("renders email address", async() => {
                let email = await screen.findByTestId("account-email");
                expect(email).toBeInTheDocument();
            });

            test("renders edit button", async() => {
                let editDetails = await screen.findByText("Edit details");
                expect(editDetails).toBeInTheDocument();
            });

            test("renders delete button", async() => {
                let deleteAccount = await screen.findByText("Delete account");
                expect(deleteAccount).toBeInTheDocument();
            });

            test("renders third-party link/unlink buttons", () => {
                let providers = ["google", "facebook"];
                providers.forEach(async provider => {
                    let link = await screen.findByTitle(`Link ${capitalise(provider)} account`);
                    expect(link).toBeInTheDocument();
                });
            });
        });
    });
});