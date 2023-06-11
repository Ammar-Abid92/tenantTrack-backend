const Maintenance = require('../models/MaintenanceModel');
const Property = require('../models/PropertyModel');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const CreateMaintenance = async (req, res, next) => {
    try {
        const property_id = req.body.propertyid;
        const Id = req.id;
        const user = await User.findById(Id);
        const property = await Property.findById(property_id);
        if (user?.usertype == 'tenant') {
            if (property) {
                const Add_Maintenance = new Maintenance({
                    propertyid: property._id,
                    userid: user._id,
                    title: req.body.title,
                    description: req.body.description
                });
                const savedMaintenance = await Add_Maintenance.save();
                res.send({
                    message: "Your Data Saved Successfully",
                    status: 200,
                    data: savedMaintenance
                })
            } else {
                res.send({
                    message: "Property Not Found",
                    status: 404
                });
            }
        } else {
            res.send({
                message: "Permission Denied",
                status: 422
            })
        }
    } catch (err) {
        res.send({
            message: "Data Not Saved",
            status: 404
        })
    }
}


const MarkAsComplete = async (req, res, next) => {
    try {
        const { maintenanceId } = req.body;
        // const Id = req.id;
        const maintenance = await Maintenance.find({ _id: maintenanceId });
        if (maintenance[0].status != "completed") {
            const result = await Maintenance.updateOne({ _id: maintenanceId }, { $set: { status: "completed" } });
            if (result) {
                res.send({
                    message: "Marked as Completed",
                    status: 200,
                })
            }
        } else {
            res.send({
                message: "Already Marked as Completed",
                status: 200,
            })
        }
    } catch (err) {
        res.send({
            message: "Error: " + err,
            status: 404
        })
    }
}

const GetAllMaintenance = async (req, res, next) => {
    const Id = req.id;
    const propId = req.body.propId;
    const data = await Maintenance.find({ userid: Id, propertyid: propId })
        .populate({ path: 'userid', select: '_id username email image' })
        .populate({ path: 'propertyid', select: 'username' })
    res.send({
        message: `${data.length} Record Found of Landlord`,
        status: 200,
        data: data
    })
}

const GetAllMaintenanceLandlord = async (req, res, next) => {
    const propId = req.body.propId;
    const data = await Maintenance.find({ propertyid: propId })
        .populate({ path: 'userid', select: '_id username email image' })
        .populate({ path: 'propertyid', select: 'username' })
    res.send({
        message: `${data.length} Record Found of Landlord`,
        status: 200,
        data: data
    })
}

const GetSpecficTenant = async (req, res, next) => {
    const tenantid = req.params.id;
    const Id = req.id;

    const PropertyData = await Maintenance.find({ propertyid: tenantid, userid: Id }).populate({ path: 'userid', select: '_id username email image' })


    PropertyData.map(data => {
        return res.send({
            message: `Record Found for ${data.userid.username}`,
            status: 200,
            data: data
        })
    })
}

module.exports = {
    CreateMaintenance,
    GetAllMaintenance,
    GetAllMaintenanceLandlord,
    GetSpecficTenant,
    MarkAsComplete
}
