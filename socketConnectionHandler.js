/**
 * @file socketConnectionHandler
 * @author Levi Smith
 * 
 * This file contains the connection handler for the socket
 */

import Chat from './models/Chat.js';
import Message from './models/Message.js';

const socketMap = new Map();

export default function connectionHandler(io, socket) {

	//client connects with id as query param
	const userId = socket.handshake.query.userId;
	console.log(`Client connected: socketId=${socket.id}, user="${userId}"`);

    if (userId) {
        socketMap.set(userId, socket.id);
        console.log(`Client connected: socketId=${socket.id}, user="${userId}"`);
    } else {
        console.log('Failed Connection: No userId provided');
        return socket.disconnect(); 
    }

    socket.on('sendMessage', async (payload) => {

        const { sender, recipient, content, messageType = 'text' } = payload;
       	console.log(`"sendMessage event triggered: sender="${sender}", recipitant="${recipient}"`)
 

        //Store in database
        let chat = await Chat.findOne({
            participants: {
                $all: [sender, recipient],
                $size: 2
            }
    
        });
    
        //create a new chat if chat does not exist
        if (!chat) {
            console.log(`Creating New DM: sender=${sender} contactor=${recipient}`);
            chat = await Chat.create({
                participants: [sender, recipient]
            });
        }
    
        const msg = await Message.create({
            chatId: chat._id,
            senderId: sender,
            recipients: [recipient],
            content: content
        });


        const messageObject = {
            id: msg._id,
            sender: { id: sender },
            recipient: { id: recipient },
            content,
            messageType,
            timestamp: new Date().toISOString()
        };



        //Send Websocket messages to recipient and sender
        const recipientSocketId = socketMap.get(recipient);

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receiveMessage', messageObject);
        }
		
        socket.emit('receiveMessage', messageObject);


    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${userId}`);
        socketMap.delete(userId);
    });
}