const Message = require('../models/messages');

// Create/send a message between two users
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        if (!senderId || !receiverId || !content) {
            return res.status(400).json({ message: 'senderId, receiverId and content are required' });
        }

        const msg = await Message.create({ sender: senderId, receiver: receiverId, content });
        await msg.populate('sender', 'userName profilePicture');
        await msg.populate('receiver', 'userName profilePicture');
        res.status(201).json({ message: 'Message sent', data: msg });
    } catch (err) {
        console.error('sendMessage error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get conversation (all messages) between two users
exports.getConversation = async (req, res) => {
    try {
        const { userA, userB } = req.query; // pass as query params
        if (!userA || !userB) {
            return res.status(400).json({ message: 'userA and userB query params required' });
        }
        const messages = await Message.find({
            $or: [
                { sender: userA, receiver: userB },
                { sender: userB, receiver: userA }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'userName profilePicture')
            .populate('receiver', 'userName profilePicture');

        res.status(200).json({ messages });
    } catch (err) {
        console.error('getConversation error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// List recent conversations (distinct user pairs) for a user
// exports.listUserThreads = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         if (!userId) return res.status(400).json({ message: 'userId param required' });

//         // Get latest message per counterpart
//         const pipeline = [
//             { $match: { $or: [{ sender: require('mongoose').Types.ObjectId(userId) }, { receiver: require('mongoose').Types.ObjectId(userId) }] } },
//             { $sort: { createdAt: -1 } },
//             {
//                 $group: {
//                     _id: {
//                         $cond: [
//                             { $eq: ['$sender', require('mongoose').Types.ObjectId(userId)] },
//                             '$receiver',
//                             '$sender'
//                         ]
//                     },
//                     lastMessage: { $first: '$$ROOT' }
//                 }
//             },
//             { $limit: 30 }
//         ];
//         const agg = await Message.aggregate(pipeline);

//         // Populate manually (aggregation loses refs)
//         const populated = await Promise.all(
//             agg.map(async item => {
//                 const lastMsg = await Message.findById(item.lastMessage._id)
//                     .populate('sender', 'userName profilePicture')
//                     .populate('receiver', 'userName profilePicture');
//                 return { withUser: item._id, lastMessage: lastMsg };
//             })
//         );

//         res.status(200).json({ threads: populated });
//     } catch (err) {
//         console.error('listUserThreads error:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };