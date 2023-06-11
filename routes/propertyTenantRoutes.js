const router = require('express').Router();
const { AddTenant, EditRent } = require('../controllers/PropertyTenantController')

router.post('/add', AddTenant);
router.post('/editRent', EditRent);


module.exports = router;