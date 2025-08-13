const userModel = require("../models/User.js");



const handleAddBank = async (req, res) => {
  const { userId, accountNumber, ifscCode, bankName, accountHolderName } =
    req.body;

  try {
    if (
      !userId ||
      !accountNumber ||
      !ifscCode ||
      !bankName ||
      !accountHolderName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate account number (should be 9-18 digits)
    if (!/^\d{9,18}$/.test(accountNumber.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid account number. Must be 9-18 digits" });
    }

    // Validate IFSC code format (4 letters + 7 characters)
    if (!/^[A-Z]{4}[A-Z0-9]{7}$/.test(ifscCode.trim().toUpperCase())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid IFSC code format" });
    }

    // Validate account holder name (only letters and spaces, 2-50 chars)
    if (!/^[A-Za-z\s]{2,50}$/.test(accountHolderName.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid account holder name. Only letters and spaces allowed (2-50 characters)" });
    }

    // check user exist or not

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    // check is bank already added or not

    if (user.bankAccount) {
      return res
        .status(409)
        .json({ success: false, message: "bank account already added" });
    }

    user.bankAccount = {
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      bankName: bankName.trim(),
    };

    await user.save();
    return res
      .status(200)
      .json({ 
        success: true, 
        message: "Bank account added successfully",
        bankAccount: {
          accountHolderName: user.bankAccount.accountHolderName,
          bankName: user.bankAccount.bankName,
          accountNumber: `****${user.bankAccount.accountNumber.slice(-4)}`
        }
      });
  } catch (err) {
    console.error('Add bank error:', err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const handleAddUpi = async (req, res) => {
  const { userId, upiId, accountHolderName } = req.body;
  try {
    if (!userId || !upiId || !accountHolderName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid UPI ID format" });
    }

    // Validate account holder name
    if (!/^[A-Za-z\s]{2,50}$/.test(accountHolderName.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid account holder name. Only letters and spaces allowed (2-50 characters)" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.upiId) {
      return res
        .status(409)
        .json({ success: false, message: "UPI ID already added" });
    }
    
    user.upiId = {
      upi: upiId.trim().toLowerCase(),
      accountHolderName: accountHolderName.trim(),
    };
    await user.save();
    
    return res
      .status(200)
      .json({ 
        success: true, 
        message: "UPI ID added successfully",
        upiData: {
          upi: maskUpiId(user.upiId.upi),
          accountHolderName: user.upiId.accountHolderName
        }
      });
  } catch (err) {
    console.error('Add UPI error:', err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const handleUpdateBank = async (req, res) => {
  const { userId, accountNumber, ifscCode, bankName, accountHolderName } =
    req.body;

  try {
    if (
      !userId ||
      !accountNumber ||
      !ifscCode ||
      !bankName ||
      !accountHolderName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate account number (should be 9-18 digits)
    if (!/^\d{9,18}$/.test(accountNumber.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid account number. Must be 9-18 digits" });
    }

    // Validate IFSC code format (4 letters + 7 characters)
    if (!/^[A-Z]{4}[A-Z0-9]{7}$/.test(ifscCode.trim().toUpperCase())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid IFSC code format" });
    }

    // Validate account holder name (only letters and spaces, 2-50 chars)
    if (!/^[A-Za-z\s]{2,50}$/.test(accountHolderName.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid account holder name. Only letters and spaces allowed (2-50 characters)" });
    }

    // check user exist or not
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // check if bank account exists
    if (!user.bankAccount) {
      return res
        .status(400)
        .json({ success: false, message: "No bank account found to update" });
    }

    user.bankAccount = {
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      bankName: bankName.trim(),
    };

    await user.save();
    return res
      .status(200)
      .json({ 
        success: true, 
        message: "Bank account updated successfully",
        bankAccount: {
          accountHolderName: user.bankAccount.accountHolderName,
          bankName: user.bankAccount.bankName,
          accountNumber: `****${user.bankAccount.accountNumber.slice(-4)}`
        }
      });
  } catch (err) {
    console.error('Update bank error:', err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const handleUpdateUpi = async (req, res) => {
  const { userId, upiId, accountHolderName } = req.body;
  try {
    if (!userId || !upiId || !accountHolderName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid UPI ID format" });
    }

    // Validate account holder name
    if (!/^[A-Za-z\s]{2,50}$/.test(accountHolderName.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid account holder name. Only letters and spaces allowed (2-50 characters)" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (!user.upiId) {
      return res
        .status(400)
        .json({ success: false, message: "No UPI ID found to update" });
    }
    
    user.upiId = {
      upi: upiId.trim().toLowerCase(),
      accountHolderName: accountHolderName.trim(),
    };

    await user.save();
    
    return res
      .status(200)
      .json({ 
        success: true, 
        message: "UPI ID updated successfully",
        upiData: {
          upi: maskUpiId(user.upiId.upi),
          accountHolderName: user.upiId.accountHolderName
        }
      });
  } catch (err) {
    console.error('Update UPI error:', err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Helper functions
function maskUpiId(upiId) {
  if (!upiId) return upiId;

  const atIndex = upiId.indexOf("@");
  if (atIndex === -1) return maskString(upiId, 4);

  const namePart = upiId.substring(0, atIndex);
  const domainPart = upiId.substring(atIndex);

  const maskedName =
    namePart.length > 4
      ? "*".repeat(namePart.length - 4) + namePart.slice(-4)
      : namePart;

  return maskedName + domainPart;
}

function maskString(str, visibleChars = 4) {
  if (!str || str.length <= visibleChars) return str;
  return "*".repeat(str.length - visibleChars) + str.slice(-visibleChars);
}



module.exports = {
  handleAddBank,
  handleAddUpi,
  handleUpdateBank,
  handleUpdateUpi,
};
