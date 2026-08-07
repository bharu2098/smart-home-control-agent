import { useEffect, useMemo, useRef } from "react";
import ChatMessage from "./ChatMessage";

function ChatBox({

    messages,
    loading,
    search,
    currentMatch,
    matchedIndexes,
    setMatchedIndexes,
    onDelete,

}){

    const chatRef = useRef(null);
    const messageRefs = useRef([]);

    // Scroll to bottom while chatting
    useEffect(() => {

        if (search.trim()) {

            return;

        }

        if (chatRef.current) {

            chatRef.current.scrollTo({

                top: chatRef.current.scrollHeight,

                behavior: "smooth",

            });

        }

    }, [messages, search]);

    // Find all search matches
    const indexes = useMemo(() => {

        if (!search.trim()) {

            return [];

        }

        return messages.reduce((result, message, index) => {

            if (

                message.text
                    .toLowerCase()
                    .includes(search.toLowerCase())

            ) {

                result.push(index);

            }

            return result;

        }, []);

    }, [messages, search]);

    // Send matches back to AIChat
    useEffect(() => {

        setMatchedIndexes(indexes);

    }, [indexes, setMatchedIndexes]);

    // Scroll to active match
    useEffect(() => {

        if (!indexes.length) {

            return;

        }

        const targetIndex = indexes[currentMatch];

        if (

            targetIndex === undefined ||

            !messageRefs.current[targetIndex]

        ) {

            return;

        }

        setTimeout(() => {

            messageRefs.current[targetIndex].scrollIntoView({

                behavior: "smooth",

                block: "center",

            });

        }, 80);

    }, [indexes, currentMatch]);

    return (

        <div

            className="chat-messages"

            ref={chatRef}

        >

            {

                messages.length === 0 && (

                    <div className="chat-empty">

                        <div className="chat-empty-icon">

                            🤖

                        </div>

                        <h2>

                            Welcome!

                        </h2>

                        <p>

                            I can help you control your smart home devices,
                            manage automations,
                            and answer questions.

                        </p>

                    </div>

                )

            }

            {

                messages.map((message, index) => (

                    <div

                        key={index}

                        ref={(element) => {

                            messageRefs.current[index] = element;

                        }}

                    >

                        <ChatMessage

    message={message}

    search={search}

    active={
        indexes[currentMatch] === index
    }

    onDelete={() => onDelete(index)}

/>

                    </div>

                ))

            }

        </div>

    );

}

export default ChatBox;