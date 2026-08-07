import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({
    onSend,
    loading,
}) {

    const [message, setMessage] = useState("");

    const textareaRef = useRef(null);

    useEffect(() => {

        if (textareaRef.current) {

            textareaRef.current.style.height = "auto";

            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";

        }

    }, [message]);

    function handleSubmit(e) {

        e.preventDefault();

        if (!message.trim()) {

            return;

        }

        onSend(message);

        setMessage("");

        if (textareaRef.current) {

            textareaRef.current.style.height = "auto";

        }

    }

    function handleKeyDown(e) {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            handleSubmit(e);

        }

    }

    return (

        <form
            className="chat-input"
            onSubmit={handleSubmit}
        >

            <textarea

                ref={textareaRef}

                placeholder="Ask your Smart Home AI..."

                value={message}

                onChange={(e) =>
                    setMessage(e.target.value)
                }

                onKeyDown={handleKeyDown}

                rows={1}

                disabled={loading}

            />

            <button

                type="submit"

                disabled={
                    loading ||
                    !message.trim()
                }

            >

                <FaPaperPlane />

            </button>

        </form>

    );

}

export default ChatInput;