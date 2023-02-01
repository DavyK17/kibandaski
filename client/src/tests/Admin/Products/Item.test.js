import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Item from "../../../components/Admin/Products/Item";

import { products } from "../../util/dataMock";

describe("Admin product item component", () => {
    test("calls editProduct when button is clicked", () => {
        const clickMock = jest.fn();

        render(<Item details={products[0]} editProduct={clickMock} />);
        let button = screen.getAllByRole("button")[0];

        userEvent.click(button);
        expect(clickMock).toBeCalled();
    });

    test("calls deleteProduct when button is clicked", () => {
        const clickMock = jest.fn();

        render(<Item details={products[0]} deleteProduct={clickMock} />);
        let button = screen.getAllByRole("button")[1];

        userEvent.click(button);
        expect(clickMock).toBeCalled();
    });
});