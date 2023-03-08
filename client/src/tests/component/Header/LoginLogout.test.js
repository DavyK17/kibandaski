import { render, screen, fireEvent } from "@testing-library/react";
import LoginLogout from "../../../components/Header/LoginLogout";

// Define mock function
const clickMock = jest.fn();

// Define tests
describe("Login", () => {
    test("calls handleLogin when login icon is clicked", () => {
        render(<LoginLogout handleLogin={clickMock} />);
        let login = screen.getByTestId("iconLogin");
    
        fireEvent.click(login);
        expect(clickMock).toBeCalled(); 
    });
});

describe("Logout", () => {
    test("calls handleLogout when logout icon is clicked", () => {
        render(<LoginLogout user={{}} handleLogout={clickMock} />);
        let logout = screen.getByTestId("iconLogout");

        fireEvent.click(logout);
        expect(clickMock).toBeCalled(); 
    });

    test("renders loading skeleton when logging out", () => {
        render(<LoginLogout user={{}} loggingOut={true} />);
        let skeleton = screen.getByTestId("logging-out");
        expect(skeleton).toBeInTheDocument();
    });
});
