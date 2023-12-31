const User = require("../models/userSchema");
const Deposit = require("../models/depositSchema");
const UserLoan = require("../models/userLoanSchema");
const Withdrawal = require("../models/withdrawalSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET_KEY = "Pass@123";

const createUser = async (req, res) => {
  console.log(req?.body);
  try {
    let uniqueAccountNumber;
    let isUnique = false;

    const branches = ["hyderabad", "bangalore", "delhi", "chennai", "mumbai"];
    function logRandomBranch() {
      const randomIndex = Math.floor(Math.random() * branches.length);
      return branches[randomIndex];
    }
    while (!isUnique) {
      uniqueAccountNumber = Math.floor(
        10000000000 + Math.random() * 90000000000
      ).toString();
      const existingUser = await User.findOne({
        accountNumber: uniqueAccountNumber,
        branchName: logRandomBranch,
      });
      if (!existingUser) {
        isUnique = true;
      }
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newData = {
      ...req.body,
      accountNumber: uniqueAccountNumber,
      password: hashedPassword,
      userType: "user",
    };

    const user = new User(newData);
    await user.save();
    const token = jwt.sign(
      { email: newData.email, accountNumber: newData.accountNumber },
      JWT_SECRET_KEY
    );
    res.status(201).json({ token });
  } catch (error) {
    console.log(error, "vivek");
    res.status(500).json({ name: "Internal Server Error", error });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newData = {
      ...req.body,
      password: hashedPassword,
      userType: "admin",
    };

    const user = new User(newData);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error, "vivek");
    res.status(500).json({ name: "Internal Server Error", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req?.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Password is wrong!" });
    }

    const token = jwt.sign(
      { email: user.email, accountNumber: user.accountNumber },
      JWT_SECRET_KEY
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userProfile = async (req, res) => {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    const user = await User.findOne({ email: decoded?.email });

    if (!user) {
      return res.status(401).json({ message: "Password is wrong!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: "user" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserByAccountNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const user = await User.findOne({ accountNumber });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUserByAccountNumber = async (req, res) => {
  try {
    const { accountNumber } = req.body?.data;
    const updatedUser = await User.findOneAndUpdate(
      { accountNumber },
      req.body?.data,
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUserByAccountNumber = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;
    const deletedUser = await User.findOneAndDelete({ accountNumber });
    if (deletedUser) {
      res.status(200).json(deletedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userDepositAmount = async (req, res) => {
  try {
    const { accountNumber, depositAmount, depositorMobile, accountType } =
      req.body;
    const deposit = new Deposit({
      accountNumber,
      depositAmount,
      depositorMobile,
      accountType,
    });
    await deposit.save();
    res.status(201).json(deposit);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userwithdrawalAmount = async (req, res) => {
  try {
    const { accountNumber, withdrawAmount, mobileNumber } = req.body;
    const withdrawal = new Withdrawal({
      accountNumber,
      withdrawAmount,
      mobileNumber,
    });
    await withdrawal.save();
    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userLoanApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      country,
      pinCode,
      loanType,
      loanAmount,
      loanDuration,
      loanApplyDate,
      branchName,
      accountNumber,
      ifsc,
      course,
      courseFee,
      annualIncome,
      experience,
      totalExperience,
      companyName,
      designation,
      fatherName,
      fatherOccupation,
      rateOfInterest,
    } = req.body;

    const userLoan = new UserLoan({
      firstName,
      lastName,
      address,
      city,
      state,
      country,
      pinCode,
      loanType,
      loanAmount,
      loanDuration,
      loanApplyDate,
      branchName,
      accountNumber,
      ifsc,
      course,
      courseFee,
      annualIncome,
      experience,
      totalExperience,
      companyName,
      designation,
      fatherName,
      fatherOccupation,
      rateOfInterest,
    });

    await userLoan.save(); // Save the loan details to the database

    res.status(201).json({ message: "Loan application created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLoans = async (req, res) => {
  try {
    const loan = await UserLoan.find();
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserLoan = async (req, res) => {
  const { accountNumber } = req.params;
  try {
    const loans = await UserLoan.findOne({ accountNumber });
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userRequests = async (req, res) => {
  try {
    console.log(req.body);
    res.send("hello");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserByAccountNumber,
  updateUserByAccountNumber,
  deleteUserByAccountNumber,
  userDepositAmount,
  userwithdrawalAmount,
  userLoanApplication,
  login,
  userProfile,
  createAdminUser,
  getLoans,
  userRequests,
  getUserLoan,
};
