import { render, screen, act, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Order from "../../../../components/Primary/Orders/Order";

import { Customer } from "../../../../api/Server";
import { orders, order } from "../../util/dataMock";

// Define server
const Server = Customer.orders;

// Define tests
describe("Order", () => {
    describe("View items button", () => {
        const mockGetOrders = jest.spyOn(Server, "getOrders");

        // Define setup function
        const setup = () => {
            render(<Order details={orders[2]} />);
            act(() => userEvent.click(screen.getByRole("button", { name: /view items/i})));
        }

        // Define tests
        test("triggers API call when clicked", async() => {
            setup();
            await waitForElementToBeRemoved(() => screen.queryByTestId("order-items-loading"));
            expect(mockGetOrders).toBeCalled();
        });

        test("renders loading skeleton during API call", async() => {
            setup();
            await waitForElementToBeRemoved(() => screen.queryByTestId("order-items-loading"));
        });

        test("renders error message if API call fails", async() => {
            mockGetOrders.mockRejectedValue(new Error("An unknown error occurred. Kindly try again."));
            setup();

            let error = await screen.findByText("An error occurred loading order items. Kindly refresh the page and try again.");
            expect(error).toBeInTheDocument();
        });

        test("renders order items if API call succeeds", async() => {
            mockGetOrders.mockResolvedValue(order);
            setup();

            let items = await screen.findByTestId("order-items");
            expect(items).toBeInTheDocument();
        });
    });

    test("calls cancelOrder when button is clicked", () => {
        const clickMock = jest.fn();
        render(<Order details={orders[0]} cancelOrder={clickMock} />);

        userEvent.click(screen.getByRole("button", { name: /cancel order/i}));
        expect(clickMock).toBeCalled();
    });
});