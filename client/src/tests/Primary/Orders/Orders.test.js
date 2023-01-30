import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Orders from "../../../components/Primary/Orders/Orders";

import { Customer } from "../../../api/Server";
import { orders } from "../../util/dataMock";

// Define server
const Server = Customer.orders;

// Define tests
describe("Orders component", () => {
    const mockGetOrders = jest.spyOn(Server, "getOrders");

    test("renders loading skeleton during API call", () => {
        render(
            <Router>
                <Orders />
            </Router>
        );

        let skeleton = screen.getByTestId("orders-loading");
        expect(skeleton).toBeInTheDocument();
    });

    test("renders error message if API call fails", async() => {
        mockGetOrders.mockRejectedValue(new Error("No orders found."));
        render(
            <Router>
                <Orders />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.queryByTestId("orders-loading"));

        let error = screen.getByText("An error occurred loading your orders. Kindly refresh the page and try again.");
        expect(error).toBeInTheDocument();
    });

    test("renders orders if API call succeeds", async() => {
        mockGetOrders.mockResolvedValue(orders);
        render(
            <Router>
                <Orders />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.queryByTestId("orders-loading"));

        let items = await screen.findByRole("list");
        expect(items).toBeInTheDocument();

        let statusSelect = await screen.findByTestId("status-select");
        expect(statusSelect).toBeInTheDocument();
    });
});