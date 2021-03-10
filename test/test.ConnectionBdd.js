const mysql = require('mysql');


describe('Access to DB', function () {
    describe('#succes', function () {
        it('should connect to database', function (done) {
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'tindquette'
            });
            connection.connect(done);
        });
    })
});