import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import Order from "./Order";
import StatusSelect from "./StatusSelect";

import { Customer } from "../../../api/Server";

const Orders = props => {
    const { windowWidth, iconHeight } = props;
    const Server = Customer.orders;

    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async() => {
            setIsLoading(true);

            try {
                let orders = await Server.getOrders();
                if (orders) {
                    setOrders(orders);
                    setItems(orders);
                    setIsLoading(false);
                }
            } catch (err) {
                setError(true);
                console.log(err);
            }
        }

        fetchOrders();
        // eslint-disable-next-line
    }, []);

    const [status, setStatus] = useState("all");
    useEffect(() => {
        if (status === "all") return setItems(orders);
        let items = orders.filter(item => item.status === status);
        setItems(items);
        // eslint-disable-next-line
    }, [status]);

    const changeStatus = ({ target }) => setStatus(target.value);

    const cancelOrder = e => {
        e.preventDefault();
    }

    const renderItems = () => {
        if (isLoading) return <Skeleton />;
        if (error) return <p className="error">An error occurred loading your orders. Kindly refresh the page and try again.</p>;

        if (items.length > 0) return items.map(({ id, createdAt, status }, i) => {
            return (
                <li key={i}>
                    <Order id={id} createdAt={createdAt} status={status} windowWidth={windowWidth} iconHeight={iconHeight} cancelOrder={cancelOrder} />
                </li>
            )
        });

        return <p>No orders to show.</p>;
    };

    return (
        <>
            <div className="orders">
                <StatusSelect handleChange={changeStatus} />
                <ul>
                    {renderItems()}
                </ul>
            </div>
        </>
    );
}

export default Orders;