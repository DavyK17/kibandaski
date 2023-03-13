import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import trim from "validator/lib/trim";

import Order from "./Order";
import StatusSelect from "../../Primary/Orders/StatusSelect";
import UserSearch from "./UserSearch";

import { Admin } from "../../../api/Server";

import capitalise from "../../../util/capitalise";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Orders = props => {
    // Destructure props
    const { windowWidth, iconHeight } = props;

    // Define server and useParams()
    const Server = Admin.orders;
    let params = useParams();

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

                if (params.userId) {
                    orders = orders.filter(order => order.userId === params.userId);
                    document.getElementById("search").value = params.userId;
                }
                setRenderedOrders(orders);
            }
        } catch (err) {
            setError(true);
            console.error(err);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line
    }, []);


    // Order status for which to show orders
    const [status, setStatus] = useState("all");
    const changeStatus = ({ target }) => {
        setStatus(target.value);
    };
    
    useEffect(() => {
        let desiredUserId = trim(document.getElementById("search").value);

        if (status === "all") {
            if (desiredUserId) return setRenderedOrders(orders.filter(order => order.userId === desiredUserId));
            return setRenderedOrders(orders);
        }

        let list = orders.filter(order => order.status === status);
        if (desiredUserId) return setRenderedOrders(list.filter(order => order.userId === desiredUserId));
        setRenderedOrders(list);
        // eslint-disable-next-line
    }, [status]);

    // Define function to show orders by user
    const showOrdersByUser = e => {
        e.preventDefault();
        document.getElementById("order-status").selectedIndex = 0;

        let desiredUserId = trim(e.target[0].value);
        if (!desiredUserId) return setRenderedOrders(orders);

        let userOrders = orders.filter(order => order.userId === desiredUserId);
        setRenderedOrders(userOrders);
    }

    // RENDERING
    // Orders
    const renderOrders = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading orders. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton containerTestId="admin-orders-loading" />;

        // Return message if no orders, otherwise return orders
        return renderedOrders.length === 0 ? <p>No orders to show.</p> : renderedOrders.map(({ id, userId, createdAt, status }, i) => {
            // Define function to acknowledge or fulfill order
            const orderAction = type => {
                const logic = (acknowledge, fulfill) => type === 1 ? acknowledge : type === 2 ? fulfill : null;

                let statusText = logic("Acknowledging order…", "Fulfilling order…");
                let desiredResponse = logic("Order acknowledged", "Order fulfilled");

                return async e => {
                    e.preventDefault();
    
                    const mainStatus = document.getElementById("status");
                    const orderStatus = document.getElementById(`order-${id}-status`);
    
                    mainStatus.textContent = null;
                    orderStatus.textContent = statusText;
    
                    let response = await logic(Server.acknowledgeOrder(id), Server.fulfillOrder(id));
                    if (!response.includes(desiredResponse)) {
                        displayErrorMessage(response);
                        orderStatus.textContent = "Error";
                    } else {
                        fetchOrders();

                        setStatus("all");
                        document.getElementById("order-status").selectedIndex = 0;
                        document.getElementsByClassName("user-search")[0].reset();
                    }
    
                    setTimeout(() => orderStatus.textContent = capitalise(status), 3000);
                }
            }

            // Return order
            return (
                <li id={`order-${id}`} key={i}>
                    <Order
                        details={{ id, userId, createdAt, status }} windowWidth={windowWidth} iconHeight={iconHeight}
                        acknowledgeOrder={orderAction(1)} fulfillOrder={orderAction(2)}
                    />
                </li>
            )
        });
    };

    // Component
    return (
        <div className="orders" data-testid="admin-orders">
            <div className="sort">
                <StatusSelect handleChange={changeStatus} />
                <UserSearch handleSubmit={showOrdersByUser} />
                <p id="status" data-testid="status"></p>
            </div>
            <ul>
                {renderOrders()}
            </ul>
        </div>
    )
}

export default Orders;