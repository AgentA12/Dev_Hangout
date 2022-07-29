const { User, Dm } = require("../models/index");
const { getCurrentTime } = require("../utils/helpers");

const dmController = {
  //save the dm using the users id
  async saveDmMsg({ body }, res) {
    const { message, receiver, sender } = body;
    const timeOfMessage = getCurrentTime();

    try {
      let newDm = await Dm.create(
        {
          receiverId: receiver.id,
          senderId: sender.user_id,
          message: message,
          timeOfMessage: timeOfMessage,
        },
        { new: true }
      );
      if (newDm) {
        res.json(newDm);
      }
    } catch (error) {
      res.json(error);
    }
  },
  // query the dms by the sender and receiver id then concat and return them
  async getAllDms({ params }, res) {
    const allDms = await Dm.findAll({});
    try {
      let dmData = await Dm.findAll({
        where: { senderId: params.user_id },
        include: [
          { model: User, as: "sender", attributes: { exclude: "password" } },
          {
            model: User,
            as: "receiver",
            attributes: { exclude: "password" },
          },
        ],
      });

      let userAsSender = dmData.map((dm) => dm.get({ plain: true }));
      console.log("line 42 ", userAsSender);
      dmData = await Dm.findAll({
        where: { receiverId: params.user_id },
        include: [
          { model: User, as: "sender", attributes: { exclude: "password" } },
          {
            model: User,
            as: "receiver",
            attributes: { exclude: "password" },
          },
        ],
      });

      const userAsReciever = dmData.map((dm) => dm.get({ plain: true }));

      const dms = userAsReciever.concat(userAsSender);
      console.log(dms);
      res.json(dms);
    } catch (error) {
      res.json(error);
    }
  },

  async getDmsByUser({ params }, res) {
    //a user can be a sender and a receiver so query both id types
    try {
      let dmData = await Dm.findAll({
        where: {
          receiverId: [params.receiverId, params.senderId],
          senderId: [params.receiverId, params.senderId],
        },

        include: [
          { model: User, as: "sender", attributes: { exclude: "password" } },
          {
            model: User,
            as: "receiver",
            attributes: { exclude: "password" },
          },
        ],
      });

      const dmsSender = dmData.map((dm) => dm.get({ plain: true }));

      res.json(dmsSender);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};

module.exports = dmController;
