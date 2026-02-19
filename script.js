const chatContainer = document.querySelector(".chat-container");
const inputField = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-btn");
const imageInput = document.getElementById("imageInput");

function addMessage(content, sender, isImage = false) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (isImage) {
    msg.innerHTML = `<img src="${content}" class="chat-image"/>`;
  } else {
    msg.innerHTML = marked.parse(content);
  }

  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = inputField.value.trim();
  const imageFile = imageInput.files[0];

  if (!message && !imageFile) return;

  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = async function () {
      const base64Image = reader.result;
      addMessage(base64Image, "user", true);
      await callAPI(message || "Explain this image clearly.", base64Image);
    };
    reader.readAsDataURL(imageFile);
    imageInput.value = "";
    inputField.value = "";
    return;
  }

  addMessage(message, "user");
  inputField.value = "";
  await callAPI(message, null);
}

async function callAPI(message, image) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, image })
    });

    const data = await response.json();

    if (data.error) {
      addMessage("⚠️ " + data.error, "bot");
    } else {
      addMessage(data.response, "bot");
    }

  } catch (error) {
    addMessage("⚠️ Server error.", "bot");
  }
}

sendButton.addEventListener("click", sendMessage);

inputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
