const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const accountController = require('./controllers/accountController')
const opportunityController = require('./controllers/opportunityController')

router.get('/',userController.home)
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)

//account routes
router.get('/create-account',userController.mustBeLoggedIn,accountController.viewCreateAccount)
router.post('/create-account',userController.mustBeLoggedIn,accountController.createAccount)
router.get('/create/:id',accountController.viewAccount)
router.get('/create/:id/create-opportunities',accountController.ViewAddOpportunities)

//profile
router.get('/profile/:username',userController.ifUserExists,userController.profile)
//oportunity routes
router.post('/create-opportunity', opportunityController.createOpportunity)
router.get('/create-opportunity/:id', opportunityController.viewOpportunity)
router.get('/opportunity/:account', opportunityController.ifAccountExists, opportunityController.viewOpportunities)




module.exports=router