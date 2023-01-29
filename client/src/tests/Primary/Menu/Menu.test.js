import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import Menu from "../../../components/Primary/Menu/Menu";

import { Customer as Server } from "../../../api/Server";
import { products, categories } from "../../util/dataMock";

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
        await act(async() => {
            const mockGetProducts = jest.spyOn(Server.products, "getProducts");
            mockGetProducts.mockRejectedValue("Error: No products found.");

            const mockGetCategories = jest.spyOn(Server.products, "getCategories");
            mockGetCategories.mockRejectedValue("Error: No categories found.");

            render(
                <Router>
                    <Menu />
                </Router>
            );
        });

        let error = screen.getByText("An error occurred loading the menu. Kindly refresh the page and try again.");
        expect(error).toBeInTheDocument();
    });

    test("renders items if API call succeeds", async() => {
        await act(async() => {
            const mockGetProducts = jest.spyOn(Server.products, "getProducts");
            mockGetProducts.mockResolvedValue(products);

            const mockGetCategories = jest.spyOn(Server.products, "getCategories");
            mockGetCategories.mockResolvedValue(categories);

            render(
                <Router>
                    <Menu />
                </Router>
            );
        });

        let items = await screen.findByRole("list");
        expect(items).toBeInTheDocument();

        let categorySelect = await screen.findByTestId("category-select");
        expect(categorySelect).toBeInTheDocument();

        let menuSort = await screen.findByTestId("menu-sort");
        expect(menuSort).toBeInTheDocument();
    });
});