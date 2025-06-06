const User = require('../model/User')
const bcrypt = require('bcryptjs')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const authController = {

registerUser: async (req, res) => {
        try {
            const { name, email, password, confirmPassword, address } = req.body

            if (!name || !email || !password || !confirmPassword) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường' })
            }

            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Email không hợp lệ' });
            }

            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: 'Mật khẩu phải dài ít nhất 6 ký tự' })
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Mật khẩu không khớp' })
            }

            const hashdPassword = await argon2.hash(password)
            const newUser = new User({ 
                name, 
                email: normalizedEmail, 
                password: hashdPassword, 
                address: address || { 
                    street: '',
                    ward: '',
                    district: '',
                    city: ''
                }
            })
            await newUser.save()
            return res.status(201).json({ message: 'Đăng ký người dùng thành công' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
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

            const accessToken = await jwt.sign({userId: user._id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
            return res.status(200).json({message: 'Login successfully', user, accessToken})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = authController