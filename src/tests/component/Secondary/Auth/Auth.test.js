import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Auth from "../../../../components/Secondary/Auth/Auth";

import capitalise from "../../../../util/capitalise";

// Define login and register test suites
const testView = view => {
    return describe(`${capitalise(view)} view`, () => {
        beforeEach(() => {
            render(
                <Router>
                    <Auth view={view} />
                </Router>
            );
        });

        test(`${view === "login" ? "does not render" : "renders"} name fields`, () => {
            let firstName = screen.queryByLabelText("First name");
            if (view === "login") expect(firstName).not.toBeInTheDocument();
            if (view === "register") expect(firstName).toBeInTheDocument();

            let lastName = screen.queryByLabelText("Last name");
            if (view === "login") expect(lastName).not.toBeInTheDocument();
            if (view === "register") expect(lastName).toBeInTheDocument();
        });

        test(`${view === "login" ? "does not render" : "renders"} phone field`, () => {
            let phone = screen.queryByLabelText("Phone");
            if (view === "login") expect(phone).not.toBeInTheDocument();
            if (view === "register") expect(phone).toBeInTheDocument();
        });

        test("renders email address field", () => {
            let email = screen.getByLabelText("Email address");
            expect(email).toBeInTheDocument();
        });

        test("renders password field", () => {
            let password = screen.getByLabelText("Password");
            expect(password).toBeInTheDocument();
        });

        test(`${view === "login" ? "does not render" : "renders"} confirm password field`, () => {
            let confirmPassword = screen.queryByLabelText("Confirm password");
            if (view === "login") expect(confirmPassword).not.toBeInTheDocument();
            if (view === "register") expect(confirmPassword).toBeInTheDocument();
        });

        test("renders third-party login options", () => {
            let providers = ["google", "facebook"];
            providers.forEach(provider => {
                let link = screen.getByTitle(`Authenticate with ${capitalise(provider)}`);
                expect(link).toBeInTheDocument();
            });
        });
    });
}

// Define tests
describe("Authentication component", () => {
    describe("General", () => {
        test("calls handleSubmit when submit button is clicked", async () => {
            const submitMock = jest.fn(e => e.preventDefault());
            render(
                <Router>
                    <Auth handleSubmit={submitMock} />
                </Router>
            );

            let button = screen.getByRole("button");
            userEvent.click(button);
            expect(submitMock).toBeCalled();
        });
    });

    testView("login");
    testView("register");
});