const pg = require('pg') //banco de dados pg = "postgreSql" //tem q desestruturar depois pra pegar a pool...

//criando conexao com o banco de dados, no caso do PG = postgreSql
// Cria a pool (acessando pg.Pool) //podia ser CLient , ainda nao sei bem a diferença.. porem em projetos reais usam mais a pool
const pool = new pg.Pool({    
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'nodepg',
    port: 5432, // Porta padrão do PostgreSQL
    max: 10, //equivale ao connectionLimit do mysql
    idleTimeoutMillis: 30000, //(30seg timeout)
    connectionTimeoutMillis: 2000 //tempo maximo de tentativa de conexao (padrao é 0)
  });
  
  pool.connect((err) => {
      if (err) {
        console.error('Erro ao conectar no PostgreSQL:', err);
        return;
      }
    
      console.log('PostgreSQL conectado via Pool!');
  });

  module.exports = pool