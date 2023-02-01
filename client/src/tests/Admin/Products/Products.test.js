import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Products from "../../../components/Admin/Products/Products";

import { Customer as Server } from "../../../api/Server";
import { products, categories } from "../../util/dataMock";

// Define setup function
const setup = type => {
    const mockGetProducts = jest.spyOn(Server.products, "getProducts");
    if (type === "resolved") mockGetProducts.mockResolvedValue(products);
    if (type === "rejected") mockGetProducts.mockRejectedValue(new Error("No products found."));

    const mockGetCategories = jest.spyOn(Server.products, "getCategories");
    if (type === "resolved") mockGetCategories.mockResolvedValue(categories);
    if (type === "rejected") mockGetCategories.mockRejectedValue(new Error("No categories found."));

    render(
        <Router>
            <Products />
        </Router>
    );
}

// Define tests
describe("Admin products component", () => {
    test("renders loading skeleton during API call", () => {
        render(
            <Router>
                <Products />
            </Router>
        );

        let skeleton = screen.getByTestId("admin-products-loading");
        expect(skeleton).toBeInTheDocument();
    });

    test("renders error message if API call fails", async () => {
        setup("rejected");
        await waitForElementToBeRemoved(() => screen.queryByTestId("admin-products-loading"));

        let error = screen.getByText("An error occurred loading products. Kindly refresh the page and try again.");
        expect(error).toBeInTheDocument();
    });

    test("renders items if API call succeeds", async() => {
        setup("resolved");
        await waitForElementToBeRemoved(() => screen.queryByTestId("admin-products-loading"));

        let items = await screen.findByRole("list");
        expect(items).toBeInTheDocument();

        let categorySelect = await screen.findByTestId("category-select");
        expect(categorySelect).toBeInTheDocument();

        let menuSort = await screen.findByTestId("menu-sort");
        expect(menuSort).toBeInTheDocument();
    });
});