import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import Item from "./Item";
import CategorySelect from "./CategorySelect";

import { Customer } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Menu = props => {
    const { windowWidth, iconHeight } = props;
    const Server = Customer.products;

    const [menu, setMenu] = useState([]);
    const [items, setItems] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async() => {
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

        fetchProducts();
        // eslint-disable-next-line
    }, []);

    const [category, setCategory] = useState("all");
    useEffect(() => {
        if (category === "all") return setItems(menu);
        let items = menu.filter(item => item.category === category);
        setItems(items);
        // eslint-disable-next-line
    }, [category]);

    const changeCategory = ({ target }) => setCategory(target.value);

    const renderItems = () => {
        if (isLoading) return <Skeleton />;
        if (error) return <p className="error">An error occurred loading the menu. Kindly refresh the page and try again.</p>;

        let list = () => {
            if (items) return items.map(({ id, name, description, price, category }, i) => {
                const addToCart = async e => {
                    e.preventDefault();
                    const Server = Customer.cart;
                    const status = document.getElementById("status");
            
                    status.textContent = "Adding to cart…";
                    let response = await Server.addToCart(id);
                    if (!response.includes("Added to cart")) return displayErrorMessage(response);

                    status.textContent = "Item added to cart";
                    setTimeout(() => status.textContent = null, 3000);
                }

                return (
                    <li key={i}>
                        <Item id={id} name={name} description={description} price={price} category={category} windowWidth={windowWidth} iconHeight={iconHeight} addToCart={addToCart} />
                    </li>
                )
            });
        };

        return (
            <ul>
                {list()}
            </ul>
        )
    };

    return (
        <>
            <div className="menu">
                <CategorySelect handleChange={changeCategory} />
                {renderItems()}
            </div>
        </>
    );
}

export default Menu;