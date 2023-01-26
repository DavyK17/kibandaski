const UserSearch = props => {
    const { handleSubmit } = props;

    // Define search icon
    const Search = (
        <svg className="iconOrdersUserSearch" width="0.8rem" height="0.8rem" viewBox="0 0 24 24">
            <path className="pathOrdersUserSearch" style={{ fill:"#ffffff" }} d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z"/>
        </svg>
    )

    // Return component
    return (
        <form className="user-search" onSubmit={handleSubmit} autoComplete="off" data-testid="user-search">
            <label className="sr-only" htmlFor="search">User ID</label>
            <input type="text" id="search" placeholder="User ID" />
            <button type="submit">{Search}</button>
        </form>
    );
}

export default UserSearch;