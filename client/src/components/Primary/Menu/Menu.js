import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import Item from "./Item";
import CategorySelect from "./CategorySelect";
import ItemSort from "./ItemSort";

import { Customer as Server } from "../../../api/Server";

import capitalise from "../../../util/capitalise";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Menu = props => {
    // Destructure props
    const { user, windowWidth, iconHeight } = props;

    // Define useNavigate() and useParams()
    let navigate = useNavigate();
    let params = useParams();

    // STATE + FUNCTIONS
    // Menu and menu items
    const [menu, setMenu] = useState([]);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = async() => {
        setIsLoading(true);

        try {
            let products = await Server.products.getProducts();
            if (products) {
                setMenu(products);

                if (params.category) products = products.filter(item => item.category === params.category);
                setItems(products);
                setItems(products);

                let categories = await Server.products.getCategories();
                if (categories) {
                    let sorted = categories.sort((a, b) => {
                        if (a < b) return -1;
                        if (b > a) return 1;
                        return 0;
                    });
                    
                    setCategories(sorted);
                    setIsLoading(false);
                }
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
        document.getElementById("menu-sort").selectedIndex = 0;
    }

    useEffect(() => {
        if (params.category) {
            setCategory(params.category);
            const categorySelect = document.getElementById("category");
            for (let option of categorySelect.options) if (option.value === params.category) option.selected = true;
        }
        // eslint-disable-next-line
    }, [categories]);

    useEffect(() => {
        if (category === "all") return setItems(menu);
        let items = menu.filter(item => item.category === category);
        setItems(items);
        // eslint-disable-next-line
    }, [category]);

    // Define function to sort items
    const sortItems = ({ target }) => {
        let original = category === "all" ? menu : menu.filter(item => item.category === category);
        let toSort = [].concat(category === "all" ? items : items.filter(item => item.category === category));

        const sorted = toSort.sort((a, b) => {
            if (target.value.includes("name")) {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
        
                if (target.value === "name-ascending") {
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                }
        
                if (target.value === "name-descending") {
                    if (nameA > nameB) return -1;
                    if (nameA < nameB) return 1;
                }
            }

            if (target.value.includes("price")) {
                if (target.value === "price-ascending") return a.price - b.price;
                if (target.value === "price-descending") return b.price - a.price;
            }

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

                const mainStatus = document.getElementById("status");
                const addStatus = document.getElementById(`item-${id}-status`);
        
                mainStatus.textContent = null;
                addStatus.textContent = "Adding to cart…";

                let response = await Server.cart.addToCart(id);
                if (!response.includes("Added to cart")) {
                    displayErrorMessage(response);
                    addStatus.textContent = "Error";
                } else {
                    addStatus.textContent = "Item added to cart";
                }

                setTimeout(() => addStatus.textContent = capitalise(category), 3000);
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
            <div className="menu" data-testid="menu">
                <div className="sort">
                    {categories ? <CategorySelect categories={categories} category={category} handleChange={changeCategory} /> : null}
                    {categories && items.length > 1 ? <ItemSort handleSortChange={sortItems} /> : null}
                    <p id="status"></p>
                </div>
                {renderItems()}
            </div>
        </>
    )
}

export default Menu;