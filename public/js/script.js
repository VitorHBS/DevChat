const socket = io();

const messages = document.getElementById('messages')
const form = document.getElementById('form');
const input = document.getElementById('input');
const usernameInput = document.getElementById('usernameInput')
const usernameButton = document.getElementById('usernameButton')
const usernamePage = document.querySelector('.username_page');
const chatContainer = document.querySelector('.chat_container')

let username = '';

usernameButton.addEventListener('click', () => {
    if (usernameInput.value) {
        username = usernameInput.value.trim()
        usernameInput.value = ''
    }
    chatContainer.classList.remove('off')
    usernamePage.classList.add('off');
})


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    };
});

socket.on('chat message', function (msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})