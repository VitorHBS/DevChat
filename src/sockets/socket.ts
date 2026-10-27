import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

// Apelidos das conexões que já entraram; ainda não são usuários do banco.
let connectedUsers: string[] = [];

// Registra os eventos do chat no servidor Socket.IO.
export function initializeSocket(server: HttpServer) {
    const io = new Server(server)

    // Executa quando um navegador estabelece uma conexão com o servidor.
    io.on('connection', (socket) => {

        console.log('Conexão realizada...');

        // Guarda o apelido nesta conexão e confirma a entrada para esse cliente.
        socket.on('join-request', (username) => {
            socket.data.username = username;
            connectedUsers.push(username);
            console.log(connectedUsers);

            socket.emit('user-ok', connectedUsers)
        })

        // A conexão terminou. A lista ainda não remove o apelido neste protótipo.
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        // Combina o apelido guardado na conexão com o texto recebido.
        socket.on('chat message', (msg) => {
            let obj = {
                username: socket.data.username,
                msg: msg
            }

            // Envia somente aos outros clientes; o remetente não recebe este evento.
            socket.broadcast.emit('show-msg', obj)
            socket.emit('own-msg', obj)
        })
    })
}