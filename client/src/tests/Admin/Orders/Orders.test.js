import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Orders from "../../../components/Admin/Orders/Orders";

import { Admin } from "../../../api/Server";
import { orders } from "../../util/dataMock";

// Define server
const Server = Admin.orders;

// Define tests
describe("Orders component", () => {
    const mockGetOrders = jest.spyOn(Server, "getOrders");

    test("renders loading skeleton during API call", async() => {
        render(
            <Router>
                <Orders />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.queryByTestId("admin-orders-loading"));
    });

    test("renders error message if API call fails", async() => {
        mockGetOrders.mockRejectedValue(new Error("No orders found."));
        render(
            <Router>
                <Orders />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.queryByTestId("admin-orders-loading"));

        let error = screen.getByText("An error occurred loading orders. Kindly refresh the page and try again.");
        expect(error).toBeInTheDocument();
    });

    test("renders orders if API call succeeds", async() => {
        mockGetOrders.mockResolvedValue(orders);
        render(
            <Router>
                <Orders />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.queryByTestId("admin-orders-loading"));

        let items = await screen.findByRole("list");
        expect(items).toBeInTheDocument();

        let statusSelect = await screen.findByTestId("status-select");
        expect(statusSelect).toBeInTheDocument();
    });
});