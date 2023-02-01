import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import User from "../../../components/Admin/Users/User";

import { users } from "../../util/dataMock";

describe("Admin user component", () => {
    test("calls viewOrders when button is clicked", () => {
        const clickMock = jest.fn();

        render(<User details={users[0]} viewOrders={clickMock} />);
        let button = screen.getAllByRole("button")[0];

        userEvent.click(button);
        expect(clickMock).toBeCalled();
    });
});