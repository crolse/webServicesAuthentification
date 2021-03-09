const express = require("express");
const http = require('http')
const bodyParser = require("body-parser");
const cors = require("cors");
const dbMysql = require("./app/config/mysql.config.js")
const connectionBdd = require("./app/services/ConnectionBdd")
var passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')


const app = express();
http.createServer(app).listen(8080)
console.log("Listening at:// port:%s (HTTP)", 8080)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


// init connection to bdd

connectionBdd.connectionBdd()


app.use(cors())


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));





//#region SignUP
app.post("/user", (req, res) => {
    try {
        req.body.password = passwordHash.generate(req.body.password);
        dbMysql.dbMysql.query("SELECT * FROM user WHERE pseudo=? OR mail=?", [req.body.pseudo, req.body.mail], function (err, result) {
            if (err) res.status(500).json({ message: "unknown error" });
            console.log("retour du select" + result);
            if (result == "") {
                dbMysql.dbMysql.query('INSERT INTO user SET mail = ? , pseudo = ? , password = ? , isAdmin = ?', [req.body.mail, req.body.pseudo, req.body.password, req.body.isAdmin], function (error, results, fields) {
                    if (error) res.status(500).json({ message: "unknown error" });
                    res.status(500).json({ message: "utilisateur ajouté" });;
                });
            }
            else {
                console.log("email ou pseudo déja utilisé");
                res.status(406).json({ message: "email ou pseudo déja utilisé" }) // 406 NOT ACCEPTABLE

            }
        });
    } catch (error) {
        res.status(500).json({ message: "unknown error" })

    }


});
//#endregion


//#region SignIN
app.post("/connection", (req, res) => {
    try {
        dbMysql.dbMysql.query("SELECT password, id ,isAdmin FROM user where mail = ?", [req.body.mail], function (err, result) {
            if (err) res.status(500).json({ message: "unknown error" });
            if (result == "") { res.status(406).json({ message: "email invalide" }) }
            else {
                console.log(result[0].password);
                console.log(result[0].id)
                let checkPassword = passwordHash.verify(req.body.password, result[0].password)
                if (checkPassword == true) {
                    console.log("vous êtes connecté")
                    res.status(200).json({
                        userId: result[0].id,
                        token: jwt.sign(
                            { userId: result[0].id },
                            'ULTRA_RANDOM_TOKEN_SECRET',
                            { expiresIn: '4h' }
                        ),
                        isAdmin: result[0].isAdmin
                    });
                }
                else {
                    console.log("mot de passe erroné")
                    res.status(406).json({ message: "mot de passe invalide" })
                }
            }
        });

    } catch (error) { res.status(500).json({ message: "unknown error" }) }
});
//#endregion



