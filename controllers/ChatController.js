const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");
const Conv = require("../models/ConversationModel");

function iniateSockets(server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: false,
      transports: ["websocket", "polling"],
      allowEIO4: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("connection");

    socket.on("send-message", async (message) => {
      try {
        const value = JSON.parse(message);
        if (value.conv_id) {
          const { message, sender_id, receiver_id, conv_id } = value;
          const chatMessage = new Chat({
            message: message,
            sender_id: sender_id,
            receiver_id: receiver_id,
            conv_id: conv_id
          });

          const savedChat = await chatMessage.save();
          await Conv.updateOne({ _id: conv_id }, { $set: { lastMsg: message } });

          io.sockets.emit(receiver_id.toString(), savedChat.toJSON());
        }
      } catch (error) {
        console.log("send-message Error:" + error);
      }
    });

    socket.on("disconnect", (message) => {
      console.log("Disconnect");
    });
  });

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
}

async function addMessage(message, sender_id, receiver_id, conv_id) {

  const chatMessage = new Chat({
    message: message,
    sender_id: sender_id,
    receiver_id: receiver_id,
    conv_id: conv_id
  });

  const savedChat = await chatMessage.save();

  return savedChat;
}

const getMessages = async (req, res, next) => {
  try {
    const Id = req.id;
    const conv_id = req.body.conv_id;
    const messageList = await Chat.find({ conv_id: conv_id });
    let response = [];
    for (var i = 0; i < messageList.length; i++) {
      let sender = false;
      const { _id, receiver_id, message, sender_id, createdAt } = messageList[i];
      if (sender_id == Id) {
        sender = true;
      }
      response.push({
        id: _id,
        sender: sender,
        message: message,
        /*receiverData: await User.findById(receiver_id),
        senderData: await User.findById(sender_id),*/
        time: createdAt
      })
    }
    if (response) {
      res.send({
        message: "Data Fetched Successfully",
        status: 200,
        data: response
      });
    } else {
      res.send({
        message: "Data Not Found",
        status: 204,
        data: []
      });
    }
  } catch (error) {
    res.send({
      message: "Error: " + error,
      status: 404,
      data: []
    });
  }
}

const getChats = async (req, res, next) => {
  try {
    const Id = req.id;
    const convo = await Conv.find({ Users: Id });
    let response = [];
    for (var i = 0; i < convo.length; i++) {
      const { _id, Users } = convo[i];
      let index = 0;
      if (Users[0] == Id) {
        index = 1;
      } else {
        index = 0;
      }
      response.push({
        id: _id,
        user: await User.findById(Users[index]),
        lastmsg: convo[i].lastMsg
      });
    }
    if (response) {
      res.send({
        message: "Your Data Fetched Successfully",
        status: 200,
        data: response,
      });
    } else {
      res.send({
        message: "Data not Found",
        status: 201,
        data: []
      });
    }
  } catch (err) {
    res.send({
      message: "Error:" + err,
      status: 404,
    });
  }
}

const createConv = async (req, res, next) => {
  try {
    const Id = req.id;
    const userid = req.body.userid;
    const exist = await Conv.findOne({ Users: { $all: [Id, userid] } });
    if (exist) {

      res.send({
        message: "Your Data Already Exists",
        status: 201,
        data: data,
      });

    } else {
      const convo = new Conv({
        Users: [
          Id, userid
        ],
        lastMsg: " "
      });
      const savedConv = await convo.save();

      res.send({
        message: "Your Data Saved Successfully",
        status: 201,
        data: savedConv,
      });
    }

  } catch (err) {
    res.send({
      message: "Data not Saved",
      status: 404,
    });
  }
}

module.exports = {
  iniateSockets,
  createConv,
  getMessages,
  getChats
};
