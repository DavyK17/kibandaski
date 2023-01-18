import { useState, useEffect } from "react";
import { Customer } from "../../../api/Server";
import capitalise from "../../../util/capitalise";

const CategorySelect = props => {
    const Server = Customer.products;
    
    const { handleChange } = props;
    const [categories, setCategories] = useState();

    useEffect(() => {
        const fetchCategories = async() => {
            let response = await Server.getCategories();
            if (response) setCategories(response);
        }

        fetchCategories();
        // eslint-disable-next-line
    }, []);

    const renderOptions = () => {
        if (categories) return categories.map((category, i) => {
            return <option key={i} value={category}>{capitalise(category)}</option>;
        });
    }

    return (
        <div className="category-select-container">
            <div className="category-select" data-testid="category-select">
                <label htmlFor="category" className="sr-only">Category</label>
                <select id="category" onChange={handleChange} defaultValue="all">
                    <option value="all">All items</option>
                    {renderOptions()}
                </select>
            </div>
            <p id="status"></p>
        </div>
    )
}

export default CategorySelect;