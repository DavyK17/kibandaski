import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Checkout from "../../../components/Secondary/Cart/Checkout";

import { account } from "../../util/dataMock";

describe("Cart checkout component", () => {
    test("calls handleBack when button is clicked", () => {
        const backMock = jest.fn(e => e.preventDefault());

        render(<Checkout phone={account(false).phone} handleBack={backMock} />);
        let button = screen.getByText("Back to Cart");

        userEvent.click(button);
        expect(backMock).toBeCalled();
    });

    test("calls handleSubmit when button is clicked", () => {
        const submitMock = jest.fn(e => e.preventDefault());

        render(<Checkout phone={account(false).phone} handleSubmit={submitMock} />);
        let button = screen.getByText("Place order");

        userEvent.click(button);
        expect(submitMock).toBeCalled();
    });
});