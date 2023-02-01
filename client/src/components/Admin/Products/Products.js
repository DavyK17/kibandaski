import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import Item from "./Item";
import CategorySelect from "../../Primary/Menu/CategorySelect";
import ItemSort from "../../Primary/Menu/ItemSort";
import EditProduct from "./EditProduct";

import { Admin, Customer } from "../../../api/Server";
import capitalise from "../../../util/capitalise";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Products = props => {
    // Destructure props
    const { user, windowWidth, iconHeight } = props;

    // Define server, useNavigate() and useParams()
    const Server = Admin.products;
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
            let products = await Customer.products.getProducts();
            if (products) {
                setMenu(products);

                if (params.category) products = products.filter(item => item.category === params.category);
                setItems(products);

                let categories = await Customer.products.getCategories();
                if (categories) {
                    let sorted = categories.sort((a, b) => {
                        if (a < b) return -1;
                        if (b > a) return 1;
                        return 0;
                    });
                    
                    setCategories(sorted);
                }
            }
        } catch (err) {
            setError(true);
            console.log(err);
        }

        setIsLoading(false);
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

    // Edit product
    const [edit, setEdit] = useState(null);

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
        if (error) return <p className="error">An error occurred loading products. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton containerTestId="products-loading" />;

        // Get menu items
        let list = () => items.map(({ id, name, description, price, category }, i) => {
            // Define function to edit product
            const editProduct = e => {
                e.preventDefault();
                setEdit({ id, name, description, price, category });
            }

            // Define function to delete product
            const deleteProduct = async e => {
                e.preventDefault();
                if (!user) return navigate("/login");

                const mainStatus = document.getElementById("status");
                const deleteStatus = document.getElementById(`item-${id}-status`);
        
                mainStatus.textContent = null;
                deleteStatus.textContent = "Deleting product…";

                let response = await Server.deleteProduct(id);
                if (typeof response === "string") {
                    displayErrorMessage(response);
                    deleteStatus.textContent = "Error";
                    return setTimeout(() => deleteStatus.textContent = capitalise(category), 3000);
                }

                deleteStatus.textContent = "Product deleted";
                fetchItems();

                setCategory("all");
                const categorySelect = document.getElementById("category");
                for (let i = 0; i < categorySelect.options.length; i++)
                    categorySelect.options[i].defaultSelected ? categorySelect.selectedIndex = i : categorySelect.selectedIndex = 0;
                document.getElementById("menu-sort").selectedIndex = 0;
            }

            // Return menu item
            return (
                <li key={i}>
                    <Item
                        details={{ id, name, description, price, category }} windowWidth={windowWidth} iconHeight={iconHeight}
                        editProduct={editProduct} deleteProduct={deleteProduct}
                    />
                </li>
            )
        });

        // Return menu items
        return (
            <ul>
                {list()}
            </ul>
        )
    }

    // Define function to add new product
    const addProduct = async e => {
        e.preventDefault();
        const status = document.getElementById("status");

        let name = e.target[0].value;
        let price = e.target[1].value;
        let description = e.target[2].value;
        let category = e.target[3].value;

        status.textContent = "Creating product…";
        let response = await Server.createProduct(name, description, price, category);
        if (!response.includes("Product created")) return displayErrorMessage(response);

        status.textContent = null;
        setCategory("all");
        setEdit(null);
        fetchItems();
    }

    // Define function to update product details
    const updateDetails = async e => {
        e.preventDefault();
        const status = document.getElementById("status");

        let name = e.target[0].value;
        let price = e.target[1].value;
        let description = e.target[2].value;
        let category = e.target[3].value;

        status.textContent = "Updating product…";
        let response = await Server.updateProduct(edit.id, name, description, price, category);
        if (!response.includes("Product updated")) return displayErrorMessage(response);

        status.textContent = null;
        setCategory("all");
        setEdit(null);
        fetchItems();
    }

    // Return edit component if corresponding button is clicked
    if (edit) {
        if (edit.id === "new") return <EditProduct details={edit} handleBack={() => setEdit(null)} handleSubmit={addProduct} />;
        return <EditProduct details={edit} handleBack={() => setEdit(null)} handleSubmit={updateDetails} />;
    }

    // Component
    return (
        <div className="products" data-testid="admin-products">
            <div className="sort">
                {categories ? <CategorySelect categories={categories} category={category} handleChange={changeCategory} /> : null}
                {categories && items.length > 1 ? <ItemSort handleSortChange={sortItems} /> : null}
                <button onClick={() => setEdit({ id: "new" })}>Create product</button>
                <p id="status" data-testid="status"></p>
            </div>
            {renderItems()}
        </div>
    )
}

export default Products;