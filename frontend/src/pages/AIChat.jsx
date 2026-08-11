import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import QuickActions from "../components/QuickActions";
import ClearChatModal from "../components/ClearChatModal";
import ExportChatModal from "../components/ExportChatModal";
import { sendMessage } from "../api/ai";
import { useAuth } from "../context/AuthContext";
function AIChat() {
    const { user } = useAuth();

const chatKey =
    user
        ? `smart-home-chat-${user.id}`
        : "smart-home-chat";

    const [messages, setMessages] =
        useState(() => {

            const savedChat =
    localStorage.getItem(chatKey);

            if (savedChat) {

                return JSON.parse(
                    savedChat
                );

            }

            return [];

        });

    const [loading, setLoading] =
        useState(false);

    const [showClearModal, setShowClearModal] =
        useState(false);
    const [showExportModal, setShowExportModal] =
        useState(false);
    const [search, setSearch] =
          useState("");
   const [currentMatch, setCurrentMatch] =
    useState(0);

const [matchedIndexes, setMatchedIndexes] =
    useState([]);
    useEffect(() => {

        localStorage.setItem(

    chatKey,

    JSON.stringify(messages)

);

    }, [messages]);
   

    async function handleSend(message) {

        if (

            loading ||

            !message.trim()

        ) {

            return;

        }

        const userMessage = {

    sender: "user",

    text: message,

    time: new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit",

    }),

};

        setMessages((previous) => [

            ...previous,

            userMessage,

        ]);

        setLoading(true);

        const startTime =
            Date.now();

        try {

            const response =
                await sendMessage(
                    message
                );

            const elapsed =
                Date.now() -
                startTime;

            const delay =
                Math.max(
                    0,
                    800 - elapsed
                );

           setTimeout(() => {

    setLoading(false);

    const fullText = response.response;

    setMessages((previous) => [

        ...previous,

        {
    sender: "ai",

    text: "",

    time: new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit",

    }),

}

    ]);

    let index = 0;

    const typing = setInterval(() => {

        index++;

        setMessages((previous) => {

            const updated = [...previous];

          updated[updated.length - 1] = {

    sender: "ai",

    text: fullText.slice(0, index),

    time: updated[updated.length - 1].time,

};

            return updated;

        });

        if (index >= fullText.length) {

            clearInterval(typing);

        }

    }, 20);

}, delay);
        }

        catch (error) {

            console.error(error);

            setTimeout(() => {

                setMessages((previous) => [

                    ...previous,

                    {
    sender: "ai",

    text: "❌ Failed to communicate with the AI server.",

    time: new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit",

    }),

}

                ]);

                setLoading(false);

            }, 800);

        }

    }

    function handleQuickAction(action) {

        if (!loading) {

            handleSend(action);

        }

    }

    function openClearModal() {

        setShowClearModal(true);

    }

    function closeClearModal() {

        setShowClearModal(false);

    }

    function confirmClearChat() {

        setMessages([]);

        localStorage.removeItem(
            "smart-home-chat"
        );

        setShowClearModal(false);

    }
    function deleteMessage(index) {

    setMessages((previous) =>

        previous.filter((_, i) => i !== index)

    );

}
    function exportAsTXT() {

    if (messages.length === 0) {

        return;

    }

    let content =
        "SMART HOME AI CHAT\n";

    content +=
        "===================================\n\n";

    messages.forEach((message) => {

        content +=
            `${message.sender.toUpperCase()}\n`;

        content +=
            `${message.text}\n\n`;

        content +=
            "--------------------------------------\n\n";

    });

    const blob = new Blob(

        [content],

        {

            type: "text/plain",

        }

    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        `smart-home-chat-${Date.now()}.txt`;

    link.click();

    URL.revokeObjectURL(url);

}


function exportAsPDF() {

    if (messages.length === 0) {

        return;

    }

    const pdf =
        new jsPDF();

    pdf.setFontSize(18);

    pdf.text(

        "Smart Home AI Chat",

        20,

        20

    );

    let y = 35;

    pdf.setFontSize(11);

    messages.forEach((message) => {

        pdf.setFont(

            "helvetica",

            "bold"

        );

        pdf.text(

            message.sender === "user"

                ? "USER"

                : "AI",

            20,

            y

        );

        y += 8;

        pdf.setFont(

            "helvetica",

            "normal"

        );

        const lines =
            pdf.splitTextToSize(

                message.text,

                170

            );

        pdf.text(

            lines,

            20,

            y

        );

        y +=
            lines.length * 7 + 10;

        if (y > 270) {

            pdf.addPage();

            y = 20;

        }

    });

    pdf.save(

        `smart-home-chat-${Date.now()}.pdf`

    );
}
function openExportModal() {

    setShowExportModal(true);

}

function closeExportModal() {

    setShowExportModal(false);

}

    return (

        <div className="chat-page">

            <div className="chat-header">

                <div className="chat-title">

                    <div>

                        <h2>

                            Smart Home AI Assistant

                        </h2>

                        <p>

                            Ask me anything about your smart home.

                        </p>

                    </div>
                  <div className="chat-search">

    <input

        type="text"

        placeholder="🔍 Search conversation..."

        value={search}

        onChange={(e) =>

            setSearch(e.target.value)

        }

        onKeyDown={(e) => {

    if (e.key === "Escape") {

        setSearch("");
        setCurrentMatch(0);

        return;

    }

    if (

        e.key === "Enter" &&

        matchedIndexes.length > 0

    ) {

        e.preventDefault();

        if (e.shiftKey) {

            setCurrentMatch((previous) =>

                previous === 0

                    ? matchedIndexes.length - 1

                    : previous - 1

            );

        }

        else {

            setCurrentMatch((previous) =>

                previous + 1 >= matchedIndexes.length

                    ? 0

                    : previous + 1

            );

        }

    }

}}
/>
</div>
                    <div className="chat-actions">

                        <button

                            className="export-chat-btn"

                            onClick={openExportModal}

                            disabled={messages.length === 0}

                        >

                            📄 Export Chat

                        </button>

                        <button

                            className="clear-chat-btn"

                            onClick={openClearModal}

                            disabled={messages.length === 0}

                        >

                            🗑 Clear Chat

                        </button>

                    </div>

                </div>

            </div>

            <div className="chat-container">
<ChatBox
    messages={messages}
    loading={loading}
    search={search}
    currentMatch={currentMatch}
    matchedIndexes={matchedIndexes}
    setMatchedIndexes={setMatchedIndexes}
    onDelete={deleteMessage}
/>

                <QuickActions

                    onSelect={handleQuickAction}

                    loading={loading}

                />

                <ChatInput

                    onSend={handleSend}

                    loading={loading}

                />

            </div>

            <ClearChatModal

                open={showClearModal}

                onCancel={closeClearModal}

                onConfirm={confirmClearChat}

            />

            <ExportChatModal

                open={showExportModal}

                onClose={closeExportModal}

                onPDF={() => {

                    exportAsPDF();

                    closeExportModal();

                }}

                onTXT={() => {

                    exportAsTXT();

                    closeExportModal();

                }}

            />

        </div>

    );
}


export default AIChat;