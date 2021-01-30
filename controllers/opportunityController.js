const Opportunity = require('../models/Opportunity')

exports.createOpportunity = function(req,res){
let opportunity = new Opportunity(req.body, req.session.accounts._id)
opportunity.create().then((newId)=>{
req.session.save(()=>{
    console.log(opportunity)
    //res.send("saved")
    res.redirect(`/create-opportunity/${newId}`)
})
}).catch((error)=>{res.send(error)})

}
exports.viewOpportunity =async function(req,res){
try {
    let opportunity = await Opportunity.findSingleById(req.params.id)
    opportunity = {
        title: opportunity.title,
        level: opportunity.level,
        amount:opportunity.amount,
        description: opportunity.description,
        date: opportunity.date,
        account:opportunity.account.title
        
    }
    let oppo=opportunity
//    let oppo [i] = Object.entries(opportunity).forEach(([key, value]) => {
//         console.log(`${key}: ${value}`)
//     })
    
    console.log(oppo)
    res.render('opportunities',{oppo: oppo})
} catch  {
    res.render('404')
}}
exports.ifAccountExists = function (req, res, next) {
    //  Account.findByAccountTitle(req.params.title).then(function(accDoc) {

    //     req.accountName = accDoc
    //     console.log(req.accountName)
    next()
    //  }).catch(function(){
    //      res.render('404')
    //  })
}
exports.viewOpportunities =async function (req, res) {
    let opportunity =await Opportunity.getOpportunity()
    console.log(opportunity)
    res.render('allOpportunities',{opportunity: opportunity})
}

