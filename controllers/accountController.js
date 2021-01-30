const Account  = require('../models/Account')

exports.viewCreateAccount = (req,res)=>{
res.render('create_account')
}
exports.createAccount = (req,res)=>{
let account = new Account(req.body,req.session.user._id)
account.create().then((newId)=>{
    //adition save accounts session
    req.session.accounts = {
        title: account.data.title,
        
        _id: account.data._id
    }
    ///end
    req.session.save(()=>res.redirect(`/create/${newId}`))
}).catch((errors)=>{res.send(errors)})
}
exports.viewAccount = async (req,res)=>{
    try {
        let account =await Account.findAccountById(req.params.id, req.visitorId)
        res.render('accounts',{account:account})
    } catch  {
        res.render('404')
    }
}
exports.ViewAddOpportunities = function(req,res){
    
    res.render('create-opportunities')
}
