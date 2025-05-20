const User = require('../model/User')
const bcrypt = require('bcryptjs')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const authController = {

    registerUser: async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body

            if (!name || !email || !password || !confirmPassword) {
                return res.status(400).json({ message: 'Please fill all fields' })
            }

            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email' });
            }

            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' })
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Password do not match' })
            }

            const hashdPassword = await argon2.hash(password)
            const newUser = new User({ name, email: normalizedEmail, password: hashdPassword })
            await newUser.save()
            return res.status(201).json({ message: 'Register user successfully' })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    loginUser: async (req, res) => {
        try {
            const {email, password} = req.body

            if(!email || !password){
                return res.status(400).json({message: 'Please fill all fields'})
            }

            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({message: 'Email or password is incorrect'})
            }

            const validPassword = await argon2.verify(user.password, password)
            if(!validPassword){
                return res.status(400).json({message: 'Email or password is incorrect'})
            }

            const accessToken = await jwt.sign({userId: user._id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
            return res.status(200).json({message: 'Login successfully', user, accessToken})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = authController