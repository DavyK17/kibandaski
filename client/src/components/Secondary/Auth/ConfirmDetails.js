const ConfirmDetails = props => {
    const { handleSubmit } = props;

    // Kenyan phone number regex
    const phoneRegex = /^254((20|4[0-6]|5\d|6([0-2]|[4-9]))\d{7}|1[0-1]\d{7}|7\d{8})$/;

    // Return component
    return (
        <form className="account" onSubmit={handleSubmit} autoComplete="off" data-testid="account-edit">
            <div className="phone">
                <h3>Phone number</h3>
                <div className="input">
                    <label className="sr-only" htmlFor="phone">Phone number</label>
                    <input type="tel" id="phone" placeholder="i.e. 254XXXXXXXXX" pattern={phoneRegex.toString().replaceAll("/", "")} required />
                </div>
            </div>
            <div className="password">
                <h3>Password</h3>
                <div className="input">
                    <label className="sr-only" htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Password" required />

                    <label className="sr-only" htmlFor="confirm-password">Confirm password</label>
                    <input type="password" id="confirm-password" placeholder="Confirm password" required />
                </div>
            </div>
            <button type="submit">Confirm details</button>
        </form>
    )
}

export default ConfirmDetails;