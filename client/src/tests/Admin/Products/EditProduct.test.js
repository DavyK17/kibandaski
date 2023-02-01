import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EditProduct from "../../../components/Admin/Products/EditProduct";

import { products } from "../../util/dataMock";

describe("Admin product edit component", () => {
    describe("Back button", () => {
        test("calls handleBack when button is clicked", () => {
            const backMock = jest.fn(e => e.preventDefault());
    
            render(<EditProduct details={products[0]} handleBack={backMock} />);
            let button = screen.getByText("Back to products");
    
            userEvent.click(button);
            expect(backMock).toBeCalled();
        });
    });

    describe("Submit button", () => {
        test(`renders "Create product" if creating new product`, () => {
            const submitMock = jest.fn(e => e.preventDefault());
    
            render(<EditProduct details={{ id: "new" }} handleSubmit={submitMock} />);
            let button = screen.getByText("Create product");
    
            userEvent.click(button);
            expect(submitMock).toBeCalled();
        });

        test(`renders "Update product" if editing existing product`, () => {
            const submitMock = jest.fn(e => e.preventDefault());
    
            render(<EditProduct details={products[0]} handleSubmit={submitMock} />);
            let button = screen.getByText("Update product");
    
            userEvent.click(button);
            expect(submitMock).toBeCalled();
        });
    });
});