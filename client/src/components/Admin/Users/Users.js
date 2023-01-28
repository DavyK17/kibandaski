import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import User from "./User";
import RoleSelect from "./RoleSelect";

import { Admin } from "../../../api/Server";

const Users = props => {
    // Destructure props and define server
    const { windowWidth, iconHeight } = props;

    // Define server, useNavigate() and useParams()
    const Server = Admin.users;
    let navigate = useNavigate();
    let params = useParams();

    // STATE + FUNCTIONS
    // Users
    const [users, setUsers] = useState([]);
    const [renderedUsers, setRenderedUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async() => {
        setIsLoading(true);

        try {
            let list = await Server.getUsers();
            if (list) {
                setUsers(list);

                if (params.role) list = list.filter(user => user.role === params.role);
                setRenderedUsers(list);
                setIsLoading(false);
            }
        } catch (err) {
            setError(true);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, []);

    // User role
    const [role, setRole] = useState("all");
    const changeRole = ({ target }) => setRole(target.value);

    useEffect(() => {
        if (params.role) {
            setRole(params.role);
            const roleSelect = document.getElementById("user-role");
            for (let option of roleSelect.options) if (option.value === params.role) option.selected = true;
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (role === "all") return setRenderedUsers(users);
        let list = users.filter(user => user.role === role);
        setRenderedUsers(list);
        // eslint-disable-next-line
    }, [role]);


    // RENDERING
    // User list
    const renderUsers = () => {
        // Return error message if error
        if (error) return <p className="error">An error occurred loading users. Kindly refresh the page and try again.</p>;

        // Return skeleton if loading
        if (isLoading) return <Skeleton />;

        // Get user list
        let list = () => renderedUsers.map(({ id, firstName, lastName, phone, email, role }, i) => {
            // Define function to view user's orders
            const viewOrders = e => {
                e.preventDefault();
                navigate(`/admin/orders/${id}`);
            }

            // Return user item
            return (
                <li key={i}>
                    <User details={{ id, firstName, lastName, phone, email, role }} windowWidth={windowWidth} iconHeight={iconHeight} viewOrders={viewOrders} />
                </li>
            )
        });

        // Return user list
        return (
            <ul>
                {list()}
            </ul>
        )
    }

    // Component
    return (
        <>
            <div className="users">
                <div className="sort">
                    <RoleSelect role={role} handleChange={changeRole} />
                    <p id="status"></p>
                </div>
                {renderUsers()}
            </div>
        </>
    )
}

export default Users;