require('dotenv').config()
//const tasks = [{"nombreTarea": "mi tarea1", "descripcion":"mi tarea1 descrita"},{"nombreTarea": "mi tarea2", "descripcion":"mi tarea2 descrita"}]
const express = require('express')
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Conectado a Db exitosamente')
  })
  .catch((err) =>
    console.log("Hubo un error al conectarse a DB", { err })
  )

const taskSchema = new Schema({
  name : String,
  done : Boolean,
  //createdBy
})

const Task = mongoose.model("Task", taskSchema, "Tasks")

  //servir archivos estáticos
app.use(express.static('public'))
//middleware para PARSEAR el body de las requests
app.use(express.json())

//middlewares (preprocesamiento de requests)
//Son siempre => FUNCIONES


//configurar rutas
/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/

//A) Pasamos una funcion anónima
app.use((req, res, next) => {
  console.log('No especificamos cómo debe ser el inicio de la ruta')
  console.log("Midleware 1")
  next()
})


//B) pasamos una funcion RETORNADA por otra FUNCION/METODO
const logger = {
  logThis: (whatToLog) => {
    return (req, res, next) => {
      console.log("Middleware 2:", whatToLog)
      next()
    }
  }
}

// c) Middleware para parsear BODY de la REQUEST(es como el caso "C")
/*app.post("/api/tasks", function (req, res) {
  const body = req.body
  console.log({ body })
  res.status(201).json({ ok: true, message: "Tarea creada con éxito" })
})*/

app.use("/martin", logger.logThis("Logueame estooo"))

app.get("/api/tasks", function (req, res) {
  Task.find().then((tasks)=>{
    console.log(tasks);
    res.status(200).json({ok:true,data:tasks})
  }).catch((err)=>{
    res.status(400).json({ok:false, message:"Hubo un problema al obtener las tareas"})
  })
 })

app.post("/api/tasks",function(req, res){
  const body = req.body
  console.log({body})
  Task.create({
    name: body.text,
    done: false,
    hello:"Hola"
  }).then((createdTask)=>{
    res.status(201).json({ok:true, message: "Tarea creada con éxito", data: createdTask})
  }).catch((err)=>{
    res.status(400).json({ok:false, message:"Error al crear la tarea"})
  })
})

app.put("/api/tasks/:id",function(req, res){
  const id = req.params.id
  const body = req.body

  console.log({body})
  Task.findByIdAndUpdate(id, {
    name: body.text
  }).then((updatedTask)=>{
    res.status(200).json({ok:true, message: "Tarea actualizada con éxito", data: updatedTask})
    
  }).catch((err)=>{
    res.status(400).json({ok:false, message:"Error al actualizar la tarea"})
  })
})

app.delete("/api/tasks/:id",function(req, res){
  const id = req.params.id
  console.log({params: req.params, id:id})
  Task.findByIdAndDelete(id).then((deletedTask)=>{
    res.status(200).json({ok:true, data: deletedTask})
  }).catch((err)=>{
    res.status(400).json({ok:false, message:"Error al eliminar la tarea :"+err.message})
  }) 
})



app.get("/users", function (req, res) {
  res.send([{ name: "Martín" }, { name: "Francisco" }])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})