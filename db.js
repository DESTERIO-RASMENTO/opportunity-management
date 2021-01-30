const dotenv = require('dotenv')
dotenv.config()
const mondodb = require('mongodb')
mondodb.connect(process.env.CONNECTIONSTRING,{useNewUrlParser:true, useUnifiedTopology:true},(err,client)=>{
    module.exports = client
    const app = require('./app')
    app.listen(process.env.PORT, () => {
        console.log("app listening to port 3000")
    })
})