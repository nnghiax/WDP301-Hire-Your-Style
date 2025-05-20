const StoreRequest = require('../model/StoreRequest')
const Store = require('../model/Store')
const User = require('../model/User')


const storeRequestController = {


    createStoreRequest: async (req, res) => {
        try {
            const { name, description, address, phone } = req.body
            const userId = req.userId

            const existing = await StoreRequest.findOne({
                userId,
                status: { $in: ['pending', 'approved'] }
            })

            if (existing) {
                return res.status(400).json({ message: 'You already submitted a request' })
            }

            const newRequest = new StoreRequest({
                userId,
                name,
                description,
                address,
                phone
            })

            await newRequest.save()
            return res.status(201).json({ message: 'Request submitted', data: newRequest })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    listStoreRequest: async (req, res) => {
        try {
            const request = await StoreRequest.find()
            return res.status(200).json({data: request})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    approveStoreRequest: async (req, res) => {
        try {
            const requestId = req.params.requestId
            const request = await StoreRequest.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: 'Request not found' });
            }

            if (request.status !== 'pending') {
                return res.status(400).json({ message: 'Request already processed' });
            }

            const newStore = new Store({
                userId: request.userId,
                name: request.name,
                description: request.description,
                address: request.address,
                phone: request.phone,
                isActive: true
            })
            await newStore.save()

            request.status = 'approved'
            await request.save()

            await User.findByIdAndUpdate(request.userId, { role: 'store_owner' }, { new: true })

            return res.status(200).json({ message: 'Approved and store created' })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    rejectStoreRequest: async (req, res) => {
        try {
            const requestId = req.params.requestId

            const request = await StoreRequest.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: 'Request not found' });
            }

            if (request.status !== 'pending') {
                return res.status(400).json({ message: 'Request already processed' });
            }

            request.status = 'rejected'
            await request.save()
            return res.status(200).json({ message: 'Request rejected' })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

}


module.exports = storeRequestController