import { Router } from 'express'
import usersController from "../controllers/users.controller.js";
import { authenticationToken } from '../middlewares/authenticate.middleware.js';


const router = Router();

router.route('/').get(usersController.getUsers).post(usersController.createUser);

router.route('/tasks').get(authenticationToken, usersController.getTodasTreas);

router.route('/:id')
    .get(authenticationToken, usersController.getUser)
    .put(authenticationToken, usersController.updateuser)
    .patch(authenticationToken, usersController.activateInactivate)
    .delete(authenticationToken, usersController.deleteUser);

router.route('/:id/tasks').get(authenticationToken, usersController.getTasks);


export default router;