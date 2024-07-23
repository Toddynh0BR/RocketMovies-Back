const { Router } = require("express");//requiriu novamente a Router do epress

const NotesController = require("../controllers/NotesController")//requiriu os controllers de usuario e o transformou em uma conts
const enssureAuthenticated = require("../middlewares/enssureAuthenticated");

const notesController = new NotesController();//açao necessaria para que uma class funcione

const notesRoutes = Router();//executou a Router para que ela funcione

notesRoutes.use(enssureAuthenticated)

notesRoutes.post("/index", enssureAuthenticated, notesController.index);
notesRoutes.get("/", enssureAuthenticated, notesController.showAll);
notesRoutes.get("/preview/:id", notesController.show);
notesRoutes.post("/", notesController.create);

module.exports = notesRoutes;

