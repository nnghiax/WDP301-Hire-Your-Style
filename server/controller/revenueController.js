const Rental = require("../model/Rental");
const Store = require("../model/Store");
const User = require("../model/User");

const revenueController = {
  getTotalRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({
          success: false,
          message: "You don't own any store or the store is inactive",
        });
      }

      const query = {
        "items.storeId": store._id,
        status: "completed",
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.find(query).populate("items.productId");

      const totalRevenue = rentals.reduce(
        (sum, rental) => sum + rental.totalAmount,
        0
      );

      return res.status(200).json({
        success: true,
        message: "Get total revenue successfully",
        data: {
          totalRevenue,
          currency: "VND",
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getRevenueDetails: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({
          success: false,
          message: "You don't own any store or the store is inactive",
        });
      }

      const query = {
        "items.storeId": store._id,
        status: "completed",
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.find(query)
        .populate("items.productId", "name price")
        .populate("userId", "name email");

      const revenueDetails = rentals.map((rental) => {
        const user = rental.userId ? {
          name: rental.userId.name,
          email: rental.userId.email,
        } : { name: "Unknown", email: "Unknown" };

        return {
          rentalId: rental._id,
          user: user,
          items: rental.items
            .filter((item) => item.storeId.toString() === store._id.toString())
            .map((item) => ({
              productName: item.productId.name,
              size: item.size,
              quantity: item.quantity,
              price: item.productId.price,
              subtotal: item.quantity * item.productId.price,
            })),
          totalAmount: rental.totalAmount,
          rentalDate: rental.rentalDate,
          returnDate: rental.returnDate,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get revenue details successfully",
        data: revenueDetails,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getDailyRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({
          success: false,
          message: "You don't own any store or the store is inactive",
        });
      }

      const query = {
        "items.storeId": store._id,
        status: "completed",
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.find(query);

      const dailyRevenue = rentals.reduce((acc, rental) => {
        const date = new Date(rental.rentalDate).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + rental.totalAmount;
        return acc;
      }, {});

      const result = Object.keys(dailyRevenue).map((date) => ({
        date,
        totalRevenue: dailyRevenue[date],
        currency: "VND",
      }));

      return res.status(200).json({
        success: true,
        message: "Get daily revenue successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getMonthlyRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({
          success: false,
          message: "You don't own any store or the store is inactive",
        });
      }

      const query = {
        "items.storeId": store._id,
        status: "completed",
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.find(query);

      const monthlyRevenue = rentals.reduce((acc, rental) => {
        const yearMonth = new Date(rental.rentalDate).toISOString().slice(0, 7);
        acc[yearMonth] = (acc[yearMonth] || 0) + rental.totalAmount;
        return acc;
      }, {});

      const result = Object.keys(monthlyRevenue).map((yearMonth) => ({
        yearMonth,
        totalRevenue: monthlyRevenue[yearMonth],
        currency: "VND",
      }));

      return res.status(200).json({
        success: true,
        message: "Get monthly revenue successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getQuarterlyRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({
          success: false,
          message: "You don't own any store or the store is inactive",
        });
      }

      const query = {
        "items.storeId": store._id,
        status: "completed",
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.find(query);

      const quarterlyRevenue = rentals.reduce((acc, rental) => {
        const date = new Date(rental.rentalDate);
        const year = date.getFullYear();
        const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
        const quarterKey = `${year}-${quarter}`;
        acc[quarterKey] = (acc[quarterKey] || 0) + rental.totalAmount;
        return acc;
      }, {});

      const result = Object.keys(quarterlyRevenue).map((quarterKey) => ({
        quarter: quarterKey,
        totalRevenue: quarterlyRevenue[quarterKey],
        currency: "VND",
      }));

      return res.status(200).json({
        success: true,
        message: "Get quarterly revenue successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getYearlyRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({
          success: false,
          message: "You don't own any store or the store is inactive",
        });
      }

      const query = {
        "items.storeId": store._id,
        status: "completed",
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.find(query);

      const yearlyRevenue = rentals.reduce((acc, rental) => {
        const year = new Date(rental.rentalDate).getFullYear().toString();
        acc[year] = (acc[year] || 0) + rental.totalAmount;
        return acc;
      }, {});

      const result = Object.keys(yearlyRevenue).map((year) => ({
        year,
        totalRevenue: yearlyRevenue[year],
        currency: "VND",
      }));

      return res.status(200).json({
        success: true,
        message: "Get yearly revenue successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getAdminMonthlyAndYearlyCommission: async (req, res) => {
    try {
      const admin = req.user;
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Access denied. Admin only." });
      }

      const stores = await Store.find({ isActive: true }).select("name _id");
      if (!stores || stores.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No active stores found" });
      }

      const storeIds = stores.map((s) => s._id);
      const query = {
        status: "completed",
        "items.storeId": { $in: storeIds },
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.aggregate([
        { $match: query },
        { $unwind: "$items" },
        { $match: { "items.storeId": { $in: storeIds } } },
        {
          $lookup: {
            from: "stores",
            localField: "items.storeId",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        { $unwind: "$storeInfo" },
        {
          $group: {
            _id: {
              storeId: "$items.storeId",
              storeName: "$storeInfo.name",
              month: {
                $dateToString: { format: "%Y-%m", date: "$rentalDate" },
              },
              year: { $dateToString: { format: "%Y", date: "$rentalDate" } },
            },
            commission: { $sum: { $multiply: ["$totalAmount", 0.1] } },
          },
        },
        {
          $group: {
            _id: "$_id.storeId",
            storeName: { $first: "$_id.storeName" },
            monthly: {
              $push: {
                month: "$_id.month",
                commission: "$commission",
              },
            },
            yearly: {
              $push: {
                year: "$_id.year",
                commission: "$commission",
              },
            },
          },
        },
      ]);

      const result = {};
      rentals.forEach((store) => {
        result[store._id] = {
          storeName: store.storeName,
          monthly: store.monthly.reduce((acc, m) => {
            acc[m.month] = (acc[m.month] || 0) + m.commission;
            return acc;
          }, {}),
          yearly: store.yearly.reduce((acc, y) => {
            acc[y.year] = (acc[y.year] || 0) + y.commission;
            return acc;
          }, {}),
        };
      });

      return res.status(200).json({
        success: true,
        message: "Admin monthly and yearly commission calculated per store.",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAdminMonthlyAndYearlyCommission:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getAdminWeeklyCommission: async (req, res) => {
    try {
      const admin = req.user;
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Access denied. Admin only." });
      }

      const stores = await Store.find({ isActive: true }).select("name _id");
      if (!stores || stores.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No active stores found" });
      }

      const storeIds = stores.map((s) => s._id);
      const query = {
        status: "completed",
        "items.storeId": { $in: storeIds },
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.aggregate([
        { $match: query },
        { $unwind: "$items" },
        { $match: { "items.storeId": { $in: storeIds } } },
        {
          $lookup: {
            from: "stores",
            localField: "items.storeId",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        { $unwind: "$storeInfo" },
        {
          $project: {
            storeId: "$items.storeId",
            storeName: "$storeInfo.name",
            rentalDate: "$rentalDate",
            totalAmount: "$totalAmount",
            year: { $year: "$rentalDate" },
            week: { $isoWeek: "$rentalDate" },
          },
        },
        {
          $group: {
            _id: {
              storeId: "$storeId",
              storeName: "$storeName",
              year: "$year",
              week: "$week",
            },
            commission: { $sum: { $multiply: ["$totalAmount", 0.1] } },
          },
        },
        {
          $group: {
            _id: "$_id.storeId",
            storeName: { $first: "$_id.storeName" },
            weekly: {
              $push: {
                week: {
                  $concat: [
                    { $toString: "$_id.year" }, // Chuyển year thành chuỗi
                    "-W",
                    { $toString: "$_id.week" }, // Chuyển week thành chuỗi
                  ],
                },
                commission: "$commission",
              },
            },
          },
        },
      ]);

      const result = {};
      rentals.forEach((store) => {
        result[store._id] = {
          storeName: store.storeName,
          weekly: store.weekly.reduce((acc, w) => {
            acc[w.week] = (acc[w.week] || 0) + w.commission;
            return acc;
          }, {}),
        };
      });

      return res.status(200).json({
        success: true,
        message: "Admin weekly commission calculated per store.",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAdminWeeklyCommission:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getDailyRevenueByStore: async (req, res) => {
    try {
      const admin = req.user;
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Access denied. Admin only." });
      }

      const stores = await Store.find({ isActive: true }).select("name _id");
      if (!stores || stores.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No active stores found" });
      }

      const storeIds = stores.map((s) => s._id);
      const query = {
        status: "completed",
        "items.storeId": { $in: storeIds },
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.aggregate([
        { $match: query },
        { $unwind: "$items" },
        { $match: { "items.storeId": { $in: storeIds } } },
        {
          $lookup: {
            from: "stores",
            localField: "items.storeId",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        { $unwind: "$storeInfo" },
        {
          $group: {
            _id: {
              storeId: "$items.storeId",
              storeName: "$storeInfo.name",
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$rentalDate" },
              },
            },
            totalRevenue: { $sum: "$totalAmount" },
            commission: { $sum: { $multiply: ["$totalAmount", 0.1] } },
          },
        },
        {
          $group: {
            _id: "$_id.storeId",
            storeName: { $first: "$_id.storeName" },
            daily: {
              $push: {
                date: "$_id.date",
                totalRevenue: "$totalRevenue",
                commission: "$commission",
              },
            },
          },
        },
     ]);

      const formattedResult = rentals.map((store) => ({
        storeName: store.storeName,
        daily: store.daily.map((d) => ({
          date: d.date,
          totalRevenue: d.totalRevenue,
          commission: d.commission,
          currency: "VND",
        })),
      }));

      return res.status(200).json({
        success: true,
        message: "Get daily revenue and commission by store successfully",
        data: formattedResult,
      });
    } catch (error) {
      console.error("Error in getDailyRevenueByStore:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getMonthlyRevenueByStore: async (req, res) => {
    try {
      const admin = req.user;
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Access denied. Admin only." });
      }

      const stores = await Store.find({ isActive: true }).select("name _id");
      if (!stores || stores.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No active stores found" });
      }

      const storeIds = stores.map((s) => s._id);
      const query = {
        status: "completed",
        "items.storeId": { $in: storeIds },
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.aggregate([
        { $match: query },
        { $unwind: "$items" },
        { $match: { "items.storeId": { $in: storeIds } } },
        {
          $lookup: {
            from: "stores",
            localField: "items.storeId",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        { $unwind: "$storeInfo" },
        {
          $group: {
            _id: {
              storeId: "$items.storeId",
              storeName: "$storeInfo.name",
              yearMonth: {
                $dateToString: { format: "%Y-%m", date: "$rentalDate" },
              },
            },
            totalRevenue: { $sum: "$totalAmount" },
            commission: { $sum: { $multiply: ["$totalAmount", 0.1] } },
          },
        },
        {
          $group: {
            _id: "$_id.storeId",
            storeName: { $first: "$_id.storeName" },
            monthly: {
              $push: {
                yearMonth: "$_id.yearMonth",
                totalRevenue: "$totalRevenue",
                commission: "$commission",
              },
            },
          },
        },
     ]);

      const formattedResult = rentals.map((store) => ({
        storeName: store.storeName,
        monthly: store.monthly.map((m) => ({
          yearMonth: m.yearMonth,
          totalRevenue: m.totalRevenue,
          commission: m.commission,
          currency: "VND",
        })),
      }));

      return res.status(200).json({
        success: true,
        message: "Get monthly revenue and commission by store successfully",
        data: formattedResult,
      });
    } catch (error) {
      console.error("Error in getMonthlyRevenueByStore:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getYearlyRevenueByStore: async (req, res) => {
    try {
      const admin = req.user;
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Access denied. Admin only." });
      }

      const stores = await Store.find({ isActive: true }).select("name _id");
      if (!stores || stores.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No active stores found" });
      }

      const storeIds = stores.map((s) => s._id);
      const query = {
        status: "completed",
        "items.storeId": { $in: storeIds },
      };
      if (req.query.startDate) {
        query.rentalDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.rentalDate = {
          ...query.rentalDate,
          $lte: new Date(req.query.endDate),
        };
      }

      const rentals = await Rental.aggregate([
        { $match: query },
        { $unwind: "$items" },
        { $match: { "items.storeId": { $in: storeIds } } },
        {
          $lookup: {
            from: "stores",
            localField: "items.storeId",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        { $unwind: "$storeInfo" },
        {
          $group: {
            _id: {
              storeId: "$items.storeId",
              storeName: "$storeInfo.name",
              year: { $dateToString: { format: "%Y", date: "$rentalDate" } },
            },
            totalRevenue: { $sum: "$totalAmount" },
            commission: { $sum: { $multiply: ["$totalAmount", 0.1] } },
          },
        },
        {
          $group: {
            _id: "$_id.storeId",
            storeName: { $first: "$_id.storeName" },
            yearly: {
              $push: {
                year: "$_id.year",
                totalRevenue: "$totalRevenue",
                commission: "$commission",
              },
            },
          },
        },
      ]);

      const formattedResult = rentals.map((store) => ({
        storeName: store.storeName,
        yearly: store.yearly.map((y) => ({
          year: y.year,
          totalRevenue: y.totalRevenue,
          commission: y.commission,
          currency: "VND",
        })),
      }));

      return res.status(200).json({
        success: true,
        message: "Get yearly revenue and commission by store successfully",
        data: formattedResult,
      });
    } catch (error) {
      console.error("Error in getYearlyRevenueByStore:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

module.exports = revenueController;