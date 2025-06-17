const { Sequelize } = require('sequelize') //OMR do nodejs, parecido com o que o Django faz para comunicar com o BD sem usar o SQL nos fontes

const sequelize = new Sequelize(
  'nodesequelize', // Nome do banco
  'postgres',      // Usuário
  '1234',          // Senha
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,  
    pool: { // Configurações do Pool (Adicione essa seção)
      max: 10,                 // Máximo de conexões (equivalente ao connectionLimit)
      min: 2,                  // Mínimo de conexões (opcional)
      idle: 30000,             // Equivalente ao idleTimeoutMillis (30s)
      acquire: 2000,           // Equivalente ao connectionTimeoutMillis (2s)
      evict: 10000             // Checagem de conexões ociosas (opcional)
    }
  }
);

// try {
//   sequelize.authenticate()
//   console.log('Conectamos com sucesso com o Sequelize!')
  
// } catch (error) {
//   console.log('Não foi possível conectar: ', error)
// }

module.exports = sequelize