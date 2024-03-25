import { Router } from 'express';
import { userModel } from '../models/user.js';

const sessionRouter = Router();

// Loguear un usuario ya registrado
sessionRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca el usuario en la DB
    const user = await userModel.findOne({ email: email }).lean();

    // Si usuario y contraseña existen, se devuelve el login iniciado
    if (user && password == user.password) {
      req.session.email = email;

      // Login Admin
      if (user.rol == 'Admin') {
        req.session.admin = true;
        res.status(200).send('Administrador logueado correctamente');
      } else {
        res.status(200).send('Usuario logueado correctamente');
      }
    } else {
      res.status(401).send('Usuario o contraseña no validos');
    }
  } catch (e) {
    res.status(500).send('Error al loguear usuario', e);
  }
});

// Registrar un usuario
sessionRouter.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;
    console.log(email);
    const findUser = await userModel.findOne({ email: email });
    if (findUser) {
      res.status(400).send('Ya existe un usuario con este mail');
    } else {
      await userModel.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        password: password,
      });
      res.status(200).send('Usuario creado correctamente');
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Error al registrar usuario', e);
  }
});

sessionRouter.get('/logout', (req, res) => {
  req.session.destroy(function (e) {
    if (e) {
      console.log(e);
    } else {
      res.status(200).redirect('/');
    }
  });
});

export default sessionRouter;
