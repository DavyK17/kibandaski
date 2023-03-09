const Checkout = props => {
    // Destructure props
    const { phone, handleBack, handleSubmit } = props;

    // Safaricom phone number validation
    const phoneRegex = /^254(11[0-5]|7(([0-2]|9)\d|4([0-6]|8)|5[7-9]|6[8-9]))\d{6}$/;
    const checkPhone = phone => phone.toString().match(phoneRegex) ? phone : null;

    // Return component
    return (
        <form className="checkout" onSubmit={handleSubmit} autoComplete="off" data-testid="checkout">
            <p>Kindly confirm your M-Pesa number:</p>
            <div className="input">
                <label className="sr-only" htmlFor="phone">M-Pesa number</label>
                <input type="tel" id="phone" placeholder="i.e. 254XXXXXXXXX" pattern={phoneRegex.toString().replaceAll("/", "")} defaultValue={checkPhone(phone)} required />
            </div>
            <div className="buttons">
                <button onClick={handleBack}>Back to Cart</button>
                <button type="submit">Place order</button>
            </div>
        </form>
    )
}

export default Checkout;