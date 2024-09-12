require("dotenv").config()
const http = require("http")

function requestController() {
    // logíca de nuesta aplicación
    console.log({message:"Hola mundo!!!"})
}

//configurar nuestro server
const server = http.createServer(requestController)

const PORT = process.env.PORT

server.listen(process.env.PORT, function(){
   console.log("Aplicación corriendo en el puerto: "+PORT) 
})


//server.listen(4000)


