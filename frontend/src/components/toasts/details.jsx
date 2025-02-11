const DetailedToast = ({ title = 'Dashboard', message, loading }) => (
    <div className="p-0 m-0">
        <span className="fs-6 text-uppercase fw-bold p-0 m-0" >{title}</span>
        <p className="p-0 m-0" style={{
            fontSize: '1rem',
        }}>
            {message || 'No message.'}
        </p>
    </div>
);


export default DetailedToast;