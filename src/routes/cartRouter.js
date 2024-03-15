import { Router } from 'express';
import cartModel from '../models/cart.js';

const cartRouter = Router();

cartRouter.post('/', async (req, res) => {
  try {
    const message = await cartModel.create({ products: [] });
    res.status(201).send(message);
  } catch (e) {
    res
      .status(500)
      .send(`Error interno del servidor al crear carrito: ${error}`);
  }
});

cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findOne({ _id: cartId });
    res.status(200).send(cart);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al consultar carrito: ${error}`);
  }
});

cartRouter.post('/:cid/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    const cart = await cartModel.findById(cartId);

    const index = cart.products.findIndex(
      // id_prod se solicita en cart.js como id de referencia p/ conectar cart con el producto
      (product) => product.id_prod == productId
    );

    if (index != -1) {
      cart.products[index].quantity = quantity;
    } else {
      cart.products.push({ id_prod: productId, quantity: quantity });
    }

    const message = await cartModel.findByIdAndUpdate(cartId, cart);
    res.status(200).send(message);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al crear producto: ${error}`);
  }
});

export default cartRouter;
