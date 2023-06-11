/*const Rent_Tracking = require('../models/RentalTrackingModel');
const nodeCron = require("node-cron");
const PropertyTenant = require('../models/PropertyTenantModel');
const Property = require('../models/PropertyModel');
var mongoose = require('mongoose');


const Rent_Tracking_Up_todate = async (req, res, next) => {
  // Getting data with PropertyTenant collection start here
  const getPropertyTenant = await PropertyTenant.find();
  const propertyTenant_id = getPropertyTenant.map(data => data._id)
  const rowid = propertyTenant_id.toString();

  // Getting data with PropertyTenant collection end here here

  // start tracking collection
  const permtent_id = rowid.split(',').map(data => data)

  const rent = permtent_id.map((data, i) => {

    const tracking = new Rent_Tracking({
      propertyTenant_id: data,
      status: req?.body?.status
    });
    return tracking

  })

  rent.map(async (data) => {
    if (data) {
      return items = await data.save();
    }
  })

  // end tracking collection

  // checking rental track collection records start here
  const rentaltrack = await Rent_Tracking.find();
  // checking rental track collection records end here

  res.send({
    total: rentaltrack.length,
    message: `${rentaltrack.length} Record Generated Successfully`,
    status: 200,
    data: [`${rent.length} Current_Record_Generate`, rent, 'Total_rental_record', rentaltrack]
  })
}

// cron job code start here
nodeCron.schedule('0 0 1-15 * *', Rent_Tracking_Up_todate, null, true, "Asia/Kolkata");
// cron job code end here

const Rental_Tracking_Updates_Get = async (req, res) => {

  const agg = [
    {
      '$lookup': {
        'from': 'propertytenants',
        'localField': 'propertyTenant_id',
        'foreignField': '_id',
        'as': 'result'
      }
    }, {
      '$unwind': {
        'path': '$result'
      }
    }, {
      '$lookup': {
        'from': 'properties',
        'localField': 'result.property_id',
        'foreignField': '_id',
        'as': 'Property_data'
      }
    }, {
      '$unwind': {
        'path': '$Property_data'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'result.userid',
        'foreignField': '_id',
        'as': 'Users_data'
      }
    }, {
      '$unwind': {
        'path': '$Users_data'
      }
    }, {
      '$sort': {
        'createdAt': -1
      }
    }
  ]

  const Data = await Rent_Tracking.aggregate(agg)


  const FinalData = await Data.map((data) => {
    const { _id, propertyTenant_id, __v, result, ...CompleteDetails } = data
    return CompleteDetails;
  })

  res.send({
    total: FinalData.length,
    message: `${FinalData.length} Record Fetch Successfully`,
    status: 200,
    data: FinalData
  })

}


const For_Each_User_Info = async (req, res) => {

  const Id = req.params.id;
  const P_id = req.query.P_id;
  const U_id = req.query.U_id;

  var property_Id = mongoose.Types.ObjectId(`${P_id}`);
  var user_Id = mongoose.Types.ObjectId(`${U_id}`);
  var propertyTenant = mongoose.Types.ObjectId(`${Id}`);

  const agg = [
    {
      '$match': {
        'propertyTenant_id': propertyTenant
      }
    }, {
      '$lookup': {
        'from': 'propertytenants',
        'localField': 'propertyTenant_id',
        'foreignField': '_id',
        'as': 'result'
      }
    }, {
      '$unwind': {
        'path': '$result'
      }
    }, {
      '$match': {
        'result.property_id': property_Id,
        'result.userid': user_Id
      }
    }, {
      '$lookup': {
        'from': 'properties',
        'localField': 'result.property_id',
        'foreignField': '_id',
        'as': 'property'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'result.userid',
        'foreignField': '_id',
        'as': 'user'
      }
    }, {
      '$unwind': {
        'path': '$property'
      }
    }, {
      '$unwind': {
        'path': '$user'
      }
    }, {
      '$sort': {
        'property.date': -1
      }
    }
  ]

  const Data = await Rent_Tracking.aggregate(agg)
  res.send({
    message: "Data Fetched",
    status: 200,
    data: Data
  })
}

module.exports = {
  Rent_Tracking_Up_todate,
  Rental_Tracking_Updates_Get,
  For_Each_User_Info
}*/
const Rent_Tracking = require('../models/RentalTrackingModel');
const PropertyTenant = require('../models/PropertyTenantModel');
const PropertyModel = require('../models/PropertyModel');
const RentalTrackingModel = require('../models/RentalTrackingModel');

