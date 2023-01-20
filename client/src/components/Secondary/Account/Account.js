import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import EditDetails from "./EditDetails";

import { Customer } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const Account = () => {
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
            navigate("/menu");
            status.textContent = null;
        }, 3000);
    }

    // RENDERING
    // Details
    const renderBody = () => {
        // Return skeleton if loading
        if (isLoading) return <Skeleton />

        // Return error message if error
        if (error) return <p className="error">An error occurred loading your account details. Kindly refresh the page and try again.</p>;

        // Do the following if details have been fetched
        if (details) {
            // Define function to update details
            const updateDetails = async e => {
                e.preventDefault();
                
                status.textContent = "Updating details…";
                let response = await Server.updateAccount(e.target[0].value, e.target[1].value, e.target[2].value, e.target[3].value, e.target[4].value, e.target[5].value);
                if (!response.includes("User updated")) return displayErrorMessage(response);
                
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