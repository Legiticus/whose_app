/**
 * @file socketConnectionHandler
 * @author Levi Smith
 * 
 * This file contains the connection handler for the socket
 */

import Chat from './models/Chat.js';
import Message from './models/Message.js';
import User from './models/User.js';

const socketMap = new Map();

export default function connectionHandler(io, socket) {

	//client connects with id as query param
	const userId = socket.handshake.query.userId;

    if (userId) {
        socketMap.set(userId, socket.id);
        console.log(`Client connected: socketId=${socket.id}, user="${userId}"`);
    } else {
        console.log('Failed Connection: No userId provided');
        return socket.disconnect(); 
    }

    socket.on('sendMessage', async (payload) => {

        const { sender, recipient, content, messageType = 'text' } = payload;
       	console.log(`"sendMessage event triggered: userId=${userId} sender="${sender}", recipitant="${recipient}"`)
 
        //Check that sender does not equal recipiant
        if (userId === recipient) {
            return;
        }

        //Store in database
        let chat = await Chat.findOne({
            participants: {
                $all: [userId, recipient],
                $size: 2
            }
        });
    
        //create a new chat if chat does not exist
        if (!chat) {
            console.log(`Creating New DM: sender=${userId} contactor=${recipient}`);
            chat = await Chat.create({
                participants: [userId, recipient]
            });
        }
    
        const msg = await Message.create({
            chatId: chat._id,
            sender: userId,
            recipient: recipient,
            content: content
        });

        const senderObj = await User.findById(userId);
        const recipientObject = await User.findById(recipient);


        const messageObject = {
            _id: msg._id,
            sender: senderObj,
            recipient: recipientObject,
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
        console.log(`Client disconnected: user=${userId}`);
        socketMap.delete(userId);
    });
}