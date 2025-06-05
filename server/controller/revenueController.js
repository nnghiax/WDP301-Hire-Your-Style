const Rental = require('../model/Rental');
const Store = require('../model/Store');
const User = require('../model/User');
const revenueController = {
  
  getTotalRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({ success: false, message: "You don't own any store or the store is inactive" });
      }

      const rentals = await Rental.find({ 
        storeId: store._id, 
        status: 'completed' 
      }).populate('items.productId');

      const totalRevenue = rentals.reduce((sum, rental) => sum + rental.totalAmount, 0);

      return res.status(200).json({ 
        success: true,
        message: 'Get total revenue successfully', 
        data: {
          totalRevenue,
          currency: 'VND' 
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  getRevenueDetails: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({ success: false, message: "You don't own any store or the store is inactive" });
      }

      const rentals = await Rental.find({ 
        storeId: store._id, 
        status: 'completed' 
      })
        .populate('items.productId', 'name price')
        .populate('userId', 'name email');

      const revenueDetails = rentals.map(rental => ({
        rentalId: rental._id,
        user: {
          name: rental.userId.name,
          email: rental.userId.email,
        },
        items: rental.items.map(item => ({
          productName: item.productId.name,
          size: item.size,
          quantity: item.quantity,
          price: item.productId.price,
          subtotal: item.quantity * item.productId.price,
        })),
        totalAmount: rental.totalAmount,
        rentalDate: rental.rentalDate,
        returnDate: rental.returnDate,
      }));

      return res.status(200).json({ 
        success: true,
        message: 'Get revenue details successfully', 
        data: revenueDetails 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  getDailyRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({ success: false, message: "You don't own any store or the store is inactive" });
      }

      const rentals = await Rental.find({ 
        storeId: store._id, 
        status: 'completed' 
      });

      const dailyRevenue = rentals.reduce((acc, rental) => {
        const date = new Date(rental.rentalDate).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + rental.totalAmount;
        return acc;
      }, {});

      const result = Object.keys(dailyRevenue).map(date => ({
        date,
        totalRevenue: dailyRevenue[date],
        currency: 'VND'
      }));

      return res.status(200).json({ 
        success: true,
        message: 'Get daily revenue successfully', 
        data: result 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  getMonthlyRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({ success: false, message: "You don't own any store or the store is inactive" });
      }

      const rentals = await Rental.find({ 
        storeId: store._id, 
        status: 'completed' 
      });

      const monthlyRevenue = rentals.reduce((acc, rental) => {
        const yearMonth = new Date(rental.rentalDate).toISOString().slice(0, 7);
        acc[yearMonth] = (acc[yearMonth] || 0) + rental.totalAmount;
        return acc;
      }, {});

      const result = Object.keys(monthlyRevenue).map(yearMonth => ({
        yearMonth,
        totalRevenue: monthlyRevenue[yearMonth],
        currency: 'VND'
      }));

      return res.status(200).json({ 
        success: true,
        message: 'Get monthly revenue successfully', 
        data: result 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  getYearlyRevenue: async (req, res) => {
    try {
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({ success: false, message: "You don't own any store or the store is inactive" });
      }

      const rentals = await Rental.find({ 
        storeId: store._id, 
        status: 'completed' 
      });

      const yearlyRevenue = rentals.reduce((acc, rental) => {
        const year = new Date(rental.rentalDate).getFullYear().toString();
        acc[year] = (acc[year] || 0) + rental.totalAmount;
        return acc;
      }, {});

      const result = Object.keys(yearlyRevenue).map(year => ({
        year,
        totalRevenue: yearlyRevenue[year],
        currency: 'VND'
      }));

      return res.status(200).json({ 
        success: true,
        message: 'Get yearly revenue successfully', 
        data: result 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

module.exports = revenueController;