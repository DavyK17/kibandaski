import { render, fireEvent } from "@testing-library/react";
import CategorySelect from "../../../components/Primary/Menu/CategorySelect";
import { categories } from "../../util/dataMock";

describe("Menu category select", () => {
    test("calls handleChange when option is selected", () => {
        const changeMock = jest.fn();

        const { getByLabelText } = render(<CategorySelect categories={categories} category="all" handleChange={changeMock} />);
        let categorySelect = getByLabelText("Category");

        fireEvent.change(categorySelect, { target: { value: "proteins" }});
        expect(changeMock).toBeCalled(); 
    });
});