import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RoleSelect from "../../../../components/Admin/Users/RoleSelect";

describe("Admin user role select", () => {
    test("calls handleChange when option is selected", () => {
        const changeMock = jest.fn();

        render(<RoleSelect handleChange={changeMock} />);
        let roleSelect = screen.getByLabelText("User role");

        userEvent.selectOptions(roleSelect, ["admin"]);
        expect(changeMock).toBeCalled(); 
    });
});