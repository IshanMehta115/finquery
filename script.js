const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const uploadBtn = document.getElementById("upload-btn");

const protocol = "https";
const hostname = "api.lockchatapp.com";
const port = "443";
// const protocol = "http";
// const hostname = "localhost";
// const port = "5000";
const queryPath = "finquery/api/query";

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

window.onload = () => {
    addMessage("Hello! I'm FinQuery, a RAG-powered finance knowledge bot. Ask me anything, I combine retrieval and reasoning to answer your finance questions.", "bot");
}


function setLastBotMessage(text){
    let botMessageSize = document.querySelectorAll(".bot-message").length;

    console.log(document.querySelectorAll(".bot-message"));
    console.log(botMessageSize);
    document.querySelectorAll(".bot-message")[botMessageSize-1].textContent = text;
}

async function sendTextMessage(text){
    addMessage(text, "user");
    userInput.value = "";

    addMessage("Thinking...", "bot");
    try {
        let url = "{protocol}://{hostname}:{port}/{path}"
        url = url.replace("{protocol}", protocol);
        url = url.replace("{hostname}", hostname);
        url = url.replace("{port}", port);
        url = url.replace("{path}", queryPath);

        console.log("url = " + url)
        
        const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text })
    });
    const data = await res.json();
    setLastBotMessage(data?.data.result || "Result unavailable.");
    } catch (err) {
        setLastBotMessage("Error reaching the server.");
    }
}

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        
        const text = userInput.value.trim();
        if (!text) return;
        sendTextMessage(text);
    }
});

sendBtn.addEventListener("click", async () => {
  const text = userInput.value.trim();
  if (!text) return;
  sendTextMessage(text);
});
