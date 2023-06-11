const router = require('express').Router();
const Auth = require('../middlewares/Authentication');
const AttachmentUpload = require('../helpers/AttachmentUpload');
const { PropertyCreate,
    PropertyUpdate,
    GetProperties,
    Properties_Details,
    GetTenantProperties,
    TransferOwn
} = require('../controllers/PropertyController')

router.post('/create', PropertyCreate);
router.post('/update', PropertyUpdate);
router.get('/properties', Auth, GetProperties);
router.get('/tenantproperties', Auth, GetTenantProperties);
router.post('/TransferOwn', Auth, TransferOwn);
//router.post('/upload-attachment',/* AttachmentUpload.upload,*/ SendAttachment);
router.get('/properties/:pid', Properties_Details)


module.exports = router;