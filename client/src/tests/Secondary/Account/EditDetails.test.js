import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EditDetails from "../../../components/Secondary/Account/EditDetails";

import { account } from "../../util/dataMock";

describe("Account edit form component", () => {
    test("calls handleBack when button is clicked", () => {
        const backMock = jest.fn(e => e.preventDefault());

        render(<EditDetails details={account(false)} handleBack={backMock} />);
        let button = screen.getByText("Back to details");

        userEvent.click(button);
        expect(backMock).toBeCalled();
    });

    test("calls handleSubmit when button is clicked", () => {
        const submitMock = jest.fn(e => e.preventDefault());

        render(<EditDetails details={account(false)} handleSubmit={submitMock} />);
        let button = screen.getByText("Update details");

        userEvent.click(button);
        expect(submitMock).toBeCalled();
    });
});