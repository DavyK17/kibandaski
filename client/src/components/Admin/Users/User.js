import capitalise from "../../../util/capitalise";

const User = props => {
    // Destructure props and details
    const { details, windowWidth, iconHeight, viewOrders } = props;
    const { id, firstName, lastName, phone, email, role } = details;

    // Define user orders view icon
    const UserOrdersView = (
        <svg className="iconUserOrdersView" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path className="pathUserOrdersView" style={{ fill:"#ffffff" }} d="M21.312 12.644c-.972-1.189-3.646-4.212-4.597-5.284l-1.784 1.018 4.657 5.35c.623.692.459 1.704-.376 2.239-.773.497-5.341 3.376-6.386 4.035-.074-.721-.358-1.391-.826-1.948-.469-.557-6.115-7.376-7.523-9.178-.469-.601-.575-1.246-.295-1.817.268-.549.842-.918 1.43-.918.919 0 1.408.655 1.549 1.215.16.641-.035 1.231-.623 1.685l1.329 1.624 7.796-4.446c1.422-1.051 1.822-2.991.93-4.513-.618-1.053-1.759-1.706-2.978-1.706-1.188 0-.793-.016-9.565 4.475-1.234.591-2.05 1.787-2.05 3.202 0 .87.308 1.756.889 2.487 1.427 1.794 7.561 9.185 7.616 9.257.371.493.427 1.119.15 1.673-.277.555-.812.886-1.429.886-.919 0-1.408-.655-1.549-1.216-.156-.629.012-1.208.604-1.654l-1.277-1.545c-.822.665-1.277 1.496-1.377 2.442-.232 2.205 1.525 3.993 3.613 3.993.596 0 1.311-.177 1.841-.51l9.427-5.946c.957-.664 1.492-1.781 1.492-2.897 0-.744-.24-1.454-.688-2.003zm-8.292-10.492c.188-.087.398-.134.609-.134.532 0 .997.281 1.243.752.312.596.226 1.469-.548 1.912l-5.097 2.888c-.051-1.089-.579-2.081-1.455-2.732l5.248-2.686zm3.254 10.055l-4.828 2.823-.645-.781 4.805-2.808.668.766zm-6.96.238l4.75-2.777.668.768-4.773 2.791-.645-.782zm8.49 1.519l-4.881 2.854-.645-.781 4.858-2.84.668.767z" />
        </svg>
    )

    // Return component
    return (
        <>
            <div className="user-body">
                <div className="info">
                    <p className="email"><span>{email}</span></p>
                    <p className="name"><span className="first-name">{firstName}</span> <span className="last-name">{lastName}</span></p>
                    <p className="phone">{phone}</p>
                </div>
            </div>
            <div className="user-footer">
                <p className="id">#{id}</p>
                <p className="role" id={`user-${id}-status`}>{capitalise(role)}</p>
                <button className="view-orders" onClick={viewOrders} aria-label="View orders">{windowWidth > 991 ? "View orders" : UserOrdersView}</button>
            </div>
        </>
    )
}

export default User;