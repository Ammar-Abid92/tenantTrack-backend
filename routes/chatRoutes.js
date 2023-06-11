const router = require('express').Router();
const Auth = require('../middlewares/Authentication');
const { createConv, getChats, getMessages } = require('../controllers/ChatController')

router.post("/create", Auth, createConv);
router.get("/getChats", Auth, getChats);
router.get("/getMessages", Auth, getMessages);

module.exports = router;