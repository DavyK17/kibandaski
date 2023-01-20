const ItemSort = props => {
    const { type, handleNameSortChange, handlePriceSortChange } = props;

    const renderBody = () => {
        if (type === "name") return (
            <>
                <div className="category-select" data-testid="menu-sort-name">
                    <label htmlFor="sort-name" className="sr-only">Sort by name</label>
                    <select id="sort-name" onChange={handleNameSortChange} defaultValue="default">
                        <option value="default">Sort by name</option>
                        <option value="ascending">A-Z</option>
                        <option value="descending">Z-A</option>
                    </select>
                </div>
            </>
        )
    
        if (type === "price") return (
            <>
                <div className="category-select" data-testid="menu-sort-price">
                    <label htmlFor="sort-price" className="sr-only">Sort by price</label>
                    <select id="sort-price" onChange={handlePriceSortChange} defaultValue="default">
                        <option value="default">Sort by price</option>
                        <option value="ascending">Lowest to highest</option>
                        <option value="descending">Highest to lowest</option>
                    </select>
                </div>
            </>
        )
    }

    return (
        <div className="category-select-container">
            {renderBody()}
        </div>
    )
}

export default ItemSort;