const fs = require('fs')
const { title } = require('process')
const addNote = function(id,title,body){
//const addNote = function(title,body){
    console.log("El título de la nota:", title)
    console.log("El cuerpo de la nota:", body)
    const notes = loadNotes()
    //Validar que nota no esté duplicada
    const duplicateNote = notes.find((note)=> note.title === title)
    if(!duplicateNote){
        notes.push(
            {id:id,
            title:title,
            body:body}
            /*
            {title:title,
            body:body}
            */
        )
        // Guardar en el archivo
        saveNotes(notes)
        console.log("Notas creadas")        
    } else{
        console.log("Nota duplicada")
    }
}
const getNotes = function(){
    try{
    // La constante "readNotes" es un archivo en formato JSON    
    const readNotes = fs.readFileSync("notes.json")
    /*  El método "parse" del objeto "JSON" toma la cadena JSON 
    y la transforma en un objeto de JavaScript, es decir, un objeto
    que podamos manipular en JS */
    const notes = JSON.parse(readNotes)
    console.log(notes)
    }catch(err){
        console.log(err)
    }
}

const listNotes = function(){ //Función que itera sobre las notas y las imprime
    const notes = loadNotes()
    notes.forEach((note) => { //Función flecha
        //console.log("Título de la nota: ",note.id)
        console.log("Título de la nota: ",note.title)
        console.log("Cuerpo de la nota: ",note.body)
    })
}

const saveNotes = function(notes){
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync("notes.json", dataJSON)
}
const loadNotes= function() {
    try{
        const dataBuffer = fs.readFileSync("notes.json")
        // Buena práctica: pasar el contenido a un buffer temporal
        const dataJSON = dataBuffer.toString() 
        return JSON.parse(dataJSON) //devuelve lista llena
    } catch(e){
        return[] //devuelve lista vacía
    }
}

//const removeNote = function(id){
const removeNote = function(title){    
    console.log("From tools title:", title)
    const notes = loadNotes()
/* Leemos el archivo JSON (archivo de texto)
Eliminamos la nota
Sobreescribimos la lista (archivo JSON)
JSON: archivo para transacciones en la red (internet)
*/
    // console.log(notes)
    //const notesToKeep = notes.filter((note)=>note.id != id)
    console.log("From tools notes:", notes)
    
    const notesToKeep = notes.filter((note)=>note.title != title)
    console.log("From tools notesToKeep:", notesToKeep)
    if(notes.length > notesToKeep.length){
        console.log("Note removed!")
        saveNotes(notesToKeep)
        return true
    }else{
        console.log("Note not found!")
        return false
    }

}
// function (id)
const readOneNote = function(title){
    const notes = loadNotes()
    const note = notes.find((note)=>note.title === title)
    if(note){
        console.log("Nota encontrada")
        console.log(note.title, ":",note.body)
        //return note
    }else{
        console.log("Nota no encontrada")
        // return false
    }
}
//const modifyNote = function(title, ntitle, nbody){
const modifyNote = function(id, ntitle, nbody){
    // Obtenemos el archivo JSON que contiene la lista de notas
    const notes = loadNotes()
    // Buscamos el índice de la nota que queremos modificar mediante su "título"
    //const pos = notes.findIndex((note)=>note.title === title)
    const pos = notes.findIndex((note)=>note.id === id)
    //console.log(pos)
    // Modificamos el título de la nota y/o su cuerpo
    // if(!pos)... esto estaba dando error
    if(pos!==null){
        notes.splice(pos,1, {
            id:id,
            title:ntitle,
            body:nbody}
            )
        // Reescribimos el archivo JSON con la(s) nota(s) modificada(s)
        saveNotes(notes)
        console.log("Nota modificada")
    } else{
        console.log("Nota no existe")
    }

}
module.exports = {
    addNote:addNote,
    getNotes:getNotes,
    listNotes:listNotes,
    removeNote: removeNote,
    readOneNote:readOneNote,
    modifyNote:modifyNote,
    loadNotes:loadNotes,
    saveNotes:saveNotes
}