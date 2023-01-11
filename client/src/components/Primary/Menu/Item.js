const Item = props => {
    const { id, name, description, price, category } = props;

    return (
        <>
            <p>{id}</p>
            <p>{name}</p>
            <p>{description}</p>
            <p>{price}</p>
            <p>{category}</p>
        </>
    )
}

export default Item;