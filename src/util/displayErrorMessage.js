const displayErrorMessage = response => {
    const status = document.getElementById("status");

    if (response.includes("undefined") || response === "An unknown error occurred. Kindly try again.") {
        // Display generic error message
        status.textContent = "An unknown error occurred. Kindly try again.";
    } else {
        // Remove "Error: " from error message
        response = response.split(" ");
        response.shift();
        response = response.join(" ");
    
        // Display error message
        status.textContent = response;
    }
}

export default displayErrorMessage;