import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Cart from "../../../components/Secondary/Cart/Cart";

import { Customer } from "../../../api/Server";
import { account, cart } from "../../util/dataMock";

// Define server and user data
const Server = Customer.cart;
let data = account(false);

// Define tests
describe("Cart component", () => {
    beforeEach(() => {
        const mockGetAccount = jest.spyOn(Customer.users, "getAccount");
        mockGetAccount.mockResolvedValue(data);
    });

    describe("General", () => {
        test("renders status", async() => {
            render(
                <Router>
                    <Cart user={data} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("cart-loading"));

            let status = screen.getByTestId("status");
            expect(status).toBeInTheDocument();
        });
    });

    describe("Items", () => {
        const mockGetCart = jest.spyOn(Server, "getCart");

        test("renders skeleton during API call", async() => {
            render(
                <Router>
                    <Cart user={data} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("cart-loading"));
        });

        test("renders error message if API call fails", async() => {
            mockGetCart.mockRejectedValue(new Error("An unknown error occurred. Kindly try again."));
            render(
                <Router>
                    <Cart user={data} />
                </Router>
            );
            await waitForElementToBeRemoved(() => screen.queryByTestId("cart-loading"));

            let error = await screen.findByText("An error occurred loading your cart. Kindly refresh the page and try again.");
            expect(error).toBeInTheDocument();
        });

        describe("if API call succeeds", () => {
            test("renders error message if cart is empty", async() => {
                mockGetCart.mockResolvedValue(cart(true));
                render(
                    <Router>
                        <Cart user={data} />
                    </Router>
                );
                await waitForElementToBeRemoved(() => screen.queryByTestId("cart-loading"));

                let error = await screen.findByText("You have no items in your cart.");
                expect(error).toBeInTheDocument();
            });

            test("renders cart items if API call succeeds", async() => {
                mockGetCart.mockResolvedValue(cart(false));
                render(
                    <Router>
                        <Cart user={data} />
                    </Router>
                );
                await waitForElementToBeRemoved(() => screen.queryByTestId("cart-loading"));
    
                let items = await screen.findByTestId("cart-items");
                expect(items).toBeInTheDocument();
            });
        });
    });
});