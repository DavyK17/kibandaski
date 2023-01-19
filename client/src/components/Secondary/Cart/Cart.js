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
    const { user, iconHeight } = props;
    const Server = Customer.cart;
    const status = document.getElementById("status");

    const { cartId } = user;
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

    const renderItems = () => {
        if (isLoading) return <Skeleton />;
        if (error) return <p className="error">An unknown error occurred. Kindly refresh the page and try again.</p>;
        if (cart && cart.items.length === 0) return <p className="error">You have no items in your cart.</p>;

        let total = () => cart ? cart.items.map(({ totalCost }) => totalCost).reduce((a, b) => a + b, 0) : null;
        let list = () => {
            if (cart) return cart.items.map(({ productId, name, quantity, totalCost}, i) => {
                const changeItemQuantity = async e => {
                    e.preventDefault();

                    status.textContent = "Updating quantity…";
                    let response = await Server.item.updateItem(productId, e.target[0].value);
                    if (!response.includes("Quantity updated in cart")) return displayErrorMessage(response);

                    status.textContent = "Item quantity updated successfully";
                    fetchCart();
                    status.textContent = null;
                }

                const removeCartItem = async e => {
                    e.preventDefault();

                    status.textContent = "Removing item…";
                    let response = await Server.item.removeItem(productId);
                    if (typeof response === "string") return displayErrorMessage(response);

                    status.textContent = "Item removed successfully";
                    fetchCart();
                    status.textContent = null;
                }

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
            })
        };

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