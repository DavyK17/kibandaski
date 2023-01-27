import capitalise from "../../../util/capitalise";

const RoleSelect = props => {
    // Destructure props and roles
    const { role, handleChange } = props;
    const roles = ["customer", "admin"];

    // RENDERING
    // Dropdown
    const renderBody = () => {
        // Define function to render product categories
        const renderOptions = () => roles.map((role, i) => <option key={i} value={role}>{capitalise(role)}</option>);

        // Return dropdown
        return (
            <>
                <div className="category-select" data-testid="category-select">
                    <label htmlFor="user-role" className="sr-only">User role</label>
                    <select id="user-role" onChange={handleChange} defaultValue={role}>
                        <option value="all">All users</option>
                        {renderOptions()}
                    </select>
                </div>
            </>
        )
    }

    // Component
    return (
        <div className="category-select-container">
            {renderBody()}
        </div>
    )
}

export default RoleSelect;