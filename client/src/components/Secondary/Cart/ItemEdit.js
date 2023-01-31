const ItemEdit = props => {
    // Destructure props
    const { quantity, iconHeight, handleSubmit } = props;

    // Define item edit icon
    const ItemEdit = (
        <svg className="iconCartItemEdit" width={iconHeight} height={iconHeight} viewBox="0 0 24 24" data-testid="cart-icon-item-edit">
            <path className="pathCartItemEdit" style={{ fill:"#000000" }} d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.994 12.964l3.106 3.105-4.112.931 1.006-4.036zm9.994-3.764l-5.84 5.921-3.202-3.202 5.841-5.919 3.201 3.2z" />
        </svg>
    )

    // Return component
    return (
        <form className="quantity" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="item-quantity">Quantity</label>
            <input type="number" id="item-quantity" defaultValue={quantity}></input>
            <button type="submit">{ItemEdit}</button>
        </form>
    )
}

export default ItemEdit;