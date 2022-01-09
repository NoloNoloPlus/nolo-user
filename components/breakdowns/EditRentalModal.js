import CreateRental from "./CreateRental";


export default function EditRentalModal({ isOpen, setIsOpen, rentalId, productId, productInfo, onRent }) {
    const modalOnRent = (quote) => {
        setIsOpen(false);
        onRent(quote);
    }
    return (
        <div className={"modal " + (isOpen ? ' is-active' : '')}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Edit Rental</p>
                    <button className="delete" aria-label="close" onClick={() => setIsOpen(false)}></button>
                </header>
                <section className="modal-card-body">
                    <CreateRental rentalId={rentalId} productId={productId} productInfo={productInfo} onRent={modalOnRent} rentLabel="Edit Rental" />
                </section>
            </div>
        </div>
    )
}