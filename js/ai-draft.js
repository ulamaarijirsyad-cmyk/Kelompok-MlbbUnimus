import { askAI } from "./draft-ai.js";

// ==============================
// ELEMENT
// ==============================

const input = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

const messages = document.getElementById("messages");
const welcome = document.getElementById("welcomeScreen");

const newChatBtn = document.getElementById("newChatBtn");
const recentChats = document.getElementById("recentChats");

// ==============================
// DATA
// ==============================

let firstMessage = true;
let conversations = [];

let currentConversation = null;

// ==============================
// SEND MESSAGE
// ==============================

async function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    // Hilangkan welcome
    if (firstMessage) {

        welcome.style.display = "none";

        addRecent(text);

        firstMessage = false;

    }

    // Bubble User
    addUserMessage(text);

input.value="";

scrollBottom();

const chat = conversations.find(c => c.id === currentConversation);

if(chat){

    chat.messages.push({

        role:"user",

        content:text

    });

}

const reply = await askAI(text);

addAIMessage(reply);

if(chat){

    chat.messages.push({

        role:"assistant",

        content:reply

    });

}

scrollBottom();

}

// ==============================
// USER MESSAGE
// ==============================

function addUserMessage(text) {

    messages.innerHTML += `

        <div class="message user">

            <div class="bubble">

                ${text}

            </div>

        </div>

    `;

}

// ==============================
// AI MESSAGE
// ==============================

function addAIMessage(text) {

    messages.innerHTML += `

        <div class="message ai">

            <div class="bubble">

                ${marked.parse(text)}

            </div>

        </div>

    `;

}

// ==============================
// RECENT CHAT
// ==============================

function addRecent(title){

    if(recentChats.querySelector(".empty-chat")){

        recentChats.innerHTML="";

    }

    const id = Date.now();

    conversations.unshift({

        id:id,

        title:title,

        messages:[]

    });

    currentConversation=id;

    renderRecentChats();

}

function renderRecentChats(){

    recentChats.innerHTML="";

    conversations.forEach(chat=>{

        const item=document.createElement("div");

        item.className="recent-item";

        item.innerText=chat.title;

        item.onclick=()=>{

            openConversation(chat.id);

        };

        recentChats.appendChild(item);

    });

}

function openConversation(id){

    const chat=conversations.find(c=>c.id===id);

    if(!chat) return;

    currentConversation=id;

    welcome.style.display="none";

    messages.innerHTML="";

    chat.messages.forEach(msg=>{

        if(msg.role==="user"){

            addUserMessage(msg.content);

        }

        else{

            addAIMessage(msg.content);

        }

    });

}

// ==============================
// NEW CHAT
// ==============================

function newChat(){

    messages.innerHTML = "";

    input.value = "";

    welcome.style.display = "block";

    firstMessage = true;

    currentConversation = null;

}

// ==============================
// SCROLL
// ==============================

function scrollBottom(){

    messages.scrollIntoView(false);

    window.requestAnimationFrame(()=>{

        messages.parentElement.scrollTop =
        messages.parentElement.scrollHeight;

    });

}

// ==============================
// EVENT
// ==============================

sendBtn.addEventListener("click",sendMessage);

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});

newChatBtn.addEventListener("click",newChat);