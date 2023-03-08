import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConfirmDetails from "../../../../components/Secondary/Auth/ConfirmDetails";

describe("Third-party registration confirmation component", () => {
    test("calls handleSubmit when button is clicked", () => {
        const submitMock = jest.fn(e => e.preventDefault());

        render(<ConfirmDetails handleSubmit={submitMock} />);
        let button = screen.getByRole("button");

        userEvent.click(button);
        expect(submitMock).toBeCalled();
    });
});