import capitalise from "../../../util/capitalise";

const CategorySelect = props => {
    // Destructure props
    const { categories, category, handleChange } = props;

    // RENDERING
    // Dropdown
    const renderBody = () => {
        // Define function to render product categories
        const renderOptions = () => categories.map((category, i) => <option key={i} value={category}>{capitalise(category)}</option>);

        // Return dropdown
        return (
            <div className="category-select" data-testid="category-select">
                <label htmlFor="category" className="sr-only">Category</label>
                <select id="category" onChange={handleChange} defaultValue={category}>
                    <option value="all">All items</option>
                    {renderOptions()}
                </select>
            </div>
        )
    }

    // Component
    return (
        <div className="category-select-container">
            {renderBody()}
        </div>
    )
}

export default CategorySelect;