import mongoose from 'mongoose'
import md5 from 'md5'
import validator from 'validator'

const Schema = mongoose.Schema

const userSchema = new Schema({
  account: {
    type: String,
    minlength: [4, '帳號字數為 4 到 20 個字'],
    maxlength: [20, '帳號字數為 4 到 20 個字'],
    required: [true, '缺少帳號欄位'],
    unique: true
  },
  password: {
    type: String,
    required: [true, '缺少密碼欄位']
  },
  email: {
    type: String,
    unique: true,
    required: [true, '缺少信箱欄位'],
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  }
}, { versionKey: false })

userSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidationError({ message: '密碼字數為 4 到 20 個字' }))
      next(error)
      return
    }
  }
  next()
})

userSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.password) {
    if (this._update.password >= 4 && this._update.password <= 20) {
      this._update.password = md5(this._update.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidationError({ message: '密碼字數為 4 到 20 個字' }))
      next(error)
      return
    }
  }
  next()
})

const users = mongoose.model('users', userSchema)

export default users
