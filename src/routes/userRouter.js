import { Router } from 'express';
import { userModel } from '../models/user.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send('Error al consultar usuarios: ', e);
  }
});

userRouter.post('/', async (req, res) => {
  try {
    const { name, lastname, mail, age, password } = req.body;
    const result = await userModel.create({
      name,
      lastname,
      mail,
      age,
      password,
    });
    res.status(201).send(result);
  } catch (e) {
    res.status(500).send('Error al crear usuarios: ', e);
  }
});

export default userRouter;
