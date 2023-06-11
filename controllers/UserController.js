const User = require("../models/UserModel");

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");
const { get } = require("mongoose");
const DOMAIN = "sandboxdec0056748824aa794943b45be2c1283.mailgun.org";
const mg = mailgun({
  apiKey: "0a0545928caf383737e9e907d42b0637-f7d687c0-03fe37d3",
  domain: DOMAIN,
});
const sendEmail = require("../middlewares/Email");
const UserRegisteration = async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      usertype: req.body.usertype,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_PASSWORD
      ).toString(),
      image: req.body.image,
    });

    const savedUser = await newUser.save();

    res.send({
      message: "Your Data Saved Successfully",
      status: 201,
      data: savedUser,
    });
  } catch (err) {
    res.send({
      message: "Data not Saved",
      status: 404,
    });
  }
};

// Login Api start here
const UserLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const originalpassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_PASSWORD
    ).toString(CryptoJS.enc.Utf8);
    if (!user) {
      res.send({
        message: "Invalid Email",
        status: 404,
      });
    } else if (originalpassword !== req.body.password) {
      res.send({
        message: "Invalid Password",
        status: 404,
      });
    } else {
      const access_token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_TOKEN,
        { expiresIn: "2d" }
      );

      const { token } = user._doc;
      res.send({
        message: "Loggedin Successfully",
        status: 200,
        data: { token, access_token },
      });
    }
  } catch (error) {
    res.send({
      message: "Invalid Credentails",
      status: 500,
    });
  }
};
const ForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }, async (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist" });
    }

    const random = Math.floor(Math.random() * 1000000);
    const subject = "Reset Password OTP";

    return user
      .updateOne({ otp: random }, function (err, success) {
        if (err) {
          return res.status(400).json({ error: "OTP error" });
        } else {
          const name = user.username;
          const data = sendEmail(name, email, subject, random);
          return res.send({ message: "Email send Successfully", data:data });
        }
      })
      .clone();
  });
};

const OtpCheck = async (req, res) => {
  const { otp, email } = req.body;
  if (otp && email) {
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "User does not exist" });
      } else {
        user.findOne({ otp: otp }, function (err, success) {
          if (err) {
            return res.status(400).json({ error: "Incorrect OTP" });
          } else {
            return res.json({ message: "OTP Success" });
          }
        });
      }
    });
  } else {
    return res.status(401).json({ error: "Authentication Error" });
  }
};

const ResetPassword = async (req, res) => {
  if (req.body.email) {
    const { newPass, email } = req.body;
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: "User with this email does not exist" });
      }
      var pass = CryptoJS.AES.encrypt(
        newPass,
        process.env.SECRET_PASSWORD
      ).toString();
      return user.updateOne({ password: pass }, function (err, success) {
        if (err) {
          return res.status(400).json({ error: "Reset Password Error" });
        } else {
          return res.json({ message: "Password Successfully Changed" });
        }
      });
    });
  } else {
    return res.status(400).json({ error: "Email Required" });
  }
};

const UpdatePassword = async (req, res, next) => {
  try {
    const Id = req.id;
    const Curr_User = await User.findById(Id);
    const originalpassword = CryptoJS.AES.decrypt(
      Curr_User.password,
      process.env.SECRET_PASSWORD
    ).toString(CryptoJS.enc.Utf8);
    if (req?.body?.oldPassword !== originalpassword) {
      res.send({
        message: "Invalid Current Password",
        status: 404,
      });
      next();
    } else {
      try {
        const pass = CryptoJS.AES.encrypt(
          req.body.newPassword,
          process.env.SECRET_PASSWORD
        ).toString();
        const Datatoupdate = { password: pass };
        const PasswordUpdate = await Curr_User.updateOne(Datatoupdate).then(
          function (dd, data) {
            if (dd.modifiedCount === 0) {
              res.json({ message: "not Updated" });
            } else {
              res.json({ message: "Password Updated Successfully" });
            }
          }
        );
      } catch (err) {
        res.send({ message: `Password not updated` });
      }
      next();
    }
  } catch (err) {
    res.send({
      message: `User Not Updated ${err}`,
      status: 404,
    });
  }
};

const VerifyRegisteredUser = async (req, res) => {
  try {
    const Id = req.id;
    const verified_User = await User.findById(Id);
    const { password, ...details } = verified_User._doc;
    res.send({
      message: `${details?.username} Logged in Successfully`,
      status: 200,
      data: { ...details },
    });
  } catch (err) {
    res.send({
      message: "Login Failed!",
      status: 404,
    });
  }
};

const SearchUser = async (req, res) => {
  const name = req.params.username;
  const username = await User.find({
    username: { $regex: `${name}`, $options: "i" },
  });
  const search = username.map((data) => {
    const { username, image, ...other } = data;
    return { Username: username, Avatar: image };
  });

  console.log(search);
  res.send({
    total: search.length,
    message: `${search.length} User Found`,
    status: 200,
    data: search,
  });
};

const ProfileUpdates = async (req, res) => {
  try {
    const image = req.body.image;
    const filename = req.file.path;
    const files = `${filename}`.replace("public", "");
    const DataAdd = files.replace(/\\/g, "/");
    const Id = req.id;
    const updated_User = await User.findByIdAndUpdate(
      Id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          usertype: req.body.usertype,
          image: `${DataAdd.replace("/userimage", "")}`,
        },
      },
      { new: true }
    );

    res.send({
      message: `${updated_User.username} Profile Updated Successfully`,
      status: 201,
      data: updated_User,
    });
  } catch (err) {
    res.send({
      message: `Profile Not Updated`,
      status: 204,
    });
  }
};

const ListofAllUsers = async (req, res) => {
  try {
    const userFind = await User.find({ usertype: "tenant" });
    const resultingData = userFind.map((data) => {
      const { id, username, email, image, usertype, ...other } = data;

      return {
        id: id,
        username: username,
        email: email,
        image: image,
        usertype: usertype,
      };
    });

    res.send({
      total: resultingData.length,
      message: `${resultingData.length} User Found`,
      status: 200,
      data: resultingData,
    });
  } catch (err) {
    res.send({
      message: `User Not Fetched`,
      status: 204,
      data: [],
    });
  }
};

const getAllLandlords = async (req, res) => {
  try {
    const userFind = await User.find({ usertype: "landlord" });
    const resultingData = [];
    userFind.map((data) => {
      const { id, username, email, image, usertype, ...other } = data;
      if (id != req.id) {
        resultingData.push({
          id: id,
          username: username,
          email: email,
          image: image,
          usertype: usertype,
        });
      }
    });

    res.send({
      total: resultingData.length,
      message: `${resultingData.length} User Found`,
      status: 200,
      data: resultingData,
    });
  } catch (err) {
    res.send({
      message: `User Not Fetched`,
      status: 204,
      data: [],
    });
  }
};

const checkUsers = async (req, res) => {
  try {
    const { email } = req.body;
    const userFind = await User.findOne({ email: email });
    if (userFind) {
      res.send({
        isExisted: true
      });
    } else {
      res.send({
        isExisted: false
      });
    }
  } catch (error) {
    res.send({
      message: 'Error: ' + error,
      status: 204,
      data: {}
    });
  }
}

module.exports = {
  UserRegisteration,
  UserLogin,
  ForgotPassword,
  OtpCheck,
  ResetPassword,
  VerifyRegisteredUser,
  UpdatePassword,
  SearchUser,
  ProfileUpdates,
  ListofAllUsers,
  checkUsers,
  getAllLandlords
};
