const Rental = require('../model/Rental');
const Store = require('../model/Store');

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
          currency: 'USD' 
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
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
};

module.exports = revenueController;