import products from '../models/products.js'

export const createpro = async (req, res) => {
  try {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      res.status(400).send({ success: false, message: '格式錯誤' })
      return
    }
    const result = (await products.create(req.body))
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '商品名稱或商品說明重複' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editpro = async (req, res) => {
  try {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      res.status(400).send({ success: false, message: '格式錯誤' })
      return
    }

    const result = await products.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
    if (result) {
      delete result.password
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '找不到' })
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '商品名稱或商品說明重複' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const deletpro = async (req, res) => {
  try {
    await products.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getpro = async (req, res) => {
  try {
    const query = {
      $and: [],
      $or: [
        { name: { $in: [] } },
        { description: { $in: [] } }
      ]
    }

    if (req.query.price_gte) {
      if (isNaN(req.query.price_gte)) {
        res.status(400).send({ success: false, message: '格式錯誤' })
        return
      } else {
        query.$and.push({ price: { $gte: parseInt(req.query.price_gte) } })
      }
    }

    if (req.query.price_lte) {
      if (isNaN(req.query.price_lte)) {
        res.status(400).send({ success: false, message: '格式錯誤' })
        return
      } else {
        query.$and.push({ price: { $lte: parseInt(req.query.price_lte) } })
      }
    }

    if (req.query.keywords) {
      // 組成查詢語法
      // {
      //   $or: [
      //     {
      //       name: {
      //         $in: [/韭菜/i,/水餃/i]
      //       }
      //     },
      //     {
      //       description: {
      //         $in: [/韭菜/i,/水餃/i]
      //       }
      //     }
      //   ]
      // }
      const keywords = req.query.keywords.split(',').map(keyword => {
        return new RegExp(keyword, 'i')
      })
      query.$or[0].name.$in = keywords
      query.$or[1].description.$in = keywords
    } else {
      // 如果沒有關鍵字，把$or清空，否則找不到東西
      delete query.$or
    }

    if (query.$and.length === 0) {
      delete query.$and
    }

    const result = await products.find(query)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getpro2 = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
