import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import Item from "./Item";
import CategorySelect from "./CategorySelect";
import ItemSort from "./ItemSort";

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
    const changeCategory = ({ target }) => {
        setCategory(target.value);
        document.getElementById("sort-name").selectedIndex = 0;
        document.getElementById("sort-price").selectedIndex = 0;
    } 

    useEffect(() => {
        if (category === "all") return setItems(menu);
        let items = menu.filter(item => item.category === category);
        setItems(items);
        // eslint-disable-next-line
    }, [category]);

    // SORTING
    // By name
    const sortItemsByName = ({ target }) => {
        let original = category === "all" ? menu : menu.filter(item => item.category === category);
        let toSort = [].concat(category === "all" ? items : items.filter(item => item.category === category));

        const sorted = toSort.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
    
            if (target.value === "ascending") {
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
            }
    
            if (target.value === "descending") {
                if (nameA > nameB) return -1;
                if (nameA < nameB) return 1;
            }

            return 0;
        });

        setItems(target.value === "default" ? original : sorted);
    } 

    // By price
    const sortItemsByPrice = ({ target }) => {
        let original = category === "all" ? menu : menu.filter(item => item.category === category);
        let toSort = [].concat(category === "all" ? items : items.filter(item => item.category === category));

        const sorted = toSort.sort((a, b) => {
            if (target.value === "ascending") return a.price - b.price;
            if (target.value === "descending") return b.price - a.price;
            return 0;
        });

        setItems(target.value === "default" ? original : sorted);
    }


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
                <div className="sort">
                    <CategorySelect handleChange={changeCategory} />
                    {items.length > 1 ? <ItemSort type="name" handleNameSortChange={sortItemsByName} /> : null}
                    {items.length > 1 ? <ItemSort type="price" handlePriceSortChange={sortItemsByPrice} /> : null}
                    <p id="status"></p>
                </div>
                {renderItems()}
            </div>
        </>
    )
}

export default Menu;