const { Router } = require("express");//requiriu novamente a Router do epress

const NotesController = require("../controllers/NotesController")//requiriu os controllers de usuario e o transformou em uma conts

const notesController = new NotesController();//açao necessaria para que uma class funcione

const notesRoutes = Router();//executou a Router para que ela funcione

notesRoutes.get("/", notesController.index)
notesRoutes.post("/:user_id", notesController.create);//executando a funçao mid e create  quando o path for / para que ele mande as informaçoes para o servidor
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

//notesRoutes.put("/:id", notesController.update)

module.exports = notesRoutes;//exportou para todo o servidor

