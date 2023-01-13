import capitalise from "../../../util/capitalise";

const StatusSelect = props => {
    const { handleChange } = props;
    const statuses = ["pending", "acknowledged", "fulfilled", "cancelled"];

    const renderOptions = () => {
        return statuses.map((status, i) => {
            return <option key={i} value={status}>{capitalise(status)}</option>;
        });
    }

    return (
        <div className="category-select" data-testid="status-select">
            <label htmlFor="status" className="sr-only">Order status</label>
            <select id="status" onChange={handleChange} defaultValue="all">
                <option value="all">All orders</option>
                {renderOptions()}
            </select>
        </div>
    );
}

export default StatusSelect;