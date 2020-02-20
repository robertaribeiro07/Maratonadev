//conf o servidor
const express = require ("express")
const server = express()

//conf o servirdor para apresentar arq estaticos
server.use(express.static("public"))

//habilitar body do formulario
server.use(express.urlencoded({extended:true}))


// conexao com BD
const Poll= require("pg").Pool //fica sempre ativa a conexao
const db = new Poll({
    user:"postgres",
    password:"0000",
    host:"localhost",
    port:5432,
    database:"doe"
})

//conf a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})




// configira a apresentação da pagina
server.get("/", function(req, res){
  
    db.query("SELECT * FROM donors", function (err, result){
        if(err) return res.setDefaultEncoding("Erro de bd")
        
        const donors = result.rows
        return res.render("index.html",  {donors})
    })

  
})

server.post("/", function(req, res){
    //pegr dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == " " || email ==" " || blood ==" "){
        return res.send("Todos os campos são obrigatórios")
    }

  //coloco valores dentro de bd
  const query =`
  INSERT INTO donors ("name", "email","blood") 
  VALUES($1, $2, $3)`
  const values =[name, email, blood]

 db.query(query, values, function (err){

    //fluxo de erro
     if (err) return res.send("erro no banco de dados")

     //fluxo ideal
     return res.redirect("/")
 })
  
 
})
// ligar o server e da acesso a porta 3000
server.listen("3000", function(){
    console.log("iniciei o servidor")
})