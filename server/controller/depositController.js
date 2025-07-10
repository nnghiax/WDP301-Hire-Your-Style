const Rental = require("../model/Rental");
const User = require("../model/User");

exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Rental.aggregate([
      {
        $match: { depositAmount: { $gt: 0 } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          depositAmount: 1,
          rentalDate: 1,
          returnDate: 1,
          status: 1,
          createdAt: 1,
          name: "$userInfo.name",
          phone: "$userInfo.phone",
          address: "$userInfo.address",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Deposit rentals fetched successfully.",
      data: deposits,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