const getallRent = async (req, res) => {
  try {
    const Id = req.id;
    var date = new Date(req.body.date);
    const data = await PropertyModel.find({ userid: Id })
    //console.log(data);
    let NodeList = []
    if (data) {
      for (var i = 0; i < data.length; i++) {
        const tenantData = await PropertyTenant.find({ property_id: data[i]._id })
        for (var j = 0; j < tenantData.length; j++) {
          let val = await Rent_Tracking.find({ propertyTenant_id: tenantData[j]._id, })
            .populate({ path: 'propertyTenant_id', populate: { path: 'userid', select: '_id username image' } })
          if (val && val.length > 0) {
            var checkDate = new Date(val[0].date);
            NodeList.push(val[0])
          }
        }
      }
      if (NodeList.length > 0) {

        res.send({
          message: "Data Fetched Succesfully",
          status: 200,
          data: NodeList
        })
      } else {
        res.send({
          message: "No Rental Tracking Found",
          status: 200,
          data: []
        })
      }
    } else {
      res.send({
        message: "No Rental Tracking Found",
        status: 200,
        data: []
      })
    }
  } catch (error) {
    res.send({
      message: "Error: " + error,
      status: 404,
      data: []
    })
  }
}

const getallTent = async (req, res) => {
  try {
    const Id = req.id;
    const date = req.body.date;
    const data = await PropertyTenant.find({ userid: Id })
    let NodeList = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let val = await Rent_Tracking.find({ propertyTenant_id: data[i]._id, })
          .populate({ path: 'propertyTenant_id', populate: { path: 'userid', select: '_id username image' } })
        if (val) {
          NodeList.push(val);
        }
      }
      if (NodeList.length > 0) {
        res.send({
          message: "Data Fetched Succesfully",
          status: 200,
          data: NodeList
        })
      } else {
        res.send({
          message: "No Rental Tracking Found",
          status: 200,
          data: []
        })
      }
    } else {
      res.send({
        message: "No Rental Tracking Found",
        status: 200,
        data: []
      })
    }
  } catch (error) {
    res.send({
      message: "Error: " + error,
      status: 404,
      data: []
    })
  }
}

const getallRentbyProp = async (req, res) => {
  try {
    const { property_Id, date } = req.body;
    const data = await PropertyTenant.find({ property_id: property_Id })
    let NodeList = []
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let val = await Rent_Tracking.find({ propertyTenant_id: data[i]._id, })
          .populate({ path: 'propertyTenant_id', populate: { path: 'userid', select: '_id username image' } })
        if (val) {
          NodeList.push(val);
        }
      }
      if (NodeList.length > 0) {
        res.send({
          message: "Data Fetched Succesfully",
          status: 200,
          data: NodeList
        })
      } else {
        res.send({
          message: "No Rental Tracking Found",
          status: 200,
          data: []
        })
      }
    } else {
      res.send({
        message: "No Rental Tracking Found",
        status: 200,
        data: []
      })
    }
  } catch (error) {
    console.log(error);
    if (error.toString().includes('Cast to ObjectId failed')) {
      res.send({
        message: "Add Property Id",
        status: 404,
        data: []
      })
    } else {
      res.send({
        message: "Error: " + error,
        status: 404,
        data: []
      })
    }
  }
}

const changeRent = async (req, res) => {
  try {
    const { rental_id, status } = req.body;
    const data = await Rent_Tracking.findOne({ _id: rental_id });
    const val = status;
    if (data) {
      const result = await Rent_Tracking.updateOne({ _id: rental_id }, { $set: { status: val } });
      if (result) {
        res.send({
          message: "Data Updated Succesfully",
          status: 200,
        })
      }
    } else {
      res.send({
        message: "Data Not Found",
        status: 200,
      })
    }
  } catch (error) {
    if (error.toString().includes('Cast to ObjectId failed')) {
      res.send({
        message: "Add Rental Id or Status in fields",
        status: 404,
      })
    } else {
      res.send({
        message: "Error: " + error,
        status: 404,
      })
    }
  }
}

const removeTenant = async (req, res) => {
  try {
    const { userid, property_id } = req.body;
    const model = await PropertyTenant.findOne({ userid: userid, property_id: property_id });
    if (model) {
      await RentalTrackingModel.deleteMany({ propertyTenant_id: model._id });
      const deleted = await PropertyTenant.findOneAndDelete({ userid: userid, property_id: property_id });
      res.send({
        message: "Tenant Removed Succesfully",
        status: 200,
      })
    } else {
      res.send({
        message: "Data Not Found",
        status: 200,
      })
    }
  } catch (error) {
    res.send({
      message: "Error: " + error,
      status: 404,
    })
  }
}

module.exports = {
  getallRent,
  getallTent,
  getallRentbyProp,
  changeRent,
  removeTenant
};