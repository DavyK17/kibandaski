import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import Item from "./Item";
import CategorySelect from "./CategorySelect";

import { Customer } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Menu = props => {
    // Destructure props
    const { user, windowWidth, iconHeight } = props;

    // Define server and useNavigate()
    const Server = Customer.products;
    let navigate = useNavigate();

    // STATE + FUNCTIONS
    // Menu and menu items
    const [menu, setMenu] = useState([]);
    const [items, setItems] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = async() => {
        setIsLoading(true);

        try {
            let products = await Server.getProducts();
            if (products) {
                setMenu(products);
                setItems(products);
                setIsLoading(false);
            }
        } catch (err) {
            setError(true);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, []);

    // Product category
    const [category, setCategory] = useState("all");
    const changeCategory = ({ target }) => setCategory(target.value);
    useEffect(() => {
        if (category === "all") return setItems(menu);
        let items = menu.filter(item => item.category === category);
        setItems(items);
        // eslint-disable-next-line
    }, [category]);

    // RENDERING
    // Menu items
    const renderItems = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading the menu. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton />;

        // Get menu items
        let list = () => items.map(({ id, name, description, price, category }, i) => {
            // Define function to add item to cart
            const addToCart = async e => {
                e.preventDefault();
                if (!user) return navigate("/login");

                const Server = Customer.cart;
                const status = document.getElementById("status");
        
                status.textContent = "Adding to cart…";
                let response = await Server.addToCart(id);
                if (!response.includes("Added to cart")) return displayErrorMessage(response);

                status.textContent = "Item added to cart";
                setTimeout(() => status.textContent = null, 3000);
            }

            // Return menu item
            return (
                <li key={i}>
                    <Item id={id} name={name} description={description} price={price} category={category} windowWidth={windowWidth} iconHeight={iconHeight} addToCart={addToCart} />
                </li>
            )
        });

        // Return menu items
        return (
            <ul>
                {list()}
            </ul>
        )
    };

    // Component
    return (
        <>
            <div className="menu">
                <CategorySelect handleChange={changeCategory} />
                {renderItems()}
            </div>
        </>
    )
}

export default Menu;