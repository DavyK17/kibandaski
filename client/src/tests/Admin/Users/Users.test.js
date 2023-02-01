import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Users from "../../../components/Admin/Users/Users";

import { Admin } from "../../../api/Server";
import { users } from "../../util/dataMock";

// Define server
const Server = Admin.users;

// Define tests
describe("Admin users component", () => {
    describe("General", () => {
        beforeEach(async() => {
            render(
                <Router>
                    <Users />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("admin-users-loading"));
        });

        test("renders role select", async() => {
            let roleSelect = screen.getByTestId("users-role-select");
            expect(roleSelect).toBeInTheDocument();
        });

        test("renders status", async() => {
            let status = screen.getByTestId("status");
            expect(status).toBeInTheDocument();
        });
    });

    describe("List", () => {
        const mockGetUsers = jest.spyOn(Server, "getUsers");

        test("renders skeleton during API call", async() => {
            render(
                <Router>
                    <Users />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("admin-users-loading"));
        });

        test("renders error message if API call fails", async() => {
            mockGetUsers.mockRejectedValue(new Error("An unknown error occurred. Kindly try again."));
            render(
                <Router>
                    <Users />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("admin-users-loading"));

            let error = await screen.findByText("An error occurred loading users. Kindly refresh the page and try again.");
            expect(error).toBeInTheDocument();
        });

        test("renders list of users if API call succeeds", async() => {
            mockGetUsers.mockResolvedValue(users);
            render(
                <Router>
                    <Users />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("admin-users-loading"));

            let list = await screen.findByRole("list");
            expect(list).toBeInTheDocument();
        });
    });
});