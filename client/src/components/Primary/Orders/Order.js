import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import { Customer } from "../../../api/Server";

import capitalise from "../../../util/capitalise";

const Order = props => {
    const { id, createdAt, status, windowWidth, iconHeight, cancelOrder } = props;
    const Server = Customer.orders;

    const renderTime = createdAt => {
        let options = { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true };
        let dateTime = new Intl.DateTimeFormat("en-KE", options);
        return dateTime.format(new Date(createdAt));
    }
    
    const cancelButton = <button className="cancel-order" onClick={cancelOrder}>Cancel order</button>;
    const cancelIcon = (
        <svg id="iconOrderCancel" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path id="pathOrderCancel" style={{ fill:"#ffffff" }} d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5 15.538l-3.592-3.548 3.546-3.587-1.416-1.403-3.545 3.589-3.588-3.543-1.405 1.405 3.593 3.552-3.547 3.592 1.405 1.405 3.555-3.596 3.591 3.55 1.403-1.416z"/>
        </svg>
    )

    const [items, setItems] = useState([]);
    const [fetchItems, setFetchItems] = useState(false);

    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [error, setError] = useState(true);

    useEffect(() => {
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

        if (fetchItems) fetchOrderItems();
        // eslint-disable-next-line
    }, [fetchItems]);

    const renderItems = () => {
        if (isLoadingItems) return <Skeleton />;
        if (error) return <p className="error">An unknown error occurred. Kindly refresh the page and try again.</p>;

        let total = items.map(({ totalCost }) => totalCost).reduce((a, b) => a + b, 0);
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

    const viewItems = e => {
        e.preventDefault();
        setFetchItems(fetchItems ? false : true);

        const items = document.getElementById(`items-${id}`);
        items.classList.toggle("show");
    }

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
                <p className="status">{capitalise(status)}</p>
                {status === "pending" ? (windowWidth > 991 ? cancelButton : cancelIcon) : null}
            </div>
        </>
    )
}

export default Order;