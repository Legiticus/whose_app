/**
 * @file socketConnectionHandler
 * @author Levi Smith
 * 
 * This file contains the connection handler for the socket
 */

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
 
        const messageObject = {
            id: Date.now(),
            sender: { id: sender },
            recipient: { id: recipient },
            content,
            messageType,
            timestamp: new Date().toISOString()
        };

        const recipientSocketId = socketMap.get(recipient);

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receiveMessage', messageObject);
        }
		
        // Also emit back to sender
        socket.emit('receiveMessage', messageObject);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${userId}`);
        socketMap.delete(userId);
    });
}