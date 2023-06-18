const Request = require("../models/RequestModel");
const User = require("../models/UserModel");


const MakeRequest = async (req, res, next) => {
    try {
        const Id = req.id
        const user = await User.findById(Id);
        if (user?.usertype === 'tenant') {

            const newRequest = new Request({
                tenant_id : req.body.tenant_id,
                landlord_id : req.body.landlord_id,
                property_id : req.body.property_id,
                status: False
            });
            const savedRequest = await newRequest.save();
            res.send({
                message: "Your request Saved Successfully",
                status: 200,
                data: savedRequest
            })
        } else {
            res.send({
                message: "Permission Denied",
                status: 422
            })
        }

    } catch (err) {
        res.send({
            message: "request Not Saved",
            status: 404
        })
    }
}

const GetAllRequests = async (req, res, next) => {
    try {

        const Id = req.id;
        const allRequests = await Request.find({ landlord_id: Id });

        let NodeList = [];

        for(let i = 0; i < allRequests.length; i++){
            const { _id, tenant_id, landlord_id, property_id, status } = allRequests[i];
            NodeList.push({
                id: _id,
                landlord_id,
                tenant: await User.findById(tenant_id),
                property_id,
                status
            });
        }
        

        if (NodeList.length > 0) {
            res.send({
                message: "Requests Fetched",
                status: 200,
                data: NodeList,
            });
        } else {
            res.send({
                message: "Requests Not Found",
                status: 404,
                data: [],
            })
        }
    } catch (err) {
        res.json({
            message: err,
            status: 503,
            data: [],
        })
    }
}


module.exports = {
    MakeRequest,
    GetAllRequests
}
