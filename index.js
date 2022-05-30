const express = require('express')
const app = express()
// Permite acceder fácilmente a los datos en formato JSON
app.use(express.json())

const bodyParser = require('body-parser')
// Importamos el módulo local, por eso ./ y el .js
const tools = require('./tools.js')
// Importar handlebars
const hbs = require("hbs")
const { type } = require('express/lib/response')
// Lista de objetos JS
// No se utiliza JSON.stringify porque express realiza la conversión
// Partials: fragmentos de la página web que nunca van a cambiar, ej. footer, header.
// Config app engine
hbs.registerPartials(__dirname + '/views/partials',function(err){});
// definimos que el motor de vistas será handlerbars
app.set('view engine', 'hbs');
// señalamos la ubicación del folder views, con nombre del directorio + ruta del folder
app.set("views",__dirname + "/views");
// public debe tener 3 subfolders por default: css, img, scripts
app.use(express.static(__dirname + "/public"));
// Array de notas
app.use(bodyParser.urlencoded({extended:true,}))

let notes = [
    {
      id: 1,
      content: "HTML es sencillo",
      date: "2022-04-25T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "El navegador puede ejecutar sólo JavaScript",
      date: "2022-04-25T17:40:31.098Z",
      important: false
    },
    {
      id: 3,
      content: "GET y POST son los métodos más importantes de HTTP",
      date: "2022-04-25T17:50:31.098Z",
      important: true
    }
  ]

//Primer punto de entrada
// Objeto app que soporta el método get, donde '/' es el punto de entrada
app.get('/', (request, response) => {
  response.render("index")
  // response.render("index", {{nombre}})
  //response.send('<h1>Hello World!</h1>')
})
// No se requiere instalar Bulma cuando se usa un CDN, solo cuando se usa SAAS
// La API envía "código", el cliente recibe ese código y hace algo del lado del frontend, como una imagen de ERROR 404

app.get("/list_notes", (request, response)=>{
  // response.redirect(("list_notes"))
  const notes1 = tools.loadNotes()
  response.render("list_notes.hbs",{notes1})
})

// TAREA 
// Crear 3 vistas más: crear nota, listar notas y dentro de esta un botón que mande a modificar/actualizar notas y 
app.post("/create_note", (request, response)=>{
  console.log(request.body.id)
  console.log(request.body.title)
  console.log(request.body.body1)
  //result = tools.addNote(request.body.title, request.body.body1)
  result = tools.addNote(Number(request.body.id),request.body.title, request.body.body1)
  if (result == true){
    response.redirect("/list_notes")
  } else{
    
    console.log("Vuelva a intentarlo")
    response.redirect("/list_notes")
  }
})
app.get("/new_note", (request, response)=>{
  // response.redirect(("list_notes"))
  response.render("new_note")
})


app.get("/modify_note/:id", (request, response)=>{
//app.get("/modify_note/:titulo", (request, response)=>{
  //let note_id = request.params.id;
  const note_id = Number(request.params.id);
  //let note_title = request.params.titulo;
  const notes = tools.loadNotes();
  console.log(typeof(note_id))
  //const note = notes.find((note) => note.title === note_title);
  //console.log(note.title, note.body)
  //const note = notes.find((note) => note.title === note_title);
  const note = notes.find((note) => note.id === note_id);
  console.log(note);
  response.render("modify_note",{note});
});

//request.params para obtener un recurso vía URL
//request.body para obtener un recurso vía formulario



app.post("/modify_one_note",(request, response)=>{
  const id = Number(request.body.id)
  console.log(typeof(id))
  const title = request.body.ntitle
  console.log(title) 
  const new_body = request.body.nbody
  console.log(new_body)
  tools.modifyNote(id, title, new_body)
  response.redirect("list_notes")
})

app.get("/delete_note/:title", (request, response)=>{  
  
  const title = request.params.title;
  console.log(typeof(title));
  console.log(title);
  const result = tools.removeNote(title)
  if (result){
    response.redirect("/list_notes");
  }else{
    // Crear vista extra que se llame error en views
    // Crear manejador app.get "/error" para render con vista error 
    // Esa vista puede incluir un div de bulma de tipo alert-info-error con un mensaje
    // Aquí es un redirect a la ruta /error
    response.redirect("/error")
  }
    
})
app.get("/error",(request,response)=>{
  response.render("error.hbs")
})





// ruta: camino lógico que sigue una función, etc.

//Segundo punto de entrada definido
// Definir la API: definir la interfaz que permite recibir peticiones al punto de entrada y devolver una respuesta
// Se define le ruta API con /notes 
// Se regresa una respuesta con las notas formateada en JSON
// Crear vista para listar las notas
// Tabla HTML con Bulma
app.get('/api/notes', (request, response) => {
  
  response.json(notes)
})
// Punto de entrada: '/api/notes/:id'
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
    //response.status(404).send(url en '' de imagen)
  }})
/*
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
*/

// VERDE para métodos
// NARANJA para parámetros de la función o método
/* NOTA ACLARATORIA:
      El parámetro es variable en la declaración de la función.
      El argumento es el valor real de esta variable que se pasa a la función.
      Function — a set of instructions that perform a task. 
      Method — a set of instructions that are associated with an object.
*/

// Ruta para ELIMINACIÓN de recursos
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// Controlador para manejar solicitudes HTTP POST
app.post('/api/notes', (request, response) => {
  // const note = request.body
  //console.log(note)
  //response.json(note)
  // Node JS es JavaScript
  // ?: operador condicional ternario, si es verdadero regresa id máximo, sino, regresa 0 (:0)
  // ... es un spread operator
  // # almoadilla, no regresa nada
  // Respetar las responsabilidades únicas de los métodos
  const maxId = notes.length > 0 ? Math.max(...notes.map(n=>n.id)):0
  const note = request.body
  note.id = maxId + 1
  notes = notes.concat(note)
  response.json(note)

})












// Siempre que se usa un método GET tiene por defecto un código de estado 200 (OK) aunque no haya nada que entregar (content length: 0)
//Tercer punto de entrada
// EN el mismo punto de entrada se recibe un parámetro (los que se utilizan en el URL), es decir, ":id"
// Dos formas de recibir parámetros
// id es un parámetro que se recibirá en la misma petición
// Query string: ?
// Se accede al parámetro (id) a través de la petición del objeto request, ese objeto tiene un atrobuto "params" y se accede a través del objeto id del punto de entrada
// El "id" de la lista es numérico, por tanto se utiliza el método "Number" para hacer el casting (conversión de tipos en informática)
/*
app.get('/api/notes/:id', (request, response) => {
  const id = Number (request.params.id)
  console.log(id)
  // Se recorre la lista de notas con el método "find"
  // Typeof dice el tipo de dato para cada onketo
  // Cada elemento de lista es un objeto de JS
  const note = notes.find(note => note.id === id)
  response.json(note)
})
*/
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})