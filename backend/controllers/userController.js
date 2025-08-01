const userModel = require("../models/User.js");



const handleAddBank = async (req, res) => {
  const { userId, accountNumber, ifscCode, bankName, accountHolderName } =
    req.body;

  try {
    if (
      !userId ||
      !accountHolderName ||
      !ifscCode ||
      !bankName ||
      !accountHolderName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "missing fields" });
    }

    // check user exist or not

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    // check is bank already added or not

    if (user.isBankAdded) {
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
    user.isBankAdded = true;

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Bank account added successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const handleAddUpi = async (req, res) => {
  const { userId, upiId, accountHolderName } = req.body;
  try {
    if (!userId || !upiId || !accountHolderName) {
      return res.json({ success: false, message: "missing credentials" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.staus(400).json({ success: false, message: "user not found" });
    }
    if (user.isUpiAdded) {
      return res
        .status(409)
        .json({ success: false, message: "upi id already added" });
    }
    user.upiId = {
      upi: upiId,
      accountHolderName,
    };

    user.isUpiAdded = true;
    await user.save();
    return res.json({ success: true, message: "upi id added successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
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
};
