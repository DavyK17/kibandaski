import { render, fireEvent } from "@testing-library/react";
import CartHome from "../../components/Header/CartHome";

test("calls handleClick when icon is clicked", () => {
    const clickMock = jest.fn();

    const { getByTestId } = render(<CartHome handleClick={clickMock} />);
    let home = getByTestId("iconHome");

    fireEvent.click(home);
    expect(clickMock).toBeCalled(); 
});