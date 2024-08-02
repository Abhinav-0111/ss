import Conversation from "../model/conversationModel.js";
import Message from "../model/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.body.id;
        const recevierId = req.params.id;
        const { message } = req.body;

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, recevierId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, recevierId],
            });
        }
        const newMessage = await Message.create({
            senderId,
            recevierId,
            message,
        });
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }
        await Promise.all([gotConversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(recevierId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(200).json({ newMessage });
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = req.body.id;
        const recevierId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, recevierId] },
        }).populate("messages");
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        return res.status(500).json({ err: err.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndDelete(id);
        return res.status(200).json({ Message: "Tweet Delete successfully" });
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
};
