const StoreRequest = require("../model/StoreRequest");
const Store = require("../model/Store");
const User = require("../model/User");
const nodemailer = require("nodemailer");

const storeRequestController = {
  createStoreRequest: async (req, res) => {
    try {
      const { name, description, address, phone } = req.body;
      const userId = req.userId;

      const existing = await StoreRequest.findOne({
        userId,
        status: { $in: ["pending", "approved"] },
      });

      if (existing) {
        return res
          .status(400)
          .json({ message: "You already submitted a request" });
      }

      const newRequest = new StoreRequest({
        userId,
        name,
        description,
        address,
        phone,
      });

      await newRequest.save();
      return res
        .status(201)
        .json({ message: "Request submitted", data: newRequest });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  listStoreRequest: async (req, res) => {
    try {
      const request = await StoreRequest.find().populate("userId");
      const result = request.map((req) => {
        return {
          _id: req._id,
          name: req.userId.name,
          email: req.userId.email,
          store: req.name,
          description: req.description,
          address: req.address,
          phone: req.phone,
          status: req.status,
          createdAt: req.createdAt,
        };
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  detailRequest: async (req, res) => {
    try {
      const requestId = req.params.requestId;
      const request = await StoreRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      return res.status(200).json({ data: request });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  approveStoreRequest: async (req, res) => {
    try {
      const requestId = req.params.requestId;
      const request = await StoreRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({ message: "Request already processed" });
      }

      const newStore = new Store({
        userId: request.userId,
        name: request.name,
        description: request.description,
        address: request.address,
        phone: request.phone,
        isActive: true,
      });
      await newStore.save();

      request.status = "approved";
      await request.save();

      await User.findByIdAndUpdate(
        request.userId,
        { role: "store_owner" },
        { new: true }
      );

      const user = await User.findById(request.userId);
      if (user?.email) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Cửa hàng của bạn đã được phê duyệt",
          text: `Xin chúc mừng, yêu cầu đăng ký cửa hàng "${request.name}" của bạn đã được phê duyệt. Bạn có thể bắt đầu đăng sản phẩm ngay!`,
        };

        await transporter.sendMail(mailOptions);
      }

      return res.status(200).json({ message: "Approved and store created" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  rejectStoreRequest: async (req, res) => {
    try {
      const requestId = req.params.requestId;
      const request = await StoreRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({ message: "Request already processed" });
      }

      request.status = "rejected";
      await request.save();

      const user = await User.findById(request.userId);
      if (user?.email) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Yêu cầu đăng ký cửa hàng bị từ chối",
          text: `Rất tiếc, yêu cầu đăng ký cửa hàng "${request.name}" của bạn đã bị từ chối. Vui lòng kiểm tra lại thông tin hoặc liên hệ hỗ trợ để biết thêm chi tiết.`,
        };

        await transporter.sendMail(mailOptions);
      }

      return res.status(200).json({ message: "Request rejected" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  deleteRequest: async (req, res) => {
    try {
      const requestId = req.params.requestId;
      await StoreRequest.findByIdAndDelete(requestId);
      return res.status(200).json({ message: "Delete successfully" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = storeRequestController;
