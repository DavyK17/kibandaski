const EditDetails = props => {
    // Destructure props
    const { handleBack, handleSubmit } = props;

    // Kenyan phone number regex
    const phoneRegex = /^254((20|4[0-6]|5\d|6([0-2]|[4-9]))\d{7}|1[0-1]\d{7}|7\d{8})$/;

    // Return component
    return (
        <form className="account" onSubmit={handleSubmit} autoComplete="off" data-testid="account-edit">
            <div className="names">
                <h3>Name</h3>
                <div className="input">
                    <label className="sr-only" htmlFor="first-name">First name</label>
                    <input type="text" id="first-name" placeholder="First name" />

                    <label className="sr-only" htmlFor="last-name">Last name</label>
                    <input type="text" id="last-name" placeholder="Last name" />
                </div>
            </div>
            <div className="phone">
                <h3>Phone number</h3>
                <div className="input">
                    <label className="sr-only" htmlFor="phone">Phone number</label>
                    <input type="tel" id="phone" placeholder="i.e. 254XXXXXXXXX" pattern={phoneRegex.toString().replaceAll("/", "")} />
                </div>
            </div>
            <div className="email">
                <h3>Email address</h3>
                <div className="input">
                    <label className="sr-only" htmlFor="email">Email address</label>
                    <input type="email" id="email" placeholder="Email address" />
                </div>
            </div>
            <div className="password">
                <h3>Current password</h3>
                <div className="input">
                    <label className="sr-only" htmlFor="current-password">Current password</label>
                    <input type="password" id="current-password" placeholder="Current password" />
                </div>
            </div>
            <div className="password">
                <h3>New password</h3>
                <div className="input">
                    <label className="sr-only" htmlFor="new-password">New password</label>
                    <input type="password" id="new-password" placeholder="New password" />

                    <label className="sr-only" htmlFor="confirm-password">Confirm password</label>
                    <input type="password" id="confirm-password" placeholder="Confirm password" />
                </div>
            </div>
            <div className="buttons">
                <button onClick={handleBack}>Back to details</button>
                <button type="submit">Update details</button>
            </div>
        </form>
    )
}

export default EditDetails;