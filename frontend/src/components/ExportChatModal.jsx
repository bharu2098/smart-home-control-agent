function ExportChatModal({

    open,

    onClose,

    onPDF,

    onTXT,

}) {

    if (!open) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="export-modal">

                <div className="export-icon">

                    📄

                </div>

                <h2>

                    Export Chat

                </h2>

                <p>

                    Choose how you want to export your conversation.

                </p>

                <div className="export-buttons">

                    <button

                        className="pdf-btn"

                        onClick={onPDF}

                    >

                        📄 Export PDF

                    </button>

                    <button

                        className="txt-btn"

                        onClick={onTXT}

                    >

                        📃 Export TXT

                    </button>

                </div>

                <button

                    className="cancel-export-btn"

                    onClick={onClose}

                >

                    Cancel

                </button>

            </div>

        </div>

    );

}

export default ExportChatModal;