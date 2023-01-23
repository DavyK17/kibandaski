import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import EditDetails from "./EditDetails";

import { Customer } from "../../../api/Server";
import capitalise from "../../../util/capitalise";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Account = props => {
    // Destructure props
    const { setUser } = props;

    // Define server, status and useNavigate()
    const Server = Customer.users;
    const status = document.getElementById("status");
    let navigate = useNavigate();

    // STATE + FUNCTIONS
    // Account details
    const [details, setDetails] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDetails = async() => {
        setIsLoading(true);

        try {
            let data = await Server.getAccount();
            setDetails(data);
            setIsLoading(false);
        } catch (err) {
            setError(true);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchDetails();
        // eslint-disable-next-line
    }, []);

    // Edit details
    const [edit, setEdit] = useState(false);

    const toggleEdit = e => {
        e.preventDefault();
        setEdit(edit ? false : true);
    }

    const deleteAccount = async e => {
        e.preventDefault();

        status.textContent = "Deleting account…";
        let response = await Server.deleteAccount();
        if (typeof response === "string") return displayErrorMessage(response);

        status.textContent = "Account deleted successfully";
        setTimeout(() => {
            setUser(null);
            navigate("/menu");
            status.textContent = null;
        }, 3000);
    }

    // RENDERING
    // Details
    const renderBody = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading your account details. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton />;

        // Do the following if details have been fetched
        if (details) {
            // List all providers of user's third-party credentials
            const providers = details.federated.map(credential => credential.provider);

            // Define function to return third-party link/unlink buttons
            const renderThirdPartyButton = provider => {
                let path = `/api/auth/login/${provider}`;
                let title = providers.includes(provider) ? `Unlink ${capitalise(provider)} account` : `Link ${capitalise(provider)} account`;
                let text = providers.includes(provider) ? `Unlink from ${capitalise(provider)}` : `Link to ${capitalise(provider)}`;

                const unlink = async e => {
                    e.preventDefault();

                    status.textContent = `Unlinking from ${capitalise(provider)}…`;
                    let response = await Server.unlinkThirdParty(provider);
                    if (typeof response === "string") return displayErrorMessage(response);

                    status.textContent = null;
                    fetchDetails();
                }

                return providers.includes(provider) ? <button title={title} onClick={unlink}>{text}</button> : <a href={path} title={title}>{text}</a>;
            }

            // Define function to update details
            const updateDetails = async e => {
                e.preventDefault();
                
                if (!e.target[4].value && e.target[5].value && e.target[6].value) return status.textContent = "No current password provided.";
                if (e.target[4].value) {
                    if (e.target[5].value && !e.target[6].value) return status.textContent = "Kindly confirm your new password.";
                    if (!e.target[5].value || !e.target[6].value) return status.textContent = "No new password provided.";
                    if (e.target[5].value !== e.target[6].value) return status.textContent = "New passwords do not match.";
                }
                
                status.textContent = "Updating details…";
                let response = await Server.updateAccount(e.target[0].value, e.target[1].value, e.target[2].value, e.target[3].value, e.target[4].value, e.target[6].value);
                if (response !== "Account updated successfully") return displayErrorMessage(response);
                
                status.textContent = null;
                setEdit(false);
                fetchDetails();
            }

            // Return edit component if corresponding button is clicked
            if (edit) return <EditDetails handleBack={toggleEdit} handleSubmit={updateDetails} />;

            // Destructure details
            const { firstName, lastName, phone, email } = details;

            // Return details
            return (
                <>
                    <div className="names">
                        <h3>Name</h3>
                        <p>{firstName} {lastName}</p>
                    </div>
                    <div className="phone">
                        <h3>Phone number</h3>
                        <p>{phone}</p>
                    </div>
                    <div className="email">
                        <h3>Email address</h3>
                        <p>{email}</p>
                    </div>
                    <div className="buttons">
                        <button onClick={toggleEdit}>Edit details</button>
                        {renderThirdPartyButton("google")}
                        <button onClick={deleteAccount}>Delete account</button>
                    </div>
                </>
            )
        }
    }

    // Component
    return (
        <div className="account">
            {renderBody()}
            <p id="status"></p>
        </div>
    );
}

export default Account;