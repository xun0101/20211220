import express from 'express'
import { createpro, editpro, deletpro, getpro, getpro2 } from '../controllers/products.js'

const router = express.Router()

router.post('/', createpro)
router.patch('/:id', editpro)
router.delete('/:id', deletpro)
router.get('/', getpro)
router.get('/:id', getpro2)
// router.get('/', getpro3)

export default router
