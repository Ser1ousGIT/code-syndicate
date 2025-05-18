import {
  scrollToBottom,
  showSkipNotice,
  removeSkipNotice,
  createInputLine
} from "./utils/terminalUtils.js";

const terminal = document.getElementById("terminal");

let skipTyping = false;
let typingInProgress = true;
let skipNotice;

const aboutLines = [
  "Accessing About Section...",
  "Fetching data...",
  "Connection successful...",
  "Welcome to Code Syndicate!",
  "",
  "We are a passionate community of tech enthusiasts.",
  "Our mission is to grow together by sharing knowledge.",
  "We are learners just like you, a little more experienced.",
  "",
  "What we offer?",
  "📌 Periodic meetups and coding challenges.",
  "📌 Making your college life less monotonous.",
  "📌 Practical coding sessions.",
  "📌 Replacing bookish knowledge with practicality.",
  "",
  "Whether you're a beginner or a pro — you belong here.",
  "We can learn from you as well.",
  "",
  "About file executed succesfully...",
  "Closing file...",
  "Thank you for exploring Code Syndicate. Stay curious.",
  ""
];

const linuxCommands = [
  { cmd: "ls -la", desc: "Lists all files including hidden ones with detailed info." },
  { cmd: "cd /home", desc: "Changes the current directory to /home." },
  { cmd: "mkdir code_syndicate", desc: "Creates a directory named 'code_syndicate'." },
  { cmd: "sudo apt update", desc: "Updates the package index on Debian-based systems." },
  { cmd: "touch main.cpp", desc: "Creates an empty file named 'main.cpp'." },
  { cmd: "chmod +x script.sh", desc: "Makes 'script.sh' executable." }
];

let lineIndex = 0;
let charIndex = 0;
let currentLine = "";

function appendAndScroll(content) {
  terminal.innerHTML += content;
  scrollToBottom(terminal);
}

function createAndAppend(content, isHTML = false) {
  const div = document.createElement("div");
  div.style.color = "lime";

  if (isHTML) {
    div.innerHTML = content; // this is safe because it's only used on pre-set command + desc
  } else {
    div.textContent = content;
  }

  terminal.appendChild(div);
  scrollToBottom(terminal);
}


function typeLine() {
  if (lineIndex >= aboutLines.length) {
    typingInProgress = false;
    removeSkipNotice(skipNotice);
    askToRegister();
    return;
  }

  currentLine = aboutLines[lineIndex];

  if (skipTyping) {
    appendAndScroll(currentLine + "<br>");
    lineIndex++;
    charIndex = 0;
    if (lineIndex === aboutLines.length) {
      typingInProgress = false;
      removeSkipNotice(skipNotice);
      askToRegister();
    } else {
      setTimeout(typeLine, 20);
    }
    return;
  }

  if (charIndex <= currentLine.length) {
    appendAndScroll(currentLine.charAt(charIndex));
    charIndex++;
    setTimeout(typeLine, 30);
  } else {
    appendAndScroll("<br>");
    lineIndex++;
    charIndex = 0;
    setTimeout(typeLine, 200);
  }
}

function askToRegister() {
  const line = "Would you like to register for Code Syndicate? (y/n)";
  let i = 0;

  const registerPrompt = document.createElement("div");
  registerPrompt.style.color = "lime";
  terminal.appendChild(registerPrompt);

  function typeChar() {
    if (i < line.length) {
      registerPrompt.textContent += line.charAt(i++);
      scrollToBottom(terminal);
      setTimeout(typeChar, 30);
    } else {
      createInputLine(handleRegisterAnswer, terminal);
    }
  }

  typeChar();
}

function handleRegisterAnswer(value) {
  if (value === "y") {
    createAndAppend("Redirecting to registration...");
    const spinner = document.createElement("div");
    spinner.style.color = "lime";
    spinner.textContent = "Loading registration... ";
    terminal.appendChild(spinner);
    scrollToBottom(terminal);

    const spinChars = ["|", "/", "-", "\\"];
    let i = 0;
    const interval = setInterval(() => {
      spinner.textContent = "Loading registration... " + spinChars[i++ % spinChars.length];
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      window.location.href = "register.html";
    }, 3000);
  } else if (value === "n") {
    createAndAppend("Learn a command line before you leave:");
    showLinuxCommandChallenge();
  } else {
    createAndAppend("Invalid input. Please enter y or n.");
    createInputLine(handleRegisterAnswer, terminal);
  }
}

function showLinuxCommandChallenge() {
  const { cmd, desc } = linuxCommands[Math.floor(Math.random() * linuxCommands.length)];
  const html = `Your command: <strong>${cmd}</strong><br>${desc}<br>Type this command to exit:`;
  createAndAppend(html, true);

  createInputLine((input) => {
    if (input === cmd) {
      createAndAppend("Good luck... Terminal exited successfully.");
    } else {
      createAndAppend("Incorrect command. Try again:");
      showLinuxCommandChallenge();
    }
  }, terminal);
}

// INIT
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
