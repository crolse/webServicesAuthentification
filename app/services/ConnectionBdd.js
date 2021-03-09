const dbMysql = require("../config/mysql.config")



const connectionBdd = () => {

    try {

        dbMysql.dbMysql.connect()

        console.log('Connecté à la base de données MySQL !');
    } catch (error) {

        console.error('Impossible de se connecter, erreur suivante :', error);

    }
}

exports.connectionBdd = connectionBdd


