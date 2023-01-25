import capitalise from "../../../util/capitalise";

const EditProduct = props => {
    // Destructure props and details
    const { details, handleBack, handleSubmit } = props;
    const { id, name, description, price, category } = details;

    // Return component
    return (
        <>
            <form className="product-edit" onSubmit={handleSubmit} autoComplete="off" data-testid="product-edit">
                <div className="name-price">
                    <div className="name">
                        <div className="header">
                            <h3>Name</h3>
                            {id === "new" ? null : <span className="id">#{id}</span>}
                        </div>
                        <label className="sr-only" htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Name" defaultValue={name} />
                    </div>
                    <div className="price">
                        <h3>Price</h3>
                        <label className="sr-only" htmlFor="price">Price</label>
                        <input type="number" id="price" placeholder="Price" min={0} pattern="[0-9]+" defaultValue={price} />
                    </div>
                </div>
                <div className="description">
                    <h3>Description</h3>
                    <label className="sr-only" htmlFor="description">Description</label>
                    <textarea id="description" placeholder="Name" defaultValue={description}></textarea>
                </div>
                <div className="category">
                    <h3>Category</h3>
                    <label className="sr-only" htmlFor="category">Category</label>
                    <input type="text" id="category" placeholder="Category" defaultValue={category ? capitalise(category) : null} />
                </div>
                <div className="buttons">
                    <button type="submit">{ id === "new" ? "Create product" : "Update product"}</button>
                    <button onClick={handleBack}>Back to products</button>
                </div>
            </form>
            <p id="status"></p>
        </>
    )

}

export default EditProduct;