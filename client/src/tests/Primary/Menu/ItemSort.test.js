import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemSort from "../../../components/Primary/Menu/ItemSort";

describe("Menu item sort", () => {
    test("calls handleSortChange when option is selected", () => {
        const changeMock = jest.fn();

        render(<ItemSort handleSortChange={changeMock} />);
        let menuSort = screen.getByLabelText("Sort items");

        userEvent.selectOptions(menuSort, ["name-ascending"]);
        expect(changeMock).toBeCalled(); 
    });
});