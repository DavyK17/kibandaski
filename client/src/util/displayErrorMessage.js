const displayErrorMessage = response => {
    const status = document.getElementById("status");

    // Remove "Error: " from error message
    response = response.split(" ");
    response.shift();
    response = response.join(" ");

    // Display error message
    status.textContent = response;
}

export default displayErrorMessage;