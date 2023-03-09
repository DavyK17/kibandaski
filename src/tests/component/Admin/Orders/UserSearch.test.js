import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserSearch from "../../../../components/Admin/Orders/UserSearch";

describe("Admin orders user search component", () => {
    test("calls handleSubmit when button is clicked", () => {
        const submitMock = jest.fn(e => e.preventDefault());

        render(<UserSearch handleSubmit={submitMock} />);
        let button = screen.getByRole("button");

        userEvent.click(button);
        expect(submitMock).toBeCalled();
    });
});