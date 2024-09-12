const http = require("http")

function requestController() {
    // logíca de nuesta aplicación
    console.log({message:"Hola mundo"})
}

//configurar nuestro server
const server = http.createServer(requestController)

server.listen(4000)


