import { render, fireEvent } from "@testing-library/react";
import LoginLogout from "../../components/Header/LoginLogout";

// Define mock function
const clickMock = jest.fn();

// Define tests
describe("Login", () => {
    test("calls handleLogin when login icon is clicked", () => {
        const { getByTestId } = render(<LoginLogout handleLogin={clickMock} />);
        let login = getByTestId("iconLogin");
    
        fireEvent.click(login);
        expect(clickMock).toBeCalled(); 
    });
});

describe("Logout", () => {
    test("calls handleLogout when logout icon is clicked", () => {
        const { getByTestId } = render(<LoginLogout user={{}} handleLogout={clickMock} />);
        let logout = getByTestId("iconLogout");

        fireEvent.click(logout);
        expect(clickMock).toBeCalled(); 
    });

    test("renders loading skeleton when logging out", () => {
        const { getByTestId } = render(<LoginLogout user={{}} loggingOut={true} />);
        let skeleton = getByTestId("logging-out");
        expect(skeleton).toBeInTheDocument();
    });
});
