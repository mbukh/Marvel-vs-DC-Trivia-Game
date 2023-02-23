import "../style/Spinner.css";

const Spinner = () => {
    // https://codepen.io/lufutu/pen/qgrRaP
    return (
        <div className="loader-wrapper">
            <div className="loader-container">
                <div className="loader book">
                    <figure className="page"></figure>
                    <figure className="page"></figure>
                    <figure className="page"></figure>
                </div>
                <h4>Loading</h4>
            </div>
        </div>
    );
};

export default Spinner;
