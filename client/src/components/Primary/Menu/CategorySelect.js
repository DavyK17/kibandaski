import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import { Customer } from "../../../api/Server";
import capitalise from "../../../util/capitalise";

const CategorySelect = props => {
    // Destructure props and define server
    const { handleChange } = props;
    const Server = Customer.products;
    
    // Set state and define fetch function
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async() => {
        setIsLoading(true);

        try {
            let response = await Server.getCategories();
            if (response) {
                setCategories(response);
                setIsLoading(false);
            }
        } catch(err) {
            setError(true);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line
    }, []);

    // RENDERING
    // Dropdown
    const renderBody = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading product categories. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton />;

        // Define function to render product categories
        const renderOptions = () => categories.map((category, i) => <option key={i} value={category}>{capitalise(category)}</option>);

        // Return dropdown
        return (
            <>
                <div className="category-select" data-testid="category-select">
                    <label htmlFor="category" className="sr-only">Category</label>
                    <select id="category" onChange={handleChange} defaultValue="all">
                        <option value="all">All items</option>
                        {renderOptions()}
                    </select>
                </div>
            </>
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