import capitalise from "../../../util/capitalise";

const Item = props => {
    // Destructure props
    const { id, name, description, price, category, windowWidth, iconHeight, editProduct, deleteProduct } = props;

    // Define product edit icon
    const ProductEdit = (
        <svg className="iconProductEdit" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path className="pathProductEdit" style={{ fill:"#ffffff" }} d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.994 12.964l3.106 3.105-4.112.931 1.006-4.036zm9.994-3.764l-5.84 5.921-3.202-3.202 5.841-5.919 3.201 3.2z" />
        </svg>
    )

    // Define product delete icon
    const ProductDelete = (
        <svg className="iconProductDelete" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path className="pathProductDelete" style={{ fill:"#ffffff" }} d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
        </svg>
    )

    // Return component
    return (
        <>
            <div className="item-body">
                <div className="info">
                    <p className="name">{name}</p>
                    <p className="description">{description}</p>
                </div>
                <p className="price">
                    <span className="currency">Ksh</span><span>{price.toLocaleString("en-KE")}</span>
                </p>
            </div>
            <div className="item-footer">
                <p className="id">#{id}</p>
                <p className="category" id={`item-${id}-status`}>{capitalise(category)}</p>
                <div className="buttons">
                    <button className="button" onClick={editProduct}>{windowWidth > 991 ? "Edit" : ProductEdit}</button>
                    <button className="button" onClick={deleteProduct}>{windowWidth > 991 ? "Delete" : ProductDelete}</button>
                </div>
            </div>
        </>
    )
}

export default Item;