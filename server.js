const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbMysql = require("./app/config/mysql.config.js")
const connectionBdd = require("./app/services/ConnectionBdd")
var passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
var randomstring = require("randomstring");


const app = express();



// init connection to bdd

connectionBdd.connectionBdd()


app.use(cors())

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));





//#region SignUP
app.post("/user", (req, res) => {
    try {
        req.body.password = passwordHash.generate(req.body.password);
        dbMysql.dbMysql.query("SELECT * FROM user WHERE pseudo=? OR mail=?", [req.body.pseudo, req.body.mail], function (err, result) {
            if (err) throw err;
            console.log("retour du select" + result);
            if (result == "") {
                dbMysql.dbMysql.query('INSERT INTO user SET mail = ? , pseudo = ? , password = ? , isAdmin = ?', [req.body.mail, req.body.pseudo, req.body.password, req.body.isAdmin], function (error, results, fields) {
                    if (error) throw error;
                    res.end("OK");
                });
            }
            else {
                console.log("email ou pseudo déja utilisé");
                res.end("NOK")

            }
        });
    } catch (error) { res.end("NOK") }


});
//#endregion


//#region SignIN
app.post("/connection", (req, res) => {
    try {
        dbMysql.dbMysql.query("SELECT password, id ,isAdmin FROM user where mail = ?", [req.body.mail], function (err, result) {
            if (err) throw err;
            if (result == "") { res.end("NOK") }
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
                    console.log("email ou mot de passe erroné")
                    res.end("NOK")
                }
            }
        });

    } catch (error) { res.end("NOK") }
});
//#endregion



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);

});