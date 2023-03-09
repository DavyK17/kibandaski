import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Item from "../../../../components/Admin/Products/Item";

import { products } from "../../util/dataMock";

describe("Admin product item component", () => {
    test("calls editProduct when button is clicked", () => {
        const clickMock = jest.fn();
        render(<Item details={products[0]} editProduct={clickMock} />);

        userEvent.click(screen.getByRole("button", { name: /edit product/i}));
        expect(clickMock).toBeCalled();
    });

    test("calls deleteProduct when button is clicked", () => {
        const clickMock = jest.fn();
        render(<Item details={products[0]} deleteProduct={clickMock} />);

        userEvent.click(screen.getByRole("button", { name: /delete product/i}));
        expect(clickMock).toBeCalled();
    });
});