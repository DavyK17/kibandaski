import { render, screen, fireEvent } from "@testing-library/react";
import CartHome from "../../../components/Header/CartHome";

test("calls handleClick when icon is clicked", () => {
    const clickMock = jest.fn();

    render(<CartHome handleClick={clickMock} />);
    let home = screen.getByTestId("iconHome");

    fireEvent.click(home);
    expect(clickMock).toBeCalled(); 
});