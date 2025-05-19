// utils/terminalUtils.js

export function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

export function showSkipNotice() {
  const skipNotice = document.createElement("div");
  skipNotice.style.position = "absolute";
  skipNotice.style.bottom = "10px";
  skipNotice.style.right = "20px";
  skipNotice.style.color = "lime";
  skipNotice.style.fontFamily = "monospace";
  skipNotice.textContent = "[Enter/Click to SKIP]";
  document.body.appendChild(skipNotice);
  return skipNotice;
}

export function removeSkipNotice(skipNotice) {
  if (skipNotice) skipNotice.remove();
}

export function createInputLine(callback, terminal) {
  const inputWrapper = document.createElement("div");
  inputWrapper.classList.add("input-wrapper");

  const prompt = document.createElement("span");
  prompt.textContent = "> ";
  prompt.style.color = "lime";

  const inputSpan = document.createElement("span");
  inputSpan.contentEditable = true;
  inputSpan.setAttribute("role", "textbox");
  inputSpan.setAttribute("aria-label", "Terminal input");
  inputSpan.classList.add("terminal-input");
  inputSpan.spellcheck = false;

  const cursor = document.createElement("span");
  cursor.classList.add("blinking-cursor");
  cursor.textContent = "█";

  inputWrapper.appendChild(prompt);
  inputWrapper.appendChild(inputSpan);
  inputWrapper.appendChild(cursor);
  terminal.appendChild(inputWrapper);
  scrollToBottom(terminal);
  inputSpan.focus();

  const updateCursor = () => {
    cursor.style.left = `${inputSpan.offsetLeft + inputSpan.offsetWidth}px`;
    cursor.style.top = `${inputSpan.offsetTop}px`;
    cursor.style.position = "absolute";
  };

  inputSpan.addEventListener("input", updateCursor);
  inputSpan.addEventListener("click", updateCursor);
  setInterval(updateCursor, 100);

  inputSpan.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = inputSpan.textContent.trim().toLowerCase();
      inputSpan.contentEditable = false;
      cursor.remove();
      callback(value);
    }
  });
}
