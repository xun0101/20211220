import mongoose from 'mongoose'

const Schema = mongoose.Schema

const proSchema = new Schema({
  name: {
    type: String,
    minlength: [1, '商品名稱為 1 到 20 個字'],
    maxlength: [20, '商品名稱為 1 到 20 個字'],
    required: [true, '缺少商品欄位'],
    unique: true
  },
  price: {
    type: Number,
    minlength: [0],
    required: [true, '缺少價格欄位']
    // unique: true
  },
  description: {
    type: String,
    minlength: [5, '商品說明為 5 到 200 個字'],
    maxlength: [200, '商品說明為 5 到 200 個字'],
    required: [true, '缺少說明欄位'],
    unique: true
  },
  quantity: {
    type: Number,
    minlength: [1, '商品庫存為 1 到 200 個庫存量'],
    maxlength: [2000, '商品庫存為 1 到 200 個庫存量'],
    required: [true, '缺少庫存欄位']
    // unique: true
  }
})

const products = mongoose.model('products', proSchema)

export default products
