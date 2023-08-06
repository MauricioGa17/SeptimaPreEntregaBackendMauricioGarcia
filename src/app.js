import express, { urlencoded } from "express";
import { engine } from 'express-handlebars';
import __dirname from './utils.js'

//Mongoose
import mongoose from "mongoose";

//Socket IO
import { createServer } from "http";
import { Server } from "socket.io";

//Routes
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import views from './routes/views.js'

const app = express();
const puerto = 8080;

//Archivos Estaticos
app.use('/static', express.static(__dirname + '/public'))

//Configuraciones
app.use(express.json());
app.use(urlencoded({ extended: true }))

//Motor de Plantillas
app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Rutas
app.use('/api/products/', productRoutes)
app.use('/api/cart/', cartRoutes)
//app.use('/api/chat/', chatRoutes)*/
app.use(views)

//Servidor
const url = "mongodb+srv://mauricio:achtung75G@cluster0.vil2pfb.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, {
    dbName: 'ecommerce'
}).then(() => {
    const httpServer = app.listen(puerto, () => {
        console.log("Servidor Corriendo en el puerto 8080")
    })

    //Configuracion IO
    const io = new Server(httpServer)

    io.on('connection', (socket) => {

        //Escucha el mensaje mandado desde el cliente
        socket.on("new", data => {
            console.log("Cliente Conectado")
        })

        socket.on("messages", message => {
            //console.log(message)
            io.emit("message_response", message.payload)
        })

        socket.on("products", products => {
            io.emit("response_products", products)
        })

        /*socket.on("message", data => {
            console.log(data)
            io.emit("response_message", data)
        })*/
    })
}).catch((error) => {
    console.log("Error de Conexion: " + error)
})