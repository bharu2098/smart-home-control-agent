function ClearChatModal({

    open,

    onCancel,

    onConfirm,

}) {

    if (!open) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="clear-chat-modal">

                <div className="modal-icon">

                    🗑️

                </div>

                <h2>

                    Clear Chat

                </h2>

                <p>

                    Are you sure you want to delete the entire conversation?

                </p>

                <div className="modal-buttons">

                    <button

                        className="cancel-btn"

                        onClick={onCancel}

                    >

                        Cancel

                    </button>

                    <button

                        className="delete-btn"

                        onClick={onConfirm}

                    >

                        Clear Chat

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ClearChatModal;