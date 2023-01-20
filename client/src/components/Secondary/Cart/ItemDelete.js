const ItemDelete = props => {
    // Destructure props
    const { iconHeight, handleClick } = props;

    // Return component
    return (
        <svg id="iconCartItemDelete" width={iconHeight} height={iconHeight} viewBox="0 0 24 24" onClick={handleClick}>
            <path id="pathCartItemDelete" style={{ fill:"#000000" }} d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5 15.538l-3.592-3.548 3.546-3.587-1.416-1.403-3.545 3.589-3.588-3.543-1.405 1.405 3.593 3.552-3.547 3.592 1.405 1.405 3.555-3.596 3.591 3.55 1.403-1.416z"/>
        </svg>
    )
}

export default ItemDelete;