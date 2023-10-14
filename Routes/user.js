const express = require("express");
const {
  createUser,
  getUsers,
  getUserByAccountNumber,
  updateUserByAccountNumber,
  deleteUserByAccountNumber,
  userDepositAmount,
  userwithdrawalAmount,
  userLoanApplication,
  login,
} = require("../controllers/userController");

const router = express.Router();

router.post("/user-register", createUser);

router.post("/user-login", login);

router.get("/users", getUsers);

router.get("/user/:accountNumber", getUserByAccountNumber);

router.put("/user/:accountNumber", updateUserByAccountNumber);

router.delete("/user/:accountNumber", deleteUserByAccountNumber);

router.post("/deposit", userDepositAmount);

router.post("/withdrawal", userwithdrawalAmount);

router.post("/apply-loan", userLoanApplication);

module.exports = router;
