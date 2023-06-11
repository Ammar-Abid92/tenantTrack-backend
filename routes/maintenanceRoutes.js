const router = require('express').Router();
const {
    CreateMaintenance,
    GetAllMaintenance,
    GetAllMaintenanceLandlord,
    GetSpecficTenant,
    MarkAsComplete
} = require('../controllers/MaintenanceController')

router.post('/add', CreateMaintenance);
router.get('/getall', GetAllMaintenance);
router.get('/getallLandlord', GetAllMaintenanceLandlord);
router.get('/tenant/:id', GetSpecficTenant);
router.get('/markAsComplete', MarkAsComplete)



module.exports = router;