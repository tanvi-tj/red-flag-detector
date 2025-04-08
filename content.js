const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/" +
    "models/meta-llama/Llama-2-7b-chat-hf";
const HUGGINGFACE_API_KEY = "YOUR_HUGGINGFACE_API_KEY_HERE";  // Replace this

async function askLlamaIfRedFlag(text) {
  const prompt = `You are a red flag detector for dating messages. 
  Only respond with true or false.\n\nMessage: "${text}"`;

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt
      })
    });

    const result = await response.json();
    const rawText = result?.[0]?.generated_text?.toLowerCase();

    return rawText.includes("true");
  } catch (error) {
    console.error("LLaMA API error:", error);
    return false;
  }
}

function flagMessageElement(el) {
  el.style.border = "2px solid red";
  el.style.borderRadius = "8px";
  el.style.padding = "4px";

  if (!el.innerHTML.includes("🚩")) {
    const flag = document.createElement("span");
    flag.innerText = " 🚩";
    el.appendChild(flag);
  }
}

function scanMessages() {
  const messages = document.querySelectorAll(
      "span.selectable-text");

  messages.forEach((msg) => {
    if (!msg.dataset.checked) {
      msg.dataset.checked = "true";
      const text = msg.innerText.trim();

      // Call LLaMA in background
      askLlamaIfRedFlag(text).then((isRedFlag) => {
        if (isRedFlag) {
          flagMessageElement(msg);
        }
      });
    }
  });
}

setInterval(scanMessages, 3000);
