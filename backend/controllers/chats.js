const { User, Chat, Profile } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { io } = require("../index");

// add single message to database
const postMessage = async (req, res) => {
  try {
    // Create a new chat record
    const message = await Chat.create({
      message: req.body.message,
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
    });

    res.status(201).json({
      message: "Message added to database",
      data: message,
    });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: "Unable to add message to database" });
  }
};

// read messages between two users
const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: [],
          include: [
            {
              model: Profile,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
        {
          model: User,
          as: "receiver",
          attributes: [],
          include: [
            {
              model: Profile,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to retrieve messages" });
  }
};

// readAll messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Chat.findAll();
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while getting the messages." });
  }
};

// bulk add messages to db
const postMessages = async (req, res) => {
  const { senderId, receiverId, messages } = req.body; // array of messages

  try {
    // generate salt and hash messages using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedMessages = await Promise.all(
      messages.map(async (message) => {
        return await bcrypt.hash(message, salt);
      })
    );
    const savedMessages = await Chat.bulkCreate(
      hashedMessages.map((message) => ({
        senderId,
        receiverId,
        message,
      }))
    );
    res.status(200).json(savedMessages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while saving messages to the db." });
  }
};

const deleteMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Chat.destroy({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
    }).then(() => {
      res.status(200).json({
        message: `Message history between ${userId1} and ${userId2} has been deleted.`,
      });
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error occured while deleting message history" });
  }
};

module.exports = {
  getMessages,
  getAllMessages,
  postMessages,
  postMessage,
  deleteMessages,
};
