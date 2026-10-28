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


let username = '';
// Evita enviar vários pedidos de entrada antes de o servidor responder.
let joinPending = false;
let joined = false;
let wasDisconnected = false;

// Valida o apelido e pede ao servidor para associá-lo a esta conexão.
function requestJoin() {
    const name = usernameInput.value.trim();
    if (!name || joinPending) {
        usernameInput.focus();
        return;
    }

    username = name;
    joinPending = true;
    joined = false;
    document.title = 'Chat (' + username + ')';
    socket.emit('join-request', username);
}

// Adiciona texto à lista sem interpretar conteúdo recebido como HTML.
function addMessage(text, className = '') {
    const item = document.createElement('li');
    item.className = className;
    item.textContent = text;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
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
    joined = true;
    usernamePage.classList.add('off');
    chatContainer.classList.remove('off')

    document.getElementById('profileName').textContent = username;
    document.getElementById('profileAvatar').textContent = username.charAt(0).toUpperCase();
    if (wasDisconnected) {
        addMessage('Conexão restabelecida.', 'status-message');
        wasDisconnected = false;
    }
    console.log('Conectado')
})

// Uma reconexão cria uma nova conexão no servidor, então registra o apelido de novo.
socket.on('connect', () => {
    if (username && !joined) {
        joinPending = true;
        socket.emit('join-request', username);
    }
});

socket.on('disconnect', () => {
    if (username) {
        joined = false;
        wasDisconnected = true;
        addMessage('Conexão perdida. Tentando reconectar...', 'status-message');
    }
});

// Envia a mensagem somente depois de o servidor confirmar a entrada na conexão atual.
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = input.value.trim();
    if (message && joined) {
        socket.emit('chat message', message);
        input.value = '';
    } else if (message) {
        addMessage('Aguarde a reconexão antes de enviar sua mensagem.', 'status-message');
    };
});

// Mostra as mensagens enviadas pelos outros clientes com o nome do remetente.
socket.on('show-msg', (data) => {
    addMessage(`${data.username}: ${data.msg}`);
})

// Mostra apenas o texto da mensagem para quem a enviou.
socket.on('own-msg', (data) => {
    addMessage(data.msg);
})
