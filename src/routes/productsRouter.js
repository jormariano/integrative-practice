// Clase 8 - 11'
import { Router } from 'express';
import productModel from '../models/product.js';

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  try {
    // limit entre {} porque puede existir mas de un elemento para buscar. http://localhost:8000/products?limit=2
    const { limit } = req.query;

    // .lean() es para pasar a json. Cambie productManager.getProduct(); por:
    const prods = await productModel.find().lean();

    let limits = parseInt(limit);

    if (!limits) {
      limits = prods.lenght;
    }

    /* el metodo slice() se utiliza para extraer una porción de un array y devolverla como un nuevo array.
    No modifica el array original, devuelve un nuevo array que contiene los elementos seleccionados. 
    Acepta dos parámetros, inicio y fin (puede ser undefined), para indicar los índices desde y hasta los cuales extraer los elementos.
    El valor inicial siempre es 0 
    Si se envia cualquier caracter, que no sea un num, lo toma como si fuera 0 y devuelve array vacio [] 
    Para resolver esto, utilizamos el metodo parseInt porque su funcion es convertir una cadena (string) en un número entero 
    Al parsear un string no numerico, devuelve NaN
    */

    const prodsLimit = prods.slice(0, limit);

    // la peticion fue correcta
    res.status(200).render('templates/home', {
      showProducts: true,
      products: prodsLimit,
      css: 'home.css',
    });
  } catch (error) {
    res.status(500).render('templates/error', {
      error: error,
    });
  }
});

//: significa que es modificable (puede ser un 4 como un 10 como un 75)
productsRouter.get('/:pid', async (req, res) => {
  try {
    const idProduct = req.params.pid; //Todo dato que se consulta desde un parametro es un string

    // Cambie productManager.getProductById(idProduct); por:
    const prod = await productModel.findById(idProduct);

    if (prod) res.status(200).send(prod);
    else res.status(404).send('Producto no existe');
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al consultar producto: ${error}`);
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    // todo dato que se consulta desde un parametro es un string, si es un numero hay que parsearlo
    const product = req.body;

    // Cambie productManager.addProduct(product); por:
    const message = await productModel.create(product);

    res.status(201).send(message);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al crear producto: ${error}`);
  }
});

// metodo put es para actualizar
productsRouter.put('/:pid', async (req, res) => {
  try {
    // todo dato que se consulta desde un parametro es un string, si es un numero hay que parsearlo
    const idProduct = req.params.pid;
    const updateProduct = req.body;
    const product = await productModel.findByIdAndUpdate(
      idProduct,
      updateProduct
    );

    res.status(200).send(product);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al actualizar producto: ${error}`);
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const message = await productModel.findByIdAndDelete(idProduct);

    res.status(200).send(message);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al eliminar producto: ${error}`);
  }
});

export default productsRouter;
