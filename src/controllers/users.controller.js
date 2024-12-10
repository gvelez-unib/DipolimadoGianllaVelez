import { User } from "../models/users.js";
import { Task } from "../models/tasks.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";

async function getUsers(reg, res) {
    try {
        const users = await User.findAll({
            attributes: [
                'id', 'username', 'password', 'status'
            ],
            order: [['id', 'DESC']],
            where: {
                status: Status.ACTIVE,
            }
        });
        logger.info('resultado' + users);
        res.json(users);
    } catch (error) {
        logger.error('No se encotro a los usuarios ' + error);
        res.status(500).json({ message: 'Server error' });
    }
}
async function createUser(reg, res) {
    try {
        const { username, password } = reg.body;
        const user = await User.create({ username, password });
        res.json(user);
    } catch (error) {
        logger.error('Se encontro un error al crear un usuario. ' + error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getUser(reg, res) {
    try {
        const user = await User.findByPk(reg.params.id, {
            attributes: [
                'username', 'status'
            ],
        });
        if (!user) {
            return res.status(404).json({ message: 'NO se encontro al usuario' });
        }
        res.json(user);
    } catch (error) {

        logger.error('Error al obtener el usuario solicitado ' + error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function updateuser(req, res) {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        if (!username || !password) return res.status(400).json({ message: 'Favor complete lo compos obligatorios' });
        const user = await User.update(
            {
                username,
                password,
            },
            {
                where: {
                    id
                },
            }
        )
        res.json(user);
    } catch (error) {
        logger.error('Error al actualizar los datos del usuario ' + error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

async function activateInactivate(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (!status) return res.status(400).json({ message: 'Status requerido' });
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'El usuario no fue encontrado' });
        }
        if (user.status === status) {
            return res.status(400).json({ message: 'Es el mismo estado' });
        }
        user.status = status;
        await user.save();
        res.json(user);
    } catch (error) {
        logger.error('Se encontro un error al actualizar los datos del usuario ' + error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'El usuario no se encontro' });
        }
        await user.destroy();
        res.json({ message: 'Usuario, eliminado con exito' });
    } catch (error) {
        logger.error('error al eliminar usuario ' + error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getTasks(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            include: [{
                model: Task,
                attributes: ['name', 'done'],
                /* where: {
                    'done': true
                }, */
            }],
            where: { id },
        });
        res.json(user);
    } catch (error) {
        logger.error('No se encontraron tareas de usuario soliciato ' + error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getTodasTreas(req, res) {
    try {
        const user = await User.findAll({
            attributes: ['username'],
            include: [{
                model: Task,
                attributes: ['name', 'done'],
                /* where: {
                    'done': true
                }, */
            }],
        });
        res.json(user);
    } catch (error) {
        logger.error('Error, no se encuentran tareas del usuario ' + error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
export default {
    getUsers,
    createUser,
    getUser,
    updateuser,
    activateInactivate,
    deleteUser,
    getTasks,
    getTodasTreas
}