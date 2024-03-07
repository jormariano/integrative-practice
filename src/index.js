/*
 Paso 1: npm init --yes
 Paso 2: "type": "module",
 Paso 3: crear carpetas src y dentro config, data y rutes
 Paso 4: npm i express
 Paso 5: agregar en las dependencias del package.json:
   "scripts": {
       "dev": "node --watch src/index.js"
     },
  Agregando en scripts, en la terminal: npm run dev

 Paso 6: crear .gitignore y agregar node_modules
*/

// Express para creacion del servidor
import express from 'express';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import upload from './config/multer.js';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import chatRouter from './routes/chatRouter.js';

// Configuraciones
const app = express();
const PORT = 8000;

// Server
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
const io = new Server(server);

// Middlewares: intermediario que se ejecuta antes de llegar al endpoint. Express no trabaja con json y usa un middleware
app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// Las vistas de la aplicacion se encuentran en:
app.set('views', __dirname + '/views');

// En main.js Chatbox: Deberia venir de la base de datos
const messages = [];

io.on('connection', (socket) => {
  console.log('Conexion con socket.io');

  socket.on('message', (info) => {
    console.log(info);
    messages.push(info);
    io.emit('messageLogs', messages);
  });
});

/* En main.js Se establece la conexion entre el cliente y servidor. 

io.on('connection', (socket) => {
  console.log('Conexion con socket.io');

  socket.on('buy', (info) => {
    // El cliente envia un mensaje
    console.log(info);
  });

  socket.on('finish', (info) => {
    console.log(info);
    socket.emit('message-client', 'Compra finalizada con exito'); // Este mensaje se envia al cliente (inspeccionar clg)
    socket.broadcast.emit('buy-finish', 'Supervisora se completo una venta'); // Se envia al resto de conexiones realizadas con el server
  });
});

*/

// .on es para recibir y .emit es para enviar

// Routes
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/products', productsRouter, express.static(__dirname + '/public'));
app.use('/api/cart', cartRouter);
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'));

// Se agrega el middleware entre la ruta('/upload') y el contenido de la ruta((req, res) => {) para subir imagenes
// .single() es un metodo de multer para enviar solo un elemento a la vez
app.post('/upload', upload.single('product'), (req, res) => {
  try {
    console.log(req.file);
    res.status(200).send('Imagen cargada correctamente');
  } catch (e) {
    res.status(500).send('Error al cargar imagen');
  }
});

/*

// Al ir a static renderiza lo que aparece en home.handlebars
app.get('/static', (req, res) => {
  const products = [
    {
      id: 1,
      title: 'El principito',
      price: 2000,
      stock: 5,
      img: 'https://www.tematika.com/media/catalog/Ilhsa/Imagenes/594472.jpg',
    },
    {
      id: 2,
      title: '1Q84',
      price: 4000,
      stock: 10,
      img: 'https://http2.mlstatic.com/D_NQ_NP_738437-MLA72789173673_112023-O.webp',
    },
    {
      id: 3,
      title: 'Al calor del verano',
      price: 6000,
      stock: 15,
      img: 'https://images.cdn1.buscalibre.com/fit-in/360x360/33/5e/335e1123c18fe76ade7890da85a09fdd.jpg',
    },
    {
      id: 4,
      title: 'Crimen y Castigo',
      price: 6000,
      stock: 10,
      // ./ es para posicionarse en la carpeta public
      img: './img/crimenycastigo.jpeg',
    },
  ];
  res.render('templates/products', {
    showProducts: true,
    products: products,
    css: 'home.css',
  });
});

*/

/* 
CRUD: Create, Read, Update, Delete
METODOS: Post, Get, Put, Delete
GET es para obtener, POST es para crear, PUT para actualizar. Con GET y POST se debe enviar informacion.
POSTMAN es para simular peticiones con los metodos, es para testear rutas, sin necesidad de tener un formulario en Frontend.

CLASE 10 WEBSOCKETS

*/
