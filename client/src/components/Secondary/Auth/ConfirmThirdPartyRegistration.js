import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import ConfirmDetails from "./ConfirmDetails";

import { Auth, Customer } from "../../../api/Server";
import displayErrorMessage from "../../../util/displayErrorMessage";

const ConfirmThirdPartyRegistration = props => {
    // Destructure props
    const { setUser } = props;

    // Define status and useNavigate()
    const status = document.getElementById("status");
    let navigate = useNavigate();

    // Set state and define fetch function
    const [federatedDetails, setFederatedDetails] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFederatedDetails = async() => {
        setIsLoading(true);

        try {
            let data = await Customer.users.getAccount();
            setFederatedDetails(data);
            setIsLoading(false);
        } catch (err) {
            setError(true);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchFederatedDetails();
        // eslint-disable-next-line
    }, []);


    // RENDERING
    // Return error message if error
    if (error) return <p className="error">An unknown error occurred. Kindly refresh the page and try again.</p>;

    // Return skeleton if loading
    if (isLoading) return <Skeleton />;

    // Do the following if third-party details have been fetched
    if (federatedDetails) {
        // Define function to confirm details
        const confirmThirdPartyRegistration = async e => {
            e.preventDefault();
            
            if (e.target[1].value && !e.target[2].value) return status.textContent = "Kindly confirm your password.";
            if (!e.target[1].value || !e.target[2].value) return status.textContent = "No password provided.";
            if (e.target[1].value !== e.target[2].value) return status.textContent = "Passwords do not match.";

            status.textContent = "Confirming details…";
            let response = await Auth.confirmThirdPartyRegistration(e.target[0].value, e.target[2].value);
            if (typeof response !== "object") return displayErrorMessage(response);

            setUser(response);
            status.textContent = null;
            e.target.reset();
            navigate("/cart");
        }

        // Return confirm details component
        return <ConfirmDetails handleSubmit={confirmThirdPartyRegistration} />
    }
}

export default ConfirmThirdPartyRegistration;