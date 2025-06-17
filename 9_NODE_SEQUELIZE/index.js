const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const User = require('./models/User')
const Address = require('./models/Address')

const app = express()
const port = 3000

//inic. config. para poder pegar o body da pagina
app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json()) //pegando o body em json
//fim config. para poder pegar o body da pagina

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public')) //para para arquivos publica

//criar um post assincrono
app.post('/users/create', async (req,res) => {
  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  if (newsletter ===' on') {
    newsletter = true
  } else {
    newsletter = false
  }

  console.log(req.body)

  await User.create({name, occupation, newsletter})

  res.redirect('/')
})

app.get('/users/create',(req, res) => {
  res.render('adduser')
})

//Busca com filtro findOne
app.get('/users/:id', async (req, res) =>{
  const id = req.params.id
  const user = await User.findOne({raw: true, where: {id: id}})

  res.render('userview', {user})
})

//deletando user
app.post('/users/delete/:id', async (req, res) => {
  const id =req.params.id

  await User.destroy({ where: {id : id}})

  res.redirect('/')
})

//editando user //sem relacionados
/*
app.get('/users/edit/:id', async (req, res) => {
  const id =req.params.id

  const user = await User.findOne({raw: true, where: { id: id }})

  res.render('useredit', { user })
})
*/
//editando user com relacionados (endereço, por exemplo)
app.get('/users/edit/:id', async (req, res) => {
  const id = req.params.id

  //1) Sem relacionamentos compostos
  /*
  const user = await User.findOne({raw: true, where: { id: id }})

  res.render('useredit', { user })
  */

  //2) com relacionamentos compostos
  try {
    const user = await User.findOne({include: Address, where: { id: id }})

    res.render('useredit', { user: user.get({plain: true}) })      
  } catch (error) {
    console.log(error)    
  }
})


//função envio push para edição dos dados
app.post('/users/update', async (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  if (newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  //criar um objeto com as informações
  const userData = {
    id,
    name,
    occupation,
    newsletter
  }

  //update sequelize
  await User.update(userData, {where: { id: id}})

  //redierecionando para a pagina inicial, ou outra de escolha...
  res.redirect('/')
})

//Rota para add endereço
app.post('/address/create', async (req, res) => {
  const UserId = req.body.UserId
  const street = req.body.street
  const number = req.body.number
  const city = req.body.city

  const address = {
    UserId,
    street,
    number,
    city,
  }

  await Address.create(address)

  res.redirect(`/users/edit/${UserId}`)
})

//Rota para deletar endereço
app.post('/address/delete', async (req, res) => {
  const id = req.body.id

  await Address.destroy({
    where: {id: id}
  })
})

//**********************************
//Trocando por findAll
// app.get('/', (req,res) => {
  // res.render('home')
// })

//Array com todos os dados, busca findAll
app.get('/', async (req,res) => {
  const users = await User.findAll({raw: true})
  console.log(users)
  res.render('home', {users: users})
})

// app.listen(port, () => {
    // console.log(`Servidor rodando na porta ${port}`);
// });

//Conectando com o DB antes de subir o server
  
conn
//ATENÇÃO: Caso precise recriar um projeto novo, do zero, ou precise dropar e recriar todas as tabelas, add FORÇAR no Sync.
  //.sync({force:  true})     
  .sync()
  .then(() => {
    app.listen(port)
  })
  .catch((err) => console.log(err))

  