const Order = props => {
    const { id, createdAt, status } = props;
    
    return (
        <>
            <p>{id}</p>
            <p>{createdAt}</p>
            <p>{status}</p>
        </>
    );
}

export default Order;