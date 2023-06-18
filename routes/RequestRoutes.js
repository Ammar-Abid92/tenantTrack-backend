const router = require('express').Router();
const { MakeRequest, GetAllRequests } = require('../controllers/RequestController');
const Auth = require('../middlewares/Authentication');

router.get('/allRequests', Auth, GetAllRequests);
router.post('/makeRequest', Auth, MakeRequest);

module.exports = router;