import express from 'express';
import {register,login,updateUser} from '../controler/authControler.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateuser').patch(updateUser);

export default router;