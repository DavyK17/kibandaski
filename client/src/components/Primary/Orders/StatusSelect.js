import capitalise from "../../../util/capitalise";

const StatusSelect = props => {
    // Destructure props
    const { handleChange } = props;

    // Define order statuses
    const statuses = ["pending", "acknowledged", "fulfilled", "cancelled"];

    // Define function to render select options
    const renderOptions = () => statuses.map((status, i) => {
        return <option key={i} value={status}>{capitalise(status)}</option>;
    });

    // Return component
    return (
        <div className="category-select-container">
            <div className="category-select" data-testid="status-select">
                <label htmlFor="order-status" className="sr-only">Order status</label>
                <select id="order-status" onChange={handleChange} defaultValue="all">
                    <option value="all">All orders</option>
                    {renderOptions()}
                </select>
            </div>
            <p id="status"></p>
        </div>
    )
}

export default StatusSelect;