import capitalise from "../../../util/capitalise";

const Order = props => {
    const { id, createdAt, status, cancelOrder } = props;

    const renderTime = createdAt => {
        let options = { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true };
        let dateTime = new Intl.DateTimeFormat("en-KE", options);
        return dateTime.format(new Date(createdAt));
    }

    const cancelButton = <button className="cancel-order" onClick={cancelOrder}>Cancel order</button>;

    return (
        <>
            <div className="item-body">
                <div className="info">
                    <p className="name">{renderTime(createdAt)}</p>
                    <p className="description">View items</p>
                </div>
            </div>
            <div className="item-footer">
                <p className="id">#{id}</p>
                <p className="status">{capitalise(status)}</p>
                {status === "pending" ? cancelButton : null}
            </div>
        </>
    )
}

export default Order;