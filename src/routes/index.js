const { Router } = require("express");//requiriu o express e pegou apenas a função Router dela para criar novas rotas

const usersRoutes = require("./users.routes")//requiriu as rotas de usuario e definiu elas como uma const usersRoutes
const notesRoutes = require("./notes.routes")

const routes = Router();//executou a funçao Router para que ela funcione

routes.use("/users", usersRoutes)//definiu na route que quando o path for /users ele usara as rotas de usuario
routes.use("/notes", notesRoutes)

module.exports = routes//exportou a route para que todo o servidor possa utiliza-la