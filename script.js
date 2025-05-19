import {
  scrollToBottom,
  showSkipNotice,
  removeSkipNotice,
  createInputLine,
} from "./utils/terminalUtils.js";

const terminal = document.getElementById("terminal");

const lines = [
  "Booting Code Syndicate Terminal...",
  "Loading assets...",
  "Initializing subsystems...",
  "Authenticating users...",
  "Setup successful...",
  "",
  "Welcome to Code Syndicate Terminal.",
  "",
  "Would you like to learn more about Code Syndicate? (y/n)",
  ""
];

let lineIndex = 0;
let charIndex = 0;
let currentLine = "";
let isWaitingForInput = false;
let skipTyping = false;
let typingInProgress = true;
let skipNotice;

function appendLine(text) {
  terminal.innerHTML += text + "\n";
  scrollToBottom(terminal);
}

function showSpinnerLine(text, duration, onComplete) {
  const loadingLine = document.createElement("div");
  loadingLine.style.color = "lime";
  loadingLine.textContent = text;
  terminal.appendChild(loadingLine);

  const spinner = document.createElement("span");
  loadingLine.appendChild(spinner);

  const spinnerChars = ["/", "-", "\\", "|"];
  let i = 0;

  const interval = setInterval(() => {
    spinner.textContent = spinnerChars[i++ % spinnerChars.length];
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    onComplete();
  }, duration);
}

function typeLine() {
  if (lineIndex >= lines.length) {
    typingInProgress = false;
    removeSkipNotice(skipNotice);
    if (!isWaitingForInput) createInputLine(handleInput, terminal);
    return;
  }

  currentLine = lines[lineIndex];

  if (skipTyping) {
    appendLine(currentLine);
    lineIndex++;
    charIndex = 0;

    if (lineIndex === lines.length) {
      typingInProgress = false;
      removeSkipNotice(skipNotice);
      if (!isWaitingForInput) createInputLine(handleInput, terminal);
    } else {
      setTimeout(typeLine, 10);
    }

    return;
  }

  if (charIndex <= currentLine.length) {
    terminal.innerHTML += currentLine.charAt(charIndex);
    charIndex++;
    scrollToBottom(terminal);
    setTimeout(typeLine, 40);
  } else {
    appendLine("");
    lineIndex++;
    charIndex = 0;

    if (lineIndex === lines.length) {
      typingInProgress = false;
      removeSkipNotice(skipNotice);
      if (!isWaitingForInput) createInputLine(handleInput, terminal);
    } else {
      setTimeout(typeLine, 200);
    }
  }
}

function handleInput(value) {
  if (value === "y") {
    appendLine("");
    appendLine("Loading About Section...");
    scrollToBottom(terminal);

    showSpinnerLine("loading ", 3000, () => {
      window.location.href = "./about";
    });
  } else if (value === "n") {
    appendLine("");
    appendLine("Exited Code Syndicate Terminal successfully.");
  } else {
    appendLine("");
    appendLine("Invalid input. Please refresh and enter 'y' or 'n'.");
  }
}

// Boot
skipNotice = showSkipNotice();
typeLine();

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && typingInProgress) {
    skipTyping = true;
  }
});

document.addEventListener("touchstart", () => {
  if (typingInProgress) {
    skipTyping = true;
  }
});
