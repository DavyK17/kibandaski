import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import { Customer } from "../../../api/Server";
import capitalise from "../../../util/capitalise";

const Order = props => {
    // Destructure props and define server
    const { id, createdAt, status, windowWidth, iconHeight, cancelOrder } = props;
    const Server = Customer.orders;

    // Define function to render order time
    const renderTime = createdAt => {
        let options = { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true };
        let dateTime = new Intl.DateTimeFormat("en-KE", options);
        return dateTime.format(new Date(createdAt));
    }
    
    // Define order cancel icon
    const OrderCancel = (
        <svg id="iconOrderCancel" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path id="pathOrderCancel" style={{ fill:"#ffffff" }} d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5 15.538l-3.592-3.548 3.546-3.587-1.416-1.403-3.545 3.589-3.588-3.543-1.405 1.405 3.593 3.552-3.547 3.592 1.405 1.405 3.555-3.596 3.591 3.55 1.403-1.416z"/>
        </svg>
    )

    // Set state and define fetch function
    const [items, setItems] = useState([]);
    const [fetchItems, setFetchItems] = useState(false);

    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrderItems = async() => {
        setIsLoadingItems(true);

        try {
            let order = await Server.getOrders(id);
            setItems(order.items);
            setIsLoadingItems(false);
        } catch (err) {
            setError(true);
            console.log(err);
        }
    }

    useEffect(() => {
        if (items.length === 0 && fetchItems) fetchOrderItems();
        // eslint-disable-next-line
    }, [fetchItems]);

    // Define function to view order items
    const viewItems = e => {
        e.preventDefault();
        setFetchItems(fetchItems ? false : true);

        const items = document.getElementById(`items-${id}`);
        items.classList.toggle("show");
    }

    // RENDERING
    // Order items
    const renderItems = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading order items. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading items
        if (isLoadingItems) return <Skeleton />;

        // Get total cost of order items
        let total = items.map(({ totalCost }) => totalCost).reduce((a, b) => a + b, 0);

        // Get order items
        let list = items.map(({ productId, name, quantity, totalCost}, i) => {
            return (
                <div key={i} className="item" id={`order-${id}-item-${productId}`}>
                    <p className="name">
                        <span>{name}</span><span className="times">&times;</span><span className="quantity">{quantity}</span>
                    </p>
                    <p className="price">
                        <span className="currency">Ksh</span><span>{totalCost}</span>
                    </p>
                </div>
            )
        });

        // Return order items
        return (
            <>
                {list}
                <div className="item total" id={`order-${id}-total`}>
                    <p className="name">Total</p>
                    <p className="price">
                        <span className="currency">Ksh</span><span>{total}</span>
                    </p>
                </div>
            </>
        )
    };

    // Component
    return (
        <>
            <div className="order-body">
                <div className="info">
                    <p className="id">#{id}</p>
                    <p className="time">{renderTime(createdAt)}</p>
                    <button className="view-items" onClick={viewItems}>{ fetchItems ? "Hide items" : "View items"}</button>
                    <div id={`items-${id}`} className="items">
                        {renderItems()}
                    </div>
                </div>
            </div>
            <div className="order-footer">
                <p className="status" id={`order-${id}-status`}>{capitalise(status)}</p>
                {status === "pending" ? <button className="cancel-order" onClick={cancelOrder}>{windowWidth > 991 ? "Cancel order" : OrderCancel}</button> : null}
            </div>
        </>
    )
}

export default Order;