import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Header from "../../components/Header/Header";

import { user } from "../util/dataMock";

describe("Header component", () => {
    describe("Unauthenticated", () => {
        beforeEach(() => {
            render(
                <Router>
                    <Header />
                </Router>
            );
        });

        test("renders logo", () => {
            let logo = screen.getByTestId("logo");
            expect(logo).toBeInTheDocument();
        });

        test("renders Home button", () => {
            let home = screen.getByTestId("iconHome");
            expect(home).toBeInTheDocument();
        });

        test("renders Login button", () => {
            let login = screen.getByTestId("iconLogin");
            expect(login).toBeInTheDocument();
        });
    });

    describe("Authenticated", () => {
        let userMock = user("admin");

        describe("General", () => {
            beforeEach(() => {
                render(
                    <Router>
                        <Header user={userMock} />
                    </Router>
                );
            });

            test("renders logo", () => {
                let logo = screen.getByTestId("logo");
                expect(logo).toBeInTheDocument();
            });

            test("renders Logout button", () => {
                let logout = screen.getByTestId("iconLogout");
                expect(logout).toBeInTheDocument();
            });
        });

        describe("View-specific", () => {
            test("renders Cart button on primary page", () => {
                render(
                    <MemoryRouter initialEntries={["/menu"]}>
                        <Header user={userMock} />
                    </MemoryRouter>
                );
    
                let cart = screen.getByTestId("iconCart");
                expect(cart).toBeInTheDocument();
            });

            test("renders Home button on secondary page", () => {
                render(
                    <MemoryRouter initialEntries={["/cart"]}>
                        <Header user={userMock} />
                    </MemoryRouter>
                );

                let home = screen.getByTestId("iconHome");
                expect(home).toBeInTheDocument();
            });
        });
    });
});