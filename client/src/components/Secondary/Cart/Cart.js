import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import ItemEdit from "./ItemEdit";
import ItemDelete from "./ItemDelete";

import { Customer } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Cart = props => {
    const { user, iconHeight, handleCheckout } = props;
    const Server = Customer.cart;

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

    const ItemCheckout = (
        <svg id="iconCartCheckout" width={iconHeight} height={iconHeight} viewBox="0 0 24 24" onClick={handleCheckout}>
            <path id="pathCartCheckout" style={{ fill:"#000000" }} d="M19.5 8c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5zm-.5 7v-2h-2v-1h2v-2l3 2.5-3 2.5zm-5.701-11.26c-.207-.206-.299-.461-.299-.711 0-.524.407-1.029 1.02-1.029.262 0 .522.1.721.298l3.783 3.783c-.771.117-1.5.363-2.158.726l-3.067-3.067zm3.92 14.84l-.571 1.42h-9.296l-3.597-8.961-.016-.039h9.441c.171-.721.46-1.395.848-2h-14.028v2h.643c.535 0 1.021.304 1.256.784l4.101 10.216h12l1.211-3.015c-.699-.03-1.368-.171-1.992-.405zm-6.518-14.84c.207-.206.299-.461.299-.711 0-.524-.407-1.029-1.02-1.029-.261 0-.522.1-.72.298l-4.701 4.702h2.883l3.259-3.26z" />
        </svg>
    )

    const renderItems = () => {
        if (isLoading) return <Skeleton />;
        if (error) return <p className="error">An unknown error occurred. Kindly refresh the page and try again.</p>;
        if (cart && cart.items.length === 0) return <p className="error">You have no items in your cart.</p>;

        let total = () => cart ? cart.items.map(({ totalCost }) => totalCost).reduce((a, b) => a + b, 0) : null;
        let list = () => {
            if (cart) return cart.items.map(({ productId, name, quantity, totalCost}, i) => {
                const changeItemQuantity = async e => {
                    e.preventDefault();
                    const status = document.getElementById("status");
            
                    status.textContent = "Updating quantity…";
                    let response = await Server.item.updateItem(productId, e.target[0].value);
                    if (!response.includes("Quantity updated in cart")) return displayErrorMessage(response);

                    status.textContent = "Item quantity updated successfully";
                    fetchCart();
                    status.textContent = null;
                }

                const removeCartItem = async e => {
                    e.preventDefault();
                    const status = document.getElementById("status");

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
                        {ItemCheckout}
                    </div>
                </li>
            </>
        )
    }

    return (
        <div className="cart">
            <ul>
                {renderItems()}
            </ul>
            <p id="status"></p>
        </div>
    );
}

export default Cart;