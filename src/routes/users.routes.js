const { Router } = require("express");//requiriu novamente a Router do epress

const UsersController = require("../controllers/UsersController")//requiriu os controllers de usuario e o transformou em uma conts

const usersController = new UsersController();//açao necessaria para que uma class funcione

const usersRoutes = Router();//executou a Router para que ela funcione

usersRoutes.post("/", usersController.create)//executando a funçao mid e create  quando o path for / para que ele mande as informaçoes para o servidor
usersRoutes.put("/:id", usersController.update)

module.exports = usersRoutes;//exportou para todo o servidor

