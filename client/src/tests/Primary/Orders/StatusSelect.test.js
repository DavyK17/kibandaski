import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StatusSelect from "../../../components/Primary/Orders/StatusSelect";

describe("Order status select", () => {
    test("calls handleChange when option is selected", () => {
        const changeMock = jest.fn();

        render(<StatusSelect handleChange={changeMock} />);
        let statusSelect = screen.getByLabelText("Order status");

        userEvent.selectOptions(statusSelect, ["pending"]);
        expect(changeMock).toBeCalled(); 
    });
});