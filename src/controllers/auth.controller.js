import { User } from "../models/users.js";
import logger from "../logs/logger.js";
import { comparar } from "../common/bcrypt.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'El usuario ingresado, no fue encontrado' });
        }
        if (!(await comparar(password, user.password))) {
            return res.status(403).json({ message: 'El usuario ingresado cuenta con autorizacion' });
        }
        const secret = process.env.JWT_SECRET
        const segundos = process.env.JWT_EXPIRES_SECONDS
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: eval(segundos) });
        res.json({ token });
    } catch (error) {

        logger.error('Error en login detectado. ' + error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export default {
    login,
}