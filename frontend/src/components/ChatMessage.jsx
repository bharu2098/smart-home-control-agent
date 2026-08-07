import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
    oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

function highlight(
    text,
    search,
    active
) {

    if (
        !search ||
        search.trim() === ""
    ) {

        return text;

    }

    const escapedSearch =
        search.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const regex =
        new RegExp(
            `(${escapedSearch})`,
            "gi"
        );

    return text
        .split(regex)
        .map((part, index) => {

            if (

                part.toLowerCase() ===
                search.toLowerCase()

            ) {

                return (

                    <mark

                        key={index}

                        className={
                            active
                                ? "search-highlight-active"
                                : "search-highlight"
                        }

                    >

                        {part}

                    </mark>

                );

            }

            return (

                <span key={index}>

                    {part}

                </span>

            );

        });

}

function ChatMessage({

    message,
    search,
    active,
    onDelete,

}) {

    const isUser =
        message.sender === "user";

    function copyMessage() {

        navigator.clipboard.writeText(
            message.text
        );

    }

    function deleteCurrentMessage() {

        if (

            window.confirm(
                "Delete this message?"
            )

        ) {

            onDelete();

        }

    }

    return (

        <div

            className={`message ${
                isUser
                    ? "user-message"
                    : "ai-message"
            }`}

        >

            {

                !isUser && (

                    <div className="avatar ai-avatar">

                        🤖

                    </div>

                )

            }

            <div className="message-wrapper">

                <button

                    className="delete-message-btn"

                    onClick={
                        deleteCurrentMessage
                    }

                    title="Delete Message"

                >

                    🗑️

                </button>
                                <div className="message-content">

                    {

                        isUser ? (

                            highlight(

                                message.text,

                                search,

                                active

                            )

                        ) : (

                            <ReactMarkdown

                                remarkPlugins={[remarkGfm]}

                                components={{


                                    code({

                                        inline,

                                        className,

                                        children,

                                        ...props

                                    }) {

                                        const match =

                                            /language-(\w+)/.exec(

                                                className || ""

                                            );

                                        return !inline &&

                                            match ? (

                                            <SyntaxHighlighter

                                                style={oneDark}

                                                language={match[1]}

                                                PreTag="div"

                                                {...props}

                                            >

                                                {String(children).replace(

                                                    /\n$/,

                                                    ""

                                                )}

                                            </SyntaxHighlighter>

                                        ) : (

                                            <code

                                                className={className}

                                                {...props}

                                            >

                                                {children}

                                            </code>

                                        );

                                    },

                                }}

                            >

                                {message.text}

                            </ReactMarkdown>

                        )

                    }

                </div>
                                {

                    !isUser && (

                        <div className="message-footer">

                            <button

                                className="copy-btn"

                                onClick={copyMessage}

                            >

                                📋 Copy

                            </button>

                            <span className="message-time">

                                {message.time}

                            </span>

                        </div>

                    )

                }

                {

                    isUser && (

                        <div className="message-time">

                            {message.time}

                        </div>

                    )

                }

            </div>

            {

                isUser && (

                    <div className="avatar user-avatar">

                        👤

                    </div>

                )

            }

        </div>

    );

}

export default ChatMessage;