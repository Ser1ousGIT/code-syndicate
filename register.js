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

const registrationData = {
  name: "",
  enrollment: "",
  section: "",
  department: "",
  course: "",
  specialization: "",
  interests: "",
  skills: "",
  year: "",
  semester: "",
  email: "",
  phone: ""
};

const fields = [
  {
    key: "name",
    prompt: 'Enter your name like: --name="YOUR_NAME"',
    pattern: /^--name="(.+)"$/,
    error: "Use format: --name=\"Your Name\""
  },
  {
    key: "enrollment",
    prompt: 'Enter enrollment number: --en="UU10101..."',
    pattern: /^--en="([\w\d]+)"$/,
    error: "Use format: --en=\"Your Enrollment Number\""
  },
  {
    key: "section",
    prompt: 'Enter your section: --sec="A"',
    pattern: /^--sec="(.+)"$/,
    error: "Use format: --sec=\"A/B/C...\""
  },
  {
    key: "department",
    prompt: 'Enter department: --dept="CSE"',
    pattern: /^--dept="(.+)"$/,
    error: "Use format: --dept=\"Department Name\""
  },
  {
    key: "course",
    prompt: 'Enter course: --course="B.Tech"',
    pattern: /^--course="(.+)"$/,
    error: "Use format: --course=\"B.Tech/M.Tech/etc\""
  },
  {
    key: "specialization",
    prompt: 'Enter specialization: --spec="AI & ML"',
    pattern: /^--spec="(.+)"$/,
    error: "Use format: --spec=\"Your Specialization\""
  },
  {
    key: "interests",
    prompt: 'Enter interests: --intrst="AI, Web, Robotics" (Max 200 chars)',
    pattern: /^--intrst="(.+)"$/,
    error: "Use format: --intrst=\"Your interests\"",
    validator: (val) => val.length <= 200
  },
  {
    key: "skills",
    prompt: 'Enter skill level: --skill="beginner" (new, beginner, seasoned, professional)',
    pattern: /^--skill="(new|beginner|seasoned|professional)"$/,
    error: "Choose from: new, beginner, seasoned, professional"
  },
  {
    key: "year",
    prompt: 'Enter year: --yr="2"',
    pattern: /^--yr="([1-5])"$/,
    error: "Year should be 1–5"
  },
  {
    key: "semester",
    prompt: 'Enter semester: --sem="3"',
    pattern: /^--sem="([1-8])"$/,
    error: "Semester should be 1–8"
  },
  {
    key: "email",
    prompt: 'Enter your email: --email="your@email.com"',
    pattern: /^--email="[^@"]+@[^@"]+\.[a-z]{2,}"$/,
    error: 'Please enter a valid email using --email="example@domain.com"'
  },
  {
    key: "phone",
    prompt: 'Enter enrollment number: --phone="9832939492"',
    pattern: /^--phone="([\w\d]+)"$/,
    error: "Use format: --phone=\"9876543210\""
  }

];

let currentFieldIndex = 0;

function appendLine(content) {
  terminal.innerHTML += content;
  scrollToBottom(terminal);
}

function print(content) {
  const div = document.createElement("div");
  div.style.color = "lime";
  div.textContent = content;
  terminal.appendChild(div);
  scrollToBottom(terminal);
}

function printHTML(content) {
  const div = document.createElement("div");
  div.style.color = "lime";
  div.innerHTML = content;
  terminal.appendChild(div);
  scrollToBottom(terminal);
}

function typeIntroLines(lines, i = 0) {
  if (i >= lines.length) {
    typingInProgress = false;
    removeSkipNotice(skipNotice);
    askNextField();
    return;
  }

  if (skipTyping) {
    print(lines[i]);
    return typeIntroLines(lines, i + 1);
  }

  let char = 0;
  const line = lines[i];
  const interval = setInterval(() => {
    if (char <= line.length) {
      appendLine(line[char++] || "");
    } else {
      appendLine("<br>");
      clearInterval(interval);
      setTimeout(() => typeIntroLines(lines, i + 1), 100);
    }
  }, 30);
}

function askNextField() {
  if (currentFieldIndex >= fields.length) {
    print("All fields collected. Submitting your data...");
    submitData();
    return;
  }

  const field = fields[currentFieldIndex];
  print(field.prompt);
  createInputLine((value) => handleFieldInput(value, field), terminal);
}

function handleFieldInput(value, field) {
  const match = value.match(field.pattern);
  if (!match || (field.validator && !field.validator(match[1]))) {
    print(field.error);
    createInputLine((v) => handleFieldInput(v, field), terminal);
    return;
  }

  registrationData[field.key] = match[1];
  currentFieldIndex++;
  askNextField();
}

function submitData() {
  const endpoint = "https://script.google.com/macros/s/AKfycbxAZYJ6iUBxErE_IPdBi1jW25h5wbZMRJYuZly06LkZfv8Av5X0FlKrcFEc2WXCAuD2ug/exec";
  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(registrationData)
  })
  .then(() => {
    print("We'll officialize your membership.");
    print("Welcome to the Club.");
    print("");
    print("Would you like to visit the About page? (y/n)");

    createInputLine((value) => {
      if (value.toLowerCase() === "y") {
        print("Redirecting to About page...");
        setTimeout(() => {
          window.location.href = "about.html";
        }, 1500);
      } else {
        print("Good luck, Recruit.");
        print("Code Syndicate Terminal exited successfully.");
      }
    }, terminal);
  })
  .catch(() => {
    print("Submission failed. Please refresh this page.");
  });
}

// INIT
const introLines = [
  "Booting Registration Terminal...",
  "Loading CLI modules...",
  "Initializing command parser...",
  "Ready.",
  "",
  "Welcome to Code Syndicate Registration.",
  "Enter your details in the style of Linux CLI flags.",
  "Example: --name=\"John Doe\"",
  ""
];

skipNotice = showSkipNotice();
typeIntroLines(introLines);

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
