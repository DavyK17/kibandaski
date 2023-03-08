import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Order from "../../../../components/Admin/Orders/Order";

import { Admin } from "../../../../api/Server";
import { orders, order } from "../../util/dataMock";

// Define server
const Server = Admin.orders;

// Define mock click function
const clickMock = jest.fn();

// Define tests
describe("Order", () => {
    describe("View items button", () => {
        const mockGetOrders = jest.spyOn(Server, "getOrders");

        // Define setup function
        const setup = () => {
            render(<Order details={orders[2]} />);
        
            const button = screen.getAllByRole("button")[0];
            userEvent.click(button);
        }

        // Define tests
        test("triggers API call when clicked", async() => {
            setup();
            await waitForElementToBeRemoved(() => screen.queryByTestId("admin-order-items-loading"));
            expect(mockGetOrders).toBeCalled();
        });

        test("renders loading skeleton during API call", async() => {
            setup();
            await waitForElementToBeRemoved(() => screen.queryByTestId("admin-order-items-loading"));
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

            let items = await screen.findByTestId("admin-order-items");
            expect(items).toBeInTheDocument();
        });
    });

    describe("Footer buttons", () => {
        test("calls acknowledgeOrder when button is clicked", () => {
            render(<Order details={orders[0]} acknowledgeOrder={clickMock} />);
            let button = screen.getAllByRole("button")[1];
    
            userEvent.click(button);
            expect(clickMock).toBeCalled();
        });

        test("calls fulfillOrder when button is clicked", () => {
            render(<Order details={orders[1]} fulfillOrder={clickMock} />);
            let button = screen.getAllByRole("button")[1];
    
            userEvent.click(button);
            expect(clickMock).toBeCalled();
        });
    });
});