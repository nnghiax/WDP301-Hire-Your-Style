const User = require('../model/User')



const userController = {

    countUser: async (req, res) => {
        try {
            const countUser = await User.countDocuments();
            return res.status(200).json({ count: countUser })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    listUser: async (req, res) => {
        try {
            const user = await User.find({ role: { $ne: 'admin' } });
            const result = user.map((u) => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                address: u.address,
                avatar: u.avatar
            }));
            return res.status(200).json({ data: result });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    updateProfile: async (req, res) => {
        try {
            const id = req.userId;
            const { name, address } = req.body;
            const avatar = req.file?.path;

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const updateFields = {};
            if (name !== undefined) updateFields.name = name;

            if (address !== undefined) {
                let addressData = address;

                if (typeof address === 'string') {
                    try {
                        addressData = JSON.parse(address);
                    } catch (e) {
                        return res.status(400).json({ message: 'Invalid address format' });
                    }
                }

                const requiredFields = ['street', 'ward', 'district', 'city'];
                const missingFields = requiredFields.filter(field => !addressData[field]);
                if (missingFields.length > 0) {
                    return res.status(400).json({ message: `Missing address field(s): ${missingFields.join(', ')}` });
                }

                updateFields.address = addressData;
            }

            if (avatar) updateFields.avatar = avatar;

            const updateProfile = await User.findByIdAndUpdate(id, updateFields, { new: true });

            return res.status(200).json({ message: 'Update profile successfully', data: updateProfile });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


}


module.exports = userController