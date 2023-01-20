import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import ItemEdit from "./ItemEdit";
import ItemDelete from "./ItemDelete";
import CartCheckout from "./CartCheckout";
import Checkout from "./Checkout";

import { Customer } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Cart = props => {
    // Destructure props and user
    const { user, iconHeight } = props;
    const { cartId } = user;

    // Define server and status
    const Server = Customer.cart;
    const status = document.getElementById("status");

    // STATE + FUNCTIONS
    // Cart
    const [cart, setCart] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = async() => {
        setIsLoading(true);

        try {
            let data = await Server.getCart();
            setCart(data);
            setIsLoading(false);
        } catch(err) {
            setError(true);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line
    }, []);

    // Phone
    const [phone, setPhone] = useState();
    const fetchPhone = async() => {
        try {
            let data = await Customer.users.getAccount();
            setPhone(data.phone);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchPhone();
    }, []);

    // Checkout
    const [checkout, setCheckout] = useState(false);
    let navigate = useNavigate();

    const toggleCheckout = e => {
        e.preventDefault();
        setCheckout(checkout ? false : true);
    }

    const completeCheckout = async e => {
        e.preventDefault();
        
        status.textContent = "Placing order…";
        let response = await Server.checkout(e.target[0].value);
        if (!response.includes("Order placed")) return displayErrorMessage(response);

        status.textContent = "Order placed successfully";
        setTimeout(() => {
            navigate("/menu");
            status.textContent = null;
        }, 3000);
    }

    // RENDERING
    // Cart items
    const renderItems = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading your cart. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton />;

        // Do the following if cart has been fetched
        if (cart) {
            // Return message if no items
            if (cart.items.length === 0) return <p className="error">You have no items in your cart.</p>;
    
            // Get total cost of cart items
            let total = () => cart.items.map(({ totalCost }) => totalCost).reduce((a, b) => a + b, 0);
    
            // Get cart items
            let list = () => cart.items.map(({ productId, name, quantity, totalCost}, i) => {
                // Define function to change cart item quantity
                const changeItemQuantity = async e => {
                    e.preventDefault();
                    
                    status.textContent = "Updating quantity…";
                    let response = await Server.item.updateItem(productId, e.target[0].value);
                    if (!response.includes("Quantity updated in cart")) return displayErrorMessage(response);
                    
                    status.textContent = null;
                    fetchCart();
                }
    
                // Define function to remove cart item
                const removeCartItem = async e => {
                    e.preventDefault();
    
                    status.textContent = "Removing item…";
                    let response = await Server.item.removeItem(productId);
                    if (typeof response === "string") return displayErrorMessage(response);
                    
                    status.textContent = null;
                    fetchCart();
                }
    
                // Return cart item
                return (
                    <li key={i}>
                        <div className="item" id={`cart-${cartId}-item-${productId}`}>
                            <p className="name">{name}</p>
                            <ItemEdit quantity={quantity} iconHeight={iconHeight} handleSubmit={changeItemQuantity} />
                            <p className="price">
                                <span className="currency">Ksh</span><span>{totalCost}</span>
                            </p>
                            <ItemDelete iconHeight={iconHeight} handleClick={removeCartItem} />
                        </div>
                    </li>
                )
            });

            // Return cart items
            return (
                <>
                    <li>
                        <div className="item header" id={`cart-${cartId}-header`}>
                            <p className="name">Name</p>
                            <p className="quantity">Quantity</p>
                            <p className="price">Price</p>
                            <span className="sr-only">Remove item</span>
                        </div>
                    </li>
                    {list()}
                    <li>
                        <div className="item total" id={`cart-${cartId}-total`}>
                            <p className="name">Total</p>
                            <p className="price">
                                <span className="currency">Ksh</span><span>{total()}</span>
                            </p>
                            <CartCheckout iconHeight={iconHeight} handleClick={toggleCheckout} />
                        </div>
                    </li>
                </>
            )
        }
    }

    // Component
    return (
        <div className="cart">
            {
                checkout ? <Checkout phone={phone} handleBack={toggleCheckout} handleSubmit={completeCheckout} /> : (
                    <ul>
                        {renderItems()}
                    </ul>
                )
            }
            <p id="status"></p>
        </div>
    )
}

export default Cart;