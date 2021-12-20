import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import usersRoute from './routes/users.js'
import productsRoute from './routes/products.js'

mongoose.connect(process.env.DB_URL)

const app = express()

app.use(express.json())

// 處理上一個 middleware 的錯誤。只有發生錯誤時才會進來
// function 一定要放四個東西
// error = 發生的錯誤
// next = 繼續往下走
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '格式錯誤' })
})

// 把進到 /users 路徑的請求給 routes/users.js 處理
app.use('/users', usersRoute)
app.use('/products', productsRoute)

// 如果進來的路徑錯誤，顯示自訂的錯誤訊息
// *代表所有
app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

// 保險起見，最後處理預期外的狀況
app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send({ success: false, message: '伺服器錯誤' })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Sever started')
})
