require("express-async-errors")//importaçao do async erros para poder capturar erros

const cors = require("cors")
const uploadConfigs = require("./configs/upload");
const AppError = require("./utils/AppError")//requerindo 

const express = require('express');//chamou a biblioteca express

const routes = require("./routes");//requiriu a routes e a transformou em uma const

const app = express();//executou a biblioteca express para que ela possa ser usada
app.use(express.json());//definiu que todos os dados enviados ou recebidos serao em json 
app.use(cors());

app.get("/health", (req, res) => {
    return res.json({ message: "server active" });
});

app.head("/health", (req, res) => {
   return res.json({ message: "server active" });
});

app.use("/files", express.static(uploadConfigs.UPLOADS_FOLDER))
app.use(routes);//definiu a rota principal como routes

app.use(( error, request, response, next)=>{
 if(error instanceof AppError){
 return response.status(error.statusCode).json({
    status: "error",
    message: error.message
 })
 }

 console.error(error)

 return response.status(500).json({
 status: "error",
 message: "internal server error"
 })
})//funçao geral que vai receber o erro e verificar se foi do usuario ou do servidor e avisa-los

const PORT = process.env.PORT || 3000;//definil a porta do servidor
app.listen(PORT, () => console.log(`serve is running on port ${PORT}`));//mensagem para saber que o servidor esta ativo


//middleware = funçao capaz de interceptar os dados que estao sendo enviados ou recebidos pelo servidor e "checar" eles