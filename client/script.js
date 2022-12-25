// get current year
var currentYear = new Date().getFullYear();
let year = document.getElementById('year');
year.innerHTML = currentYear;

import bot from './assets/bot.png';
import user from './assets/user.png';

const form  = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent.length === 4) {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let idx = 0;
  let interval = setInterval(() => {
    if(idx < text.length) {
      element.innerHTML += text.charAt(idx);
      idx++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAI, value, uniqueID) {
  return (
    `
      <div class="wrapper ${isAI ? 'ai' : 'user'}">
        <div class="chat">
          <div class="profile">
            <img src="${isAI ? bot : user}" alt="${isAI ? 'BOT' : 'USER'}" />
          </div>
          <div class="message" id="${uniqueID}">${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // User's chat stripe :
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  // Bot's chat stripe :
  const uniqueID = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueID);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID);

  loader(messageDiv);

  // fetch data from the server :
  const response = await fetch('https://hermes-85lq.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    // chech if bot's response contains a particualr string :
    if (parsedData.includes('My name is')) {
      // change the name 'Alex' to 'Hermes' :
      console.log(parsedData);
      const newParsedData = 'My name is Hermes.'
      typeText(messageDiv, newParsedData);
    }
    else
      typeText(messageDiv, parsedData);
  }
  else {
    const err = await response.text();
    typeText(messageDiv, 'Oops, something went wrong !');
    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})
