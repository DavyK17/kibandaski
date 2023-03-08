import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Item from "../../../../components/Primary/Menu/Item";
import { products } from "../../util/dataMock";

describe("Menu item", () => {
    test("calls addToCart when button is clicked", () => {
        const clickMock = jest.fn();

        render(<Item details={products[0]} addToCart={clickMock} />);
        let button = screen.getByRole("button");

        userEvent.click(button);
        expect(clickMock).toBeCalled();
    });
});