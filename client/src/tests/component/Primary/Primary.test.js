import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Primary from "../../../components/Primary/Primary";

describe("Primary section", () => {
    describe("Third-party registration confirmed", () => {
        beforeEach(() => {
            render(
                <Router>
                    <Primary view="menu" ctpr={false} />
                </Router>
            );
        });
    
        test("renders heading", () => {
            let heading = screen.getByRole("heading");
            expect(heading).toBeInTheDocument();
        });
    
        test("renders navigation", () => {
            let nav = screen.getByRole("navigation");
            expect(nav).toBeInTheDocument();
        });
    
        test("renders view component", () => {
            let component = screen.getByTestId("menu");
            expect(component).toBeInTheDocument();
        });
    });

    describe("Third-party registration not confirmed", () => {
        beforeEach(() => {
            render(
                <Router>
                    <Primary view="menu" ctpr={true} />
                </Router>
            );
        });
    
        test("does not render heading", () => {
            let heading = screen.queryByRole("heading");
            expect(heading).not.toBeInTheDocument();
        });
    
        test("does not render navigation", () => {
            let nav = screen.queryByRole("navigation");
            expect(nav).not.toBeInTheDocument();
        });
    
        test("does not render view component", () => {
            let component = screen.queryByTestId("menu");
            expect(component).not.toBeInTheDocument();
        });
    });
});