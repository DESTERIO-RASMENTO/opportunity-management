const { ObjectID } = require("mongodb")
const { validate } = require("webpack")
const { post } = require("../router")
const User = require('./User')
const createCollection = require('../db').db().collection("accounts")
const userCollection = require('../db').db().collection("user")


let Account = function(data,userId){
this.data = data
this.errors = []
this.userId = userId
}
Account.prototype.validate =function(){
    if(this.data.title == ""){this.errors.push("you must provide company name")}
        if (this.data.body == "") {
            this.errors.push("you must provide company Address")
        }


}
Account.prototype.cleanUp =function ()  {
    if(typeof(this.data.title) != "string"){this.data.title = ""}
       
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        author: ObjectID(this.userId)
    }


}
Account.prototype.create = function() {
    return new Promise((resolve,reject)=>{
        //validate and cleanup
        this.cleanUp()
        this.validate()
        if(!this.errors.length){
            //save to db
            createCollection.insertOne(this.data).then((info)=>{
            resolve(info.ops[0]._id)
           }).catch(()=>{
               this.errors.push("try later")
            reject(this.errors)
           })
            
        }else{
            reject(this.errors)
        }
    })

}
Account.reusableAccountQuerry = function (uniqueOperations, visitorId) {
    return new Promise(async (resolve, reject) => {
        let aggOperations = uniqueOperations.concat([{
                $lookup: {
                    from: "user",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDocument"
                }
            },
            {
                $project: {
                    title: 1,
                    body: 1,
                    authorId: "$author",
                    author: {
                        $arrayElemAt: ["$authorDocument", 0]
                    }

                }
            }
        ])
        
        let account = await createCollection.aggregate(aggOperations).toArray()
        // clean author property 

        account = account.map(function (account) {
            account.isVisitorOwner = account.authorId.equals(visitorId)
            account.author = { 
                username: account.author.username,
                avatar: new User(account.author, true).avatar
            }
            return account
        })
        resolve(account)
    })

}

Account.findAccountById = function(id,visitorId){
    return new Promise(async (resolve,reject)=>{
        if(typeof(id) != "string" || !ObjectID.isValid(id)){
            reject()
            return
        }
        let account =await Account.reusableAccountQuerry([
            {$match: {_id: new ObjectID(id)}}
        ],visitorId)
        if(account.length){
            console.log(account[0])
            resolve(account[0])
        }else{
            reject()
        }
    })

}
Account.findByUserId = function(authorId){
return Account.reusableAccountQuerry([
    {$match: {author: authorId}},
    {$sort: {username: 1}}
])
}
Account.getAccounts =async function(){
    //create array of accounts for user
let accounts =await createCollection.find().toArray()
// let accounts = await userCollection.find({
//     authorId: new ObjectID(id)
// }).toArray()

return accounts
// accounts = accounts.map((accountDoc)=>{
// return accountDoc.author
// })
//   return Account.reusableAccountQuerry([
//       {$match: {author: {$in: accounts}}},
//       {$sort: {username: 1}}
//   ])  

}
Account.findByAccountTitle = function(title){
return new Promise(function(resolve,reject){
    if(typeof(title) != "string"){
        reject()
        return
    }
    createCollection.findOne({title: title}).then(function(accDoc){
        if(accDoc){
             accDoc = new Account(accDoc,true)
            accDoc = {
                //_id: accDoc.data._id,
                title: this.title
            }
            resolve(accDoc)
        }else{
            reject()
        }
    }).catch(function (){
        reject()
    })
})
}
module.exports = Account