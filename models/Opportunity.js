const {
    ObjectID
} = require('mongodb')
const Account = require('./Account')
const createOpportunity = require('../db').db().collection("opportunities")

let Opportunity = function (data, accId) {
    this.data = data
    this.errors = []
    this.accId = accId
}
Opportunity.prototype.validate = function () {
    if (this.data.title == "") {
        this.errors.push("you must provide opportunity title")
    }
    if (this.data.amount == "") {
        this.errors.push("you must provide amount")
    }
    if (this.data.level == "") {
        this.errors.push("you must provide level")
    }
    if (this.data.description == "") {
        this.errors.push("you must provide decription")
    }




}
Opportunity.prototype.cleanUp = function () {
    if (typeof (this.data.title) != "string") {
        this.data.title = ""
    }
    if (typeof (this.data.amount) != "string") {
        this.data.amount = ""
    }
    if (typeof (this.data.level) != "string") {
        this.data.level = ""
    }
    if (typeof (this.data.description) != "string") {
        this.data.description = ""
    }
    this.data = {
        title: this.data.title.trim(),
        amount: this.data.amount.trim(),
        level: this.data.level.trim(),
        description: this.data.description.trim(),
        date: new Date(),
        account: ObjectID(this.accId)
    }



}
Opportunity.prototype.create = function () {
    return new Promise((resolve,reject)=>{
        this.validate()
        this.cleanUp()
        if(!this.errors.length){
            createOpportunity.insertOne(this.data).then((info)=>{
                resolve(info.ops[0]._id)
            }).catch(()=>{
                this.errors.push("try later")
                reject(this.errors)
            })
        }else{reject(this.errors)}

    })

}
Opportunity.findSingleById = function(id){
return new Promise(async function(resolve,reject){
if(typeof(id) != "string" || !ObjectID.isValid(id)){
    reject()
    return
}
let opportunity =await createOpportunity.aggregate([
    {$match: {_id: new ObjectID(id)}},
    {$lookup: {from: "accounts", localField: "account", foreignField: "_id", as: "oppDoc"}},
    {$project:{
        title: 1,
        level: 1,
        amount: 1,
        description: 1,
        date: 1,
        account:{$arrayElemAt: ["$oppDoc",0]}
    }}

]).toArray()
//clean account
opportunity = opportunity.map(function(opportunity){
    
    opportunity.account = {
        title: opportunity.account.title
    }
return opportunity
})
if(opportunity.length){
    console.log(opportunity[0])
resolve(opportunity[0])
}else{
reject()
}
})
}


module.exports = Opportunity