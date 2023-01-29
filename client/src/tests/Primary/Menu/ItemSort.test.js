import { render, fireEvent } from "@testing-library/react";
import ItemSort from "../../../components/Primary/Menu/ItemSort";

describe("Menu item sort", () => {
    test("calls handleSortChange when option is selected", () => {
        const changeMock = jest.fn();

        const { getByLabelText } = render(<ItemSort handleSortChange={changeMock} />);
        let menuSort = getByLabelText("Sort items");

        fireEvent.change(menuSort, { target: { value: "name-ascending" }});
        expect(changeMock).toBeCalled(); 
    });
});