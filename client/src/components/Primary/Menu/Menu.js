import { useState, useEffect } from "react";
import Item from "./Item";
import CategorySelect from "./CategorySelect";
import { Customer } from "../../../api/Server";

const Menu = props => {
    const { windowWidth, iconHeight } = props;
    const Server = Customer.products;

    const [menu, setMenu] = useState([]);
    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchProducts = async() => {
            let products = await Server.getProducts();
            if (products) {
                setMenu(products);
                setItems(products);
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

    const addToCart = e => {
        e.preventDefault();
    }

    const renderItems = () => {
        if (items) return items.map(({ id, name, description, price, category }, i) => {
            return (
                <li key={i}>
                    <Item id={id} name={name} description={description} price={price} category={category} windowWidth={windowWidth} iconHeight={iconHeight} addToCart={addToCart} />
                </li>
            )
        });
    };

    return (
        <>
            <div className="menu">
                <CategorySelect handleChange={changeCategory} />
                <ul>
                    {renderItems()}
                </ul>
            </div>
        </>
    );
}

export default Menu;