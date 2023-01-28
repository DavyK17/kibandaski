import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
    // Define useNavigate() and useLocation()
    let navigate = useNavigate();
    let location = useLocation();

    // Define function to go back to previous page
    const goBack = e => {
        e.preventDefault();
        navigate(-1);
    }

    // Return component
    return (
        <section className="not-found" data-testid="not-found">
            <h2>Not Found</h2>
            <p>The page you requested <span className="path">({location.pathname})</span> does not exist. <a href="/#" onClick={goBack}>Click here</a> to go back to the previous page.</p>
        </section>
    );
}

export default NotFound;