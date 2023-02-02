import capitalise from "../../../util/capitalise";

const Item = props => {
    // Destructure props and details
    const { details, windowWidth, iconHeight, addToCart } = props;
    const { id, name, description, price, category } = details;

    // Define add to cart icon
    const CartAdd = (
        <svg className="iconCartAdd" width={iconHeight} height={iconHeight} viewBox="0 0 24 24">
            <path className="pathCartAdd" style={{ fill:"#ffffff" }} d="M13.299 3.74c-.207-.206-.299-.461-.299-.711 0-.524.407-1.029 1.02-1.029.262 0 .522.1.721.298l3.783 3.783c-.771.117-1.5.363-2.158.726l-3.067-3.067zm3.92 14.84l-.571 1.42h-9.296l-3.597-8.961-.016-.039h9.441c.171-.721.459-1.395.848-2h-14.028v2h.643c.535 0 1.021.304 1.256.784l4.101 10.216h12l1.21-3.015c-.698-.03-1.367-.171-1.991-.405zm-6.518-14.84c.207-.206.299-.461.299-.711 0-.524-.407-1.029-1.02-1.029-.261 0-.522.1-.72.298l-4.701 4.702h2.883l3.259-3.26zm8.799 4.26c-2.484 0-4.5 2.015-4.5 4.5s2.016 4.5 4.5 4.5c2.482 0 4.5-2.015 4.5-4.5s-2.018-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z" />
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
                <button className="add-to-cart" onClick={addToCart} aria-label="Add to cart">{windowWidth > 991 ? "Add to Cart" : CartAdd}</button>
            </div>
        </>
    )
}

export default Item;