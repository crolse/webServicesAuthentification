const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./server.js']


const doc = {
    info: {
        version: "1.0.0",
        title: "API SignIn/SignUp",
        description: ""
    },
    host: "localhost:8080",
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],


}



swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js')

})