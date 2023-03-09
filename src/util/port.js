require("dotenv").config();
const detect = require("detect-port");

const clientPort = process.env.PORT;
const serverPort = process.env.REACT_APP_BACKEND_PORT;

const getServerPort = async() => {
    try {
        const port = await detect(Number(serverPort));

        if (Number(serverPort) === port) {
            console.log(`Server listening on port ${serverPort}.`);
            return Number(serverPort);
        }

        console.log(`Failed to start the server on port ${serverPort}.\nStarting the server on port ${port}.\nPlease update REACT_APP_BACKEND_PORT environment variable and "apiUrl" in cypress.json to ${port}.`);
        return port;
    } catch (err) {
        console.log(err);
    }
};

module.exports = { clientPort, serverPort, getServerPort };