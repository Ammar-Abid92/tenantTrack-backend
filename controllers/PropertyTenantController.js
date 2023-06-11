const PropertyTenant = require('../models/PropertyTenantModel');
const Property = require('../models/PropertyModel');
const User = require('../models/UserModel');
const rentaltracking = require('../models/RentalTrackingModel');
const jwt = require('jsonwebtoken');

const AddTenant = async (req, res, next) => {
    try {
        const property_id = req.body.property_id;
        var dateob = new Date(req.body.date);
        /*let objectiveDate = [];*/
        const user = await User.findById(req.body.tenant_id);
        const property = await Property.findById(property_id);
        if (user) {
            if (property) {
                const Add_Tenant = new PropertyTenant({
                    property_id: property._id,
                    userid: user._id,
                    date: req.body.date,
                    rent: property.rent
                });
                /*objectiveDate.push(dateob);
                for (let i = 0; i < 5; i++) {
                    if (dateob.getMonth() < 12) {
                        dateob.setMonth(dateob.getMonth() + 1);
                        objectiveDate.push(dateob);
                    } else {
                        dateob.setMonth(0);
                        dateob.setFullYear(dateob.getFullYear() + 1);
                        objectiveDate.push(dateob);
                    }
                }*/
                const savedTenant = await Add_Tenant.save();
                //for (let i = 0; i < objectiveDate.length; i++) {
                await rentaltracking({
                    propertyTenant_id: savedTenant._id,
                    status: false,
                    date: dateob
                }).save();
                //}
                res.send({
                    message: "Your Data Saved Successfully",
                    status: 200,
                    data: savedTenant
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
            message: "Data Not Saved: " + err,
            status: 404
        })
    }
}

const EditRent = async (req, res, next) => {
    try {
        const { propertyId, tenant_id, rent } = req.body;
        const propertyTenant = await PropertyTenant.findOneAndUpdate({ property_id: propertyId, userid: tenant_id });
        const property = await PropertyTenant.find({ property_id: propertyId, userid: tenant_id }).then(function (data, err) {
            if (data) {
                const DataAdd = {
                    rent: rent,
                }
                PropertyTenant.findByIdAndUpdate(data[0]._id, DataAdd).then(function (data, err) {
                    if (data) {
                        res.json({ message: "Rent Updated Successfully", status: 200 });
                    }
                    else {
                        res.json({ message: "Rent Not Updated", status: 404 });
                    }
                })
            }
            else {
                res.json({ message: "Data Not Found", status: 404 });
            }
        });

    } catch (err) {
        if (err.toString().includes('Cast to ObjectId failed')) {
            res.send({
                message: "Add Tenant Id and Property Id properly",
                status: 404,
            })
        }
        else {
            res.send({
                message: `Error: ${err}`,
                status: 404
            })
        }
    }
}

module.exports = {
    AddTenant,
    EditRent
}


