import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CartCheckout from "../../../../components/Secondary/Cart/CartCheckout";
import CartEmpty from "../../../../components/Secondary/Cart/CartEmpty";
import ItemDelete from "../../../../components/Secondary/Cart/ItemDelete";
import ItemEdit from "../../../../components/Secondary/Cart/ItemEdit";

// Define mock click function
const clickMock = jest.fn();

// Define data for icons to test with function
const iconsToAutoTest = [
    {
        name: "Cart checkout icon",
        component: <CartCheckout handleClick={clickMock} />,
        testId: "cart-icon-checkout"
    },
    {
        name: "Cart empty icon",
        component: <CartEmpty handleClick={clickMock} />,
        testId: "cart-icon-empty"
    },
    {
        name: "Cart item delete icon",
        component: <ItemDelete handleClick={clickMock} />,
        testId: "cart-icon-item-delete"
    }
]

// Define function to return tests
const testIcon = (name, component, testId) => {
    return describe(name, () => {
        test("calls handleClick when clicked", () => {
            render(component);
            let svg = screen.getByTestId(testId);

            userEvent.click(svg);
            expect(clickMock).toBeCalled();
        });
    });
}

// Execute tests
iconsToAutoTest.forEach(({ name, component, testId}) => testIcon(name, component, testId));

// Define test for cart item edit icon test
describe("Cart item edit icon", () => {
    test("calls handleSubmit when clicked", () => {
        const submitMock = jest.fn(e => e.preventDefault());

        render(<ItemEdit handleSubmit={submitMock} />);
        let svg = screen.getByTestId("cart-icon-item-edit");

        userEvent.click(svg);
        expect(submitMock).toBeCalled();
    });
});