import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import { Admin } from "../../../api/Server";
import capitalise from "../../../util/capitalise";
import renderOrderTime from "../../../util/renderOrderTime";

const Order = props => {
    // Destructure props and details
    const { details, windowWidth, iconHeight, acknowledgeOrder, fulfillOrder } = props;
    const { id, userId, createdAt, status } = details;

    // Define server
    const Server = Admin.orders;
    
    // Define order acknowledge icon
    const OrderAcknowledge = (
        <svg className="iconOrderAcknowledge" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path className="pathOrderAcknowledge" style={{ fill:"#ffffff" }} d="M11.329 19.6c-.185.252-.47.385-.759.385-.194 0-.389-.06-.558-.183-.419-.309-.509-.896-.202-1.315l1.077-1.456c.308-.417.896-.508 1.315-.199.421.306.511.895.201 1.313l-1.074 1.455zm-.825-2.839c.308-.418.217-1.007-.201-1.316-.421-.308-1.008-.216-1.317.203l-1.073 1.449c-.309.419-.217 1.009.202 1.317.417.307 1.007.218 1.315-.202l1.074-1.451zm-1.9-1.388c.309-.417.217-1.007-.203-1.315-.418-.307-1.007-.216-1.314.202l-1.083 1.461c-.308.419-.209.995.209 1.304.421.308 1 .229 1.308-.19l1.083-1.462zm-1.898-1.386c.308-.419.219-1.007-.203-1.315-.419-.309-1.007-.218-1.315.201l-1.075 1.451c-.308.418-.217 1.008.202 1.315.419.307 1.008.218 1.315-.202l1.076-1.45zm17.294-8.438s-1.555.301-2.667.479c-2.146.344-4.144-.416-6.361-1.562-.445-.229-.957-.466-1.458-.466-.461 0-.913.209-1.292.639-1.366 1.547-2.16 2.915-3.785 3.864-.801.468.14 1.934 1.86 1.331.878-.308 1.736-.895 2.706-1.677.762-.615 1.22-.524 1.879.135 1.238 1.238 5.404 5.351 5.404 5.351 1.317-.812 2.422-1.312 3.713-1.792v-6.302zm-10.524 12.662c-.158.459-.618 1.001-.953 1.455.297.235.608.334.882.334.717 0 1.188-.671.542-1.318l-.471-.471zm6.506-3.463c-1.07-1.055-4.732-4.667-5.803-5.713-.165-.161-.421-.18-.608-.044-.639.464-2.082 1.485-2.944 1.788-1.685.59-3.115-.222-3.422-1.359-.192-.712.093-1.411.727-1.781 1.008-.589 1.657-1.375 2.456-2.363-.695-.539-1.35-.732-1.991-.732-1.706 0-3.317 1.366-5.336 1.231-1.373-.09-3.061-.403-3.061-.403v6.333c1.476.321 2.455.464 3.92 1.199l.462-.624c.364-.496.949-.792 1.564-.792.87 0 1.622.578 1.861 1.388.951 0 1.667.602 1.898 1.387.826-.031 1.641.519 1.897 1.385 1.171 0 2.017.92 1.981 2.007l1.168 1.168c.367.368.963.367 1.331 0 .368-.368.368-.964 0-1.332l-1.686-1.687c-.22-.22.113-.553.333-.333l2.032 2.033c.368.368.963.368 1.331 0s.368-.963 0-1.331l-2.501-2.502c-.221-.218.113-.553.333-.333l2.7 2.701c.368.368.963.368 1.331 0 .358-.356.361-.922.027-1.291z" />
        </svg>
    )

    // Define order fulfill icon
    const OrderFulfill = (
        <svg className="iconOrderFulfill" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path className="pathOrderFulfill" style={{ fill:"#ffffff" }} d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z" />
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
        } catch (err) {
            setError(true);
            console.log(err);
        }

        setIsLoadingItems(false);
    }

    useEffect(() => {
        if (items.length === 0 && fetchItems) fetchOrderItems();
        // eslint-disable-next-line
    }, [fetchItems]);

    // Define function to view order items
    const viewItems = e => {
        e.preventDefault();
        setFetchItems(fetchItems ? false : true);

        const items = document.getElementById(`order-${id}-items`);
        items.classList.toggle("show");
    }

    // RENDERING
    // Order items
    const renderItems = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading order items. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading items
        if (isLoadingItems) return <Skeleton containerTestId="admin-order-items-loading" />;

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
            <div id={`order-${id}-items`} className={`items${items.length === 0 ? "" : " show"}`} data-testid="admin-order-items">
                {list}
                {
                    items.length === 0 ? null : (
                        <div className="item total" id={`order-${id}-total`}>
                            <p className="name">Total</p>
                            <p className="price">
                                <span className="currency">Ksh</span><span>{total}</span>
                            </p>
                        </div>
                    )
                }
            </div>
        )
    };

    // Order action
    const renderOrderActionButton = () => {
        const logic = (acknowledge, fulfill) => status === "pending" ? acknowledge : status === "acknowledged" ? fulfill : null;

        return !(status === "pending" || status === "acknowledged") ? null : (
            <button className="order-action" onClick={logic(acknowledgeOrder, fulfillOrder)} aria-label={logic("Acknowledge order", "Fulfill order")}>
                {windowWidth > 991 ? logic("Acknowledge order", "Fulfill order") : logic(OrderAcknowledge, OrderFulfill)}
            </button>
        )
    }

    // Component
    return (
        <>
            <div className="order-body">
                <div className="info">
                    <p className="id"><span>{userId}</span><span className="separator"> | </span><span>#{id}</span></p>
                    <p className="time">{renderOrderTime(createdAt)}</p>
                    <button className="view-items" onClick={viewItems} aria-label={fetchItems ? "Hide items" : "View items"}>
                        {fetchItems ? "Hide items" : "View items"}
                    </button>
                    {renderItems()}
                </div>
            </div>
            <div className="order-footer">
                <p className="status" id={`order-${id}-status`}>{capitalise(status)}</p>
                {renderOrderActionButton()}
            </div>
        </>
    )
}

export default Order;