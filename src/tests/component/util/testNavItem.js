import { screen } from "@testing-library/react";

const testNavItem = (text, inDocument) => {
    let description = `${inDocument ? "renders" : "does not render"} ${text} item`;

    return test(description, () => {
        let item = screen.queryByText(text);
        inDocument ? expect(item).toBeInTheDocument() : expect(item).not.toBeInTheDocument();
    });
}

export default testNavItem;