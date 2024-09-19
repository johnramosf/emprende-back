console.log("Este JS va a ser interpretado por el NAVEGADOR")

//obtenet elementos del html y guardarlos en constantes
//const button = document.querySelector("button")
//console.log({button})
//const getBtn = document.querySelector('#get-tasks')
const createEditBtn = document.querySelector("#create-task")
const input = document.querySelector("#task-name")
const tasksDiv = document.querySelector("#tasks")

//nutrir de funcionalidad a los botones
/*button.addEventListener("click", function(){
    console.log("CLICK!!")
    fetch("http://localhost:4000/users")
})
getBtn.addEventListener("click", function(){
    console.log("GET TAREAS")
    fetch("http://localhost:4000/api/tasks")
})*/

const baseUrl = `${window.origin}/api`   

console.log({window,baseUrl})

let TASK_TO_EDIT = null

createEditBtn.addEventListener("click", function () {
    console.log("CREAR/EDITAR TAREA")
    const creating = !TASK_TO_EDIT
    console.log({ text: input.value })
    const compath = creating ? "tasks" : `tasks/${TASK_TO_EDIT._id}`
    const method = creating ? "POST" : "PUT"
    console.log(`url ${baseUrl}/${compath}`)
    fetch(`${baseUrl}/${compath}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.value }),
    }).then((res) => {
        input.value = ""
        createEditBtn.innerText = "Crear tarea"
        getTasks()
        return res.json()
    }).then((resJSON) => {
        console.log({ resJSON })
    })

})

function getTasks() {
    tasksDiv.innerHTML = ''   //limpiamos el contenido del div para actualizarlo con las nuevas tareas //limpiamos el contenido del input
    fetch(`${baseUrl}/tasks`)
        .then((res) => {
            console.log({ res })
            return res.json()
        }).then((resJSON) => {
            console.log({ resJSON })
            const tasks = resJSON.data
            for (const task of tasks) {
                console.log(task)
                const taskParagraph = document.createElement('P')
                const deleteTaskBtn = document.createElement('button')
                const taskContainerDiv = document.createElement('div')
                deleteTaskBtn.innerText = "Borrar"
                taskParagraph.innerText = task.name
                deleteTaskBtn.setAttribute('id', task._id)
                deleteTaskBtn.addEventListener('click', (e) => {
                    const taskId = deleteTaskBtn.getAttribute('id')
                    deleteTaskBtn.innerText = "..."
                    fetch(`${baseUrl}/tasks/${taskId}`, {
                        method: "DELETE"
                    }).then(() => {
                        const taskDivCont = deleteTaskBtn.parentElement
                        taskContainerDiv.remove()
                    })
                })
                taskParagraph.addEventListener('click', () => {
                   input.value = taskParagraph.innerText
                   createEditBtn.innerText = "Editar tarea"
                   TASK_TO_EDIT = task    
                })
                taskContainerDiv.appendChild(taskParagraph)
                taskContainerDiv.appendChild(deleteTaskBtn)
                tasksDiv.appendChild(taskContainerDiv)
            }
        })
}

getTasks()