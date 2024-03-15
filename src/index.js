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
import mongoose from 'mongoose';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import messageModel from './models/messages.js';
import indexRouter from './routes/indexRouter.js';

// Configuraciones
const app = express();
const PORT = 8000;

// Server
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
const io = new Server(server);

// Connection Data Base
mongoose
  .connect(
    'mongodb+srv://jorgelinamariano01:jorgelinacoderhouse@cluster0.sxghmkf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('DB is connected'))
  .catch((e) => console.log(e));

// Middlewares: intermediario que se ejecuta antes de llegar al endpoint. Express no trabaja con json y usa un middleware
app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// Las vistas de la aplicacion se encuentran en:
app.set('views', __dirname + '/views');

// Routes
app.use('/', indexRouter);

// Los mensajes vienen de la base de datos
io.on('connection', (socket) => {
  console.log('Conexion con socket.io');

  socket.on('message', async (message) => {
    try {
      await messageModel.create(message);

      const messages = await messageModel.find();

      io.emit('messageLogs', messages);
    } catch (error) {
      io.emit('messageLogs', error);
    }
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

/* 
CRUD: Create, Read, Update, Delete
METODOS: Post, Get, Put, Delete
GET es para obtener, POST es para crear, PUT para actualizar. Con GET y POST se debe enviar informacion.
POSTMAN es para simular peticiones con los metodos, es para testear rutas, sin necesidad de tener un formulario en Frontend.

CLASE 10 WEBSOCKETS

*/
