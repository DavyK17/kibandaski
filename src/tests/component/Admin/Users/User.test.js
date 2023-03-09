import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import User from "../../../../components/Admin/Users/User";

import { users } from "../../util/dataMock";

describe("Admin user component", () => {
    test("calls viewOrders when button is clicked", () => {
        const clickMock = jest.fn();
        render(<User details={users[0]} viewOrders={clickMock} />);

        userEvent.click(screen.getByRole("button", { name: /view orders/i}));
        expect(clickMock).toBeCalled();
    });
});