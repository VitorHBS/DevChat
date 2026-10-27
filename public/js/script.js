// Abre a conexão em tempo real com o servidor Socket.IO.
const socket = io();

// Referências aos elementos que o cliente atualiza durante a conversa.
const messages = document.getElementById('messages')
const form = document.getElementById('form');
const input = document.getElementById('input');
const usernameInput = document.getElementById('usernameInput')
const usernameButton = document.getElementById('usernameButton')
const usernamePage = document.querySelector('.username_page');
const chatContainer = document.querySelector('.chat_container')

// Estado temporário deste navegador; ainda não representa uma conta autenticada.
let username = '';
// Lista recebida do servidor. Pode ser usada depois para mostrar quem está online.
let userList = [];
// Evita enviar vários pedidos de entrada antes de o servidor responder.
let joinPending = false;

// Valida o apelido e pede ao servidor para associá-lo a esta conexão.
function requestJoin() {
    const name = usernameInput.value.trim();
    if (!name || joinPending) {
        usernameInput.focus();
        return;
    }

    username = name;
    joinPending = true;
    document.title = 'Chat (' + username + ')';
    socket.emit('join-request', username);
}

usernameButton.addEventListener('click', requestJoin);

// Mantém o mesmo fluxo de entrada quando a pessoa pressiona Enter no campo.
usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        requestJoin();
    }
});

// Só troca para o chat depois que o servidor confirma o pedido de entrada.
socket.on('user-ok', () => {
    joinPending = false;
    usernamePage.classList.add('off');
    chatContainer.classList.remove('off')

    document.getElementById('profileName').textContent = username;
    document.getElementById('profileAvatar').textContent = username.charAt(0).toUpperCase();
    console.log('Conectado')
})

// Envia o texto ao servidor; a conexão informa ao servidor quem está enviando.
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    };
});


// O servidor envia aqui as mensagens dos outros clientes; falta montar e
// adicionar o elemento da mensagem para que elas apareçam na página.
socket.on('show-msg', (data) => {
    const msg = document.createElement('li');
    msg.textContent = `${data.username}: ${data.msg}`;

    messages.appendChild(msg);
    window.scrollTo(0, document.body.scrollHeight);
})

socket.on('own-msg', (data) => {
    const userMsg = document.createElement('li');
    userMsg.textContent = data.msg;

    messages.appendChild(userMsg);
    window.scrollTo(0, document.body.scrollHeight);
})