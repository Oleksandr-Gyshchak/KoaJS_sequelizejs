const Sequelize = require('sequelize');

const dbURI = 'postgres://xaqybaay:u7kY_CQ0Zrwoqr-muZIeOyGc8o90Agag@dumbo.db.elephantsql.com:5432/xaqybaay';


const sequelize = new Sequelize(dbURI);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = sequelize;