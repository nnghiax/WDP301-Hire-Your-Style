const User = require("../model/User");

const userController = {
  countUser: async (req, res) => {
    try {
      const countUser = await User.countDocuments();
      return res.status(200).json({ count: countUser });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  listUser: async (req, res) => {
    try {
      const user = await User.find({ role: { $ne: "admin" } });
      const result = user.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        address: u.address,
        avatar:
          u.avatar ||
          "https://res.cloudinary.com/dh4vnrtg5/image/upload/v1747473243/avatar_user_orcdde.jpg",
      }));
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const id = req.userId;
      const { name, address, phone } = req.body;
      const avatar = req.file?.path;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updateFields = {};
      if (name !== undefined) updateFields.name = name;

      if (address !== undefined) {
        let addressData = address;

        if (typeof address === "string") {
          try {
            addressData = JSON.parse(address);
          } catch (e) {
            return res.status(400).json({ message: "Invalid address format" });
          }
        }

        const requiredFields = ["street", "ward", "district", "city"];
        const missingFields = requiredFields.filter(
          (field) => !addressData[field]
        );
        if (missingFields.length > 0) {
          return res
            .status(400)
            .json({
              message: `Missing address field(s): ${missingFields.join(", ")}`,
            });
        }

        updateFields.address = addressData;
      }

      if (phone !== undefined) {
        if (typeof phone !== "string") {
          return res.status(400).json({ message: "Phone must be a string" });
        }
        updateFields.phone = phone;
      }

      if (!avatar && !user.avatar) {
        updateFields.avatar =
          "https://res.cloudinary.com/dh4vnrtg5/image/upload/v1747473243/avatar_user_orcdde.jpg";
      } else if (avatar) {
        updateFields.avatar = avatar;
      }

      const updateProfile = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      return res
        .status(200)
        .json({ message: "Update profile successfully", data: updateProfile });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  getProfile: async (req, res) => {
    try {
      const id = req.userId;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        avatar:
          user.avatar ||
          "https://res.cloudinary.com/dh4vnrtg5/image/upload/v1747473243/avatar_user_orcdde.jpg",
      };
      return res.status(200).json({ data: userData });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  getProfileById: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        avatar:
          user.avatar ||
          "https://res.cloudinary.com/dh4vnrtg5/image/upload/v1747473243/avatar_user_orcdde.jpg",
      };
      return res.status(200).json({ data: userData });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = userController;
