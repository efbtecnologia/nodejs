const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

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

app.get('/', (req,res) => {
  res.render('home')
})

//criando rota para insaerir livros (insert é com post)
app.post('/books/insertbook', async (req, res) => {
  //const { title, pageqty } = req.body; // Desestruturação
  const title = req.body.title
  const pageqty = parseInt(req.body.pageqty,10) // converte para inteiro, Base 10 (decimal)

  console.log('Dados recebidos:', { title, pageqty }); 

  // Correto: Use PARÂMETROS para evitar SQL Injection
  const sqlInsert = 'INSERT INTO books (title, pageqty) VALUES ($1, $2)';
  
  try {
    await pool.query(sqlInsert, [title, pageqty]); // Passa valores como array
    res.redirect('/books');

  } catch (err) {
    console.error('Erro ao inserir livro:', err);
    res.status(500).send('Erro no servidor');
  }
});

//Criar rota para buscar tds livros (GET)
app.get('/books', async (req, res) => {
  const sqlSelect = 'SELECT * FROM books ORDER BY id'

  try {
    const result = await pool.query(sqlSelect);
    const books = result.rows;

    console.log('Livros encontrados: ', books);
    res.render('books', { books });

  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    res.status(500).send('BOOKS: Erro no servidor');
  }
})

//rota where de IDs
app.get('/books/:id', async (req, res) => {
  const id = req.params.id

  //DeepSeek falou pra fazer as querys com parametros, $1, $2, etc e na conhexao passar os valores... por questao de haqueamento, segurança etc
  const sqlSelect = 'SELECT * FROM books WHERE id = $1'

  try {
    const result = await pool.query(sqlSelect,[ id ]); //passando o parametro [id] = $1
    
    //no individual a handlebars nao esta esperando um array, entao aqui vou retirar rapidamente passando a posição [ 0 ] do array, 
    // mesmo so havendo essa posição mesmo... posso testar depois mandando um json, pode ser isso...
    const book = result.rows[0]; 

    console.log(`Livro #${id} procurado`, book)
    res.render('book', { book })

  } catch (error) {
    console.error('Erro ao buscar livro:', error)
    res.status(500).send('BOOKID: Erro no servidor')
  }
})

//rota de edição de registros
app.get('/books/edit/:id', async (req, res) => {
  const id = req.params.id

  //query passando parametros
  const sqlSelect = 'SELECT * FROM books WHERE id = $1'

  try {
    const result = await pool.query(sqlSelect, [id])
    const book = result.rows[0]

    console.log('Livro em edição',book)
    res.render('editbook', { book })
    
  } catch (error) {
    console.error('Erro ao editar livro', error)
    res.status(500).send('BOOKEDT: Erro no servidor')
    
  }
})

//rota de update
app.post('/books/updatebook', async (req, res) => {

  const id = req.body.id
  const title = req.body.title
  const pageqty = req.body.pageqty

  const sqlUpd = 'UPDATE books SET title = $1, pageqty = $2 WHERE id = $3'

  try {
    const result = await pool.query(sqlUpd, [title, pageqty, id])
    res.redirect('/books')
    
  } catch (error) {
    console.error('Erro na Edição', error)
    res.status(500).send('EDTBOOK: Erro no servidor')    
  }
})

//Removendo registros no BD
app.post('/books/remove/:id', async (req, res) => {
  const id = req.params.id
  const sqlDel = 'DELETE FROM books WHERE id = $1'

  try {
    const result = await pool.query(sqlDel, [id])
    res.redirect('/books')
    
  } catch (error) {
    console.log('Erro na Deleção',error)
    res.status(500).send('DELBOOK: Erro no servidor')
  }
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});