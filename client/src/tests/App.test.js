import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("Home page", () => {
    beforeEach(() => {
        render(
            <Router>
                <App />
            </Router>
        );
    });

    test("shows header", () => {
        let header = screen.getByTestId("header");
        expect(header).toBeInTheDocument();
    });

    test("shows menu on initial render", () => {
        let menu = screen.getByTestId("menu");
        expect(menu).toBeInTheDocument();
    });
});