/*const router = require('express').Router();
const { 
    Rent_Tracking_Up_todate,
    Rental_Tracking_Updates_Get,
    For_Each_User_Info
 } = require('../controllers/RentalTrackingController');

router.post('/create' , Rent_Tracking_Up_todate);
router.get('/getAll' ,  Rental_Tracking_Updates_Get);
router.get('/PropertyTenant/:id' , For_Each_User_Info);

module.exports = router*/

const Auth = require('../middlewares/Authentication');
const {
    getallRent,
    getallTent,
    getallRentbyProp,
    changeRent,
    removeTenant
} = require('../controllers/RentalTrackingController');

const router = require('express').Router();

router.get('/getallRent', Auth, getallRent);
router.get('/getallTent', Auth, getallTent);
router.get('/getallRentbyProp', getallRentbyProp);
router.get('/rmTenant', removeTenant);
router.post('/changeRent', changeRent);

module.exports = router;