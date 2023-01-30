import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import Order from "./Order";
import StatusSelect from "./StatusSelect";

import { Customer } from "../../../api/Server";

import capitalise from "../../../util/capitalise";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Orders = props => {
    // Destructure props and define server
    const { windowWidth, iconHeight } = props;
    const Server = Customer.orders;

    // STATE + FUNCTIONS
    // Orders
    const [orders, setOrders] = useState([]);
    const [renderedOrders, setRenderedOrders] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = async() => {
        setIsLoading(true);

        try {
            let orders = await Server.getOrders();
            if (orders) {
                setOrders(orders);
                setRenderedOrders(orders);
            }
        } catch (err) {
            setError(true);
            console.log(err);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line
    }, []);


    // Order status for which to show orders
    const [status, setStatus] = useState("all");
    const changeStatus = ({ target }) => setStatus(target.value);
    
    useEffect(() => {
        if (status === "all") return setRenderedOrders(orders);
        let list = orders.filter(order => order.status === status);
        setRenderedOrders(list);
        // eslint-disable-next-line
    }, [status]);

    // RENDERING
    // Orders
    const renderOrders = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading your orders. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton containerTestId="orders-loading" />;

        // Return message if no orders, otherwise return orders
        return renderedOrders.length === 0 ? <p>No orders to show.</p> : renderedOrders.map(({ id, createdAt, status }, i) => {
            // Define function to cancel order
            const cancelOrder = async e => {
                e.preventDefault();

                const mainStatus = document.getElementById("status");
                const cancelStatus = document.getElementById(`order-${id}-status`);

                mainStatus.textContent = null;
                cancelStatus.textContent = "Cancelling order…";

                let response = await Server.cancelOrder(id);
                if (typeof response === "string") {
                    displayErrorMessage(response);
                    cancelStatus.textContent = "Error";
                } else {
                    fetchOrders();
                }

                setTimeout(() => cancelStatus.textContent = capitalise(status), 3000);
            }

            // Return order
            return (
                <li key={i}>
                    <Order details={{ id, createdAt, status }} windowWidth={windowWidth} iconHeight={iconHeight} cancelOrder={cancelOrder} />
                </li>
            )
        });
    };

    // Component
    return (
        <>
            <div className="orders" data-testid="orders">
                <div className="sort">
                    <StatusSelect handleChange={changeStatus} />
                    <p id="status" data-testid="status"></p>
                </div>
                <ul>
                    {renderOrders()}
                </ul>
            </div>
        </>
    )
}

export default Orders;