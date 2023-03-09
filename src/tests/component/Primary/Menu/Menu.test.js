import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import Menu from "../../../../components/Primary/Menu/Menu";

import { Customer as Server } from "../../../../api/Server";
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
            <Menu />
        </Router>
    );
}

// Define tests
describe("Menu component", () => {
    test("renders loading skeleton during API call", () => {
        render(
            <Router>
                <Menu />
            </Router>
        );

        let skeleton = screen.getByTestId("menu-loading");
        expect(skeleton).toBeInTheDocument();
    });

    test("renders error message if API call fails", async () => {
        setup("rejected");
        await waitForElementToBeRemoved(() => screen.queryByTestId("menu-loading"));

        let error = screen.getByText("An error occurred loading the menu. Kindly refresh the page and try again.");
        expect(error).toBeInTheDocument();
    });

    test("renders items if API call succeeds", async() => {
        setup("resolved");
        await waitForElementToBeRemoved(() => screen.queryByTestId("menu-loading"));

        let items = await screen.findByRole("list");
        expect(items).toBeInTheDocument();

        let categorySelect = await screen.findByTestId("category-select");
        expect(categorySelect).toBeInTheDocument();

        let menuSort = await screen.findByTestId("menu-sort");
        expect(menuSort).toBeInTheDocument();
    });
});