import { useState, useEffect } from "react";
import Item from "./Item";
import CategorySelect from "./CategorySelect";
import { Customer } from "../../../api/Server";

const Menu = () => {
    const Server = Customer.products;

    const [menu, setMenu] = useState();
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

    const [category, setCategory] = useState(null);
    useEffect(() => {
        if (menu) {
            let items = menu.filter(item => item.category === category);
            setItems(items);
        }
        // eslint-disable-next-line
    }, [category]);

    const changeCategory = ({ target }) => {
        setCategory(target.value);
    }

    const renderItems = () => {
        if (items) return items.map(({ id, name, description, price, category }, i) => {
            return (
                <li key={i}>
                    <Item id={id} name={name} description={description} price={price} category={category} />
                </li>
            )
        });
    };

    return (
        <ul>
            <CategorySelect handleChange={changeCategory} />
            {renderItems()}
        </ul>
    );
}

export default Menu;