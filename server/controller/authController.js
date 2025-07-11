const User = require('../model/User')
const bcrypt = require('bcryptjs')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const authController = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password, confirmPassword, address, phone } = req.body

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
                },
                phone: phone || ''
            })
            await newUser.save()
            return res.status(201).json({ message: 'Đăng ký người dùng thành công' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường' })
            }

            const user = await User.findOne({ email: email.trim().toLowerCase() })
            if (!user) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' })
            }

            const validPassword = await argon2.verify(user.password, password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' })
            }

            const accessToken = await jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            return res.status(200).json({ message: 'Đăng nhập thành công', user, accessToken })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword, confirmNewPassword } = req.body
            const userId = req.userId // Sử dụng req.userId từ middleware

            if (!oldPassword || !newPassword || !confirmNewPassword) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường' })
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'Mật khẩu mới phải dài ít nhất 6 ký tự' })
            }

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'Mật khẩu mới không khớp' })
            }

            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' })
            }

            const validPassword = await argon2.verify(user.password, oldPassword)
            if (!validPassword) {
                return res.status(400).json({ message: 'Mật khẩu cũ không đúng' })
            }

            const hashedPassword = await argon2.hash(newPassword)
            user.password = hashedPassword
            await user.save()

            return res.status(200).json({ message: 'Thay đổi mật khẩu thành công' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            if (!email) {
                return res.status(400).json({ message: 'Vui lòng cung cấp email' })
            }

            const user = await User.findOne({ email: email.trim().toLowerCase() })
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy email' })
            }

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

            user.resetPasswordToken = verificationCode
            user.resetPasswordExpires = Date.now() + 3600000 // 1 giờ
            await user.save()

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Mã xác thực đặt lại mật khẩu',
                text: `Mã xác thực của bạn là: ${verificationCode}. Mã này có hiệu lực trong 1 giờ.`
            }

            await transporter.sendMail(mailOptions)
            return res.status(200).json({ message: 'Mã xác thực đã được gửi đến email của bạn' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { email, verificationCode, newPassword, confirmNewPassword } = req.body

            if (!email || !verificationCode || !newPassword || !confirmNewPassword) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường' })
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'Mật khẩu mới phải dài ít nhất 6 ký tự' })
            }

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'Mật khẩu mới không khớp' })
            }

            const user = await User.findOne({
                email: email.trim().toLowerCase(),
                resetPasswordToken: verificationCode,
                resetPasswordExpires: { $gt: Date.now() }
            })

            if (!user) {
                return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' })
            }

            const hashedPassword = await argon2.hash(newPassword)
            user.password = hashedPassword
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined
            await user.save()

            return res.status(200).json({ message: 'Đặt lại mật khẩu thành công' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = authController