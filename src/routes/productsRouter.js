// Clase 8 - 11'
import { Router } from 'express';
import { ProductManager } from '../config/ProductManager.js';

const productsRouter = Router();

const productManager = new ProductManager('./src/data/products.json');

productsRouter.get('/', async (req, res) => {
  try {
    // limit entre {} porque puede existir mas de un elemento para buscar. http://localhost:8000/products?limit=2
    const { limit } = req.query;

    const prods = await productManager.getProducts();

    /* el metodo slice() se utiliza para extraer una porción de un array y devolverla como un nuevo array.
    No modifica el array original, devuelve un nuevo array que contiene los elementos seleccionados. 
    Acepta dos parámetros, inicio y fin (puede ser undefined), para indicar los índices desde y hasta los cuales extraer los elementos.
    El valor inicial siempre es 0 
    Si se envia cualquier caracter, que no sea un num, lo toma como si fuera 0 y devuelve array vacio [] 
    Para resolver esto, utilizamos el metodo parseInt porque su funcion es convertir una cadena (string) en un número entero 
    Al parsear un string no numerico, devuelve NaN
    */

    let limits = parseInt(limit);

    if (!limits) {
      limits = prods.lenght;
    }

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
    const prod = await productManager.getProductById(idProduct);
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
    const idProduct = req.body;
    const message = await productManager.addProduct(idProduct);

    if (message == 'Producto creado exitosamente') {
      res.status(200).send(message);
    } else {
      res.status(400).send(message);
    }
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
    const idProducto = req.params.pid;
    const updateProduct = req.body;
    const message = await productManager.updateProduct(
      idProducto,
      updateProduct
    );

    if (message == 'El producto fue actualizado correctamente') {
      res.status(200).send(message);

      //La opcion de retornar que el producto no existe esta creada en el metodo en ProducstManager, no es necesario repetirla
    } else {
      res.status(404).send(message);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al actualizar producto: ${error}`);
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const message = await productManager.deleteProduct(idProduct);
    if (message == 'Producto eliminado correctamente')
      res.status(200).send(message);
    else res.status(404).send(message);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al eliminar producto: ${error}`);
  }
});

export default productsRouter;
