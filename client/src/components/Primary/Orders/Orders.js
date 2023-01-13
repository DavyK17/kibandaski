import { useState, useEffect } from "react";
import Order from "./Order";
import StatusSelect from "./StatusSelect";
import { Customer } from "../../../api/Server";

const Orders = props => {
    const Server = Customer.orders;

    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchOrders = async() => {
            let orders = await Server.getOrders();
            if (orders) {
                setOrders(products);
                setItems(products);
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
        if (items) return items.map(({ id, createdAt, status }, i) => {
            return (
                <li key={i}>
                    <Order id={id} createdAt={createdAt} status={status} cancelOrder={cancelOrder} />
                </li>
            )
        });
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