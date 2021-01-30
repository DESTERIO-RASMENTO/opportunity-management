const express = require('express');
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const app = express()

let sessionOptions = session({
    secret:"Mr virus in action",
    store:new mongoStore({client:require('./db')}),
    resave: false,
    saveUninitialized:false,
    cookie:{maxAge: 1000*60*60*24,httpOnly:true}
})

const router = require('./router')
app.use(sessionOptions)
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(flash())
app.use((req,res,next)=>{
    //make cureent user id available
    if(req.session.user){req.visitorId = req.session.user._id}else{req.visitorId=0}
    // make user availabble from user tenplete
    res.locals.user = req.session.user
    res.locals.accounts = req.session.accounts
    next()
})
// app.use((req, res, next) => {
//     res.locals.accounts = req.session.accounts
//     next()
// })

app.use(express.static('public'))
app.set('views','views')
app.set('view engine','ejs')


app.use('/',router)

module.exports = app