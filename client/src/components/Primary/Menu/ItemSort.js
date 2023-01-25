const ItemSort = props => {
    const { handleSortChange } = props;

    return (
        <div className="category-select-container">
            <div className="category-select" data-testid="menu-sort">
                <label htmlFor="menu-sort" className="sr-only">Sort items</label>
                <select id="menu-sort" onChange={handleSortChange} defaultValue="default">
                    <option value="default">Sort items</option>
                    <option value="name-ascending">Name (A-Z)</option>
                    <option value="name-descending">Name (Z-A)</option>
                    <option value="price-ascending">Price (low to high)</option>
                    <option value="price-descending">Price (high to low)</option>
                </select>
            </div>
        </div>
    )
}

export default ItemSort;