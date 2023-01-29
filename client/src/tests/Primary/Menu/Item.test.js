import { render, fireEvent } from "@testing-library/react";
import Item from "../../../components/Primary/Menu/Item";
import { products } from "../../util/dataMock";

describe("Menu item", () => {
    test("calls addToCart when cart icon is clicked", () => {
        const clickMock = jest.fn();

        const { getByRole } = render(<Item details={products[0]} addToCart={clickMock} />);
        let button = getByRole("button");

        fireEvent.click(button);
        expect(clickMock).toBeCalled(); 
    });
});