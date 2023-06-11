const router = require("express").Router();
const Auth = require("../middlewares/Authentication");
const userupload = require("../helpers/UserImageUpload");
const {
  UserRegisteration,
  UserLogin,
  ForgotPassword,
  OtpCheck,
  ResetPassword,
  UpdatePassword,
  SearchUser,
  VerifyRegisteredUser,
  ProfileUpdates,
  ListofAllUsers,
  checkUsers,
  getAllLandlords
} = require("../controllers/UserController");

router.post("/create", UserRegisteration);
router.post("/login", UserLogin);
router.post("/forgot-password", ForgotPassword);
router.post("/OTP/verification", OtpCheck);
router.post("/reset-password", ResetPassword);
router.post("/welcome", Auth, VerifyRegisteredUser);
router.post("/update-password", Auth, UpdatePassword);
router.post("/search/:username", SearchUser);
router.get("/getAllUsers", ListofAllUsers);
router.get("/getAllLandlords", Auth, getAllLandlords);
router.get("/checkUsers", checkUsers);
router.put("/update", Auth, userupload.upload, ProfileUpdates);
module.exports = router;
