import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CategorySelect from "../../../components/Primary/Menu/CategorySelect";
import { categories } from "../../util/dataMock";

describe("Menu category select", () => {
    test("calls handleChange when option is selected", () => {
        const changeMock = jest.fn();

        render(<CategorySelect categories={categories} category="all" handleChange={changeMock} />);
        let categorySelect = screen.getByLabelText("Category");

        userEvent.selectOptions(categorySelect, ["proteins"]);
        expect(changeMock).toBeCalled(); 
    });
});