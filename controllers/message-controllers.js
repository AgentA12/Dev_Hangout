const { Message, Room, User } = require("../models/index");

const messageController = {
  async getMessagesByRoom({ params }, res) {
    try {
      let dbMessageData = await Message.findAll({
        include: [
          {
            model: Room,
            as: "room",
            where: { roomName: params.room },
          },
          {
            model: User,
            as: "user",
            attributes: ["username", "pfp"],
          },
        ],
        order: [["updatedAt", "ASC"]],
        require: true,
      });

      let messages = dbMessageData.map((message) =>
        message.get({ plain: true })
      );
      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: error });
    }
  },

  async saveMessage({ body }, res) {
    console.log(body)
    try {
      let roomId = await Room.findOne({
        where: {
          roomName: body.room,
        },
        attributes: ["id"],
        raw: true,
      });

      let newMessage = await Message.create({
        message: body.msg,
        timeOfMessage: body.currentTime,
        userId: body.userId,
        roomId: roomId.id,
      });

      res.json(newMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = messageController;
