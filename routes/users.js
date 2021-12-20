import express from 'express'
import { createUser, getUsers, editUser, deleteUser } from '../controllers/users.js'

const router = express.Router()

router.post('/', createUser)
router.get('/', getUsers)
router.patch('/:id', editUser)
router.delete('/:id', deleteUser)

export default router
