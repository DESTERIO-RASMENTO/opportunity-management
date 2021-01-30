const userCollection = require('../db').db().collection("user")
const bycrypt = require('bcryptjs')
const validator = require('validator')
const md5 = require('md5')
let User = function (data,getAvatar) {
    this.data = data
    this.errors = []
    if(getAvatar == undefined){getAvatar = false}
    if(getAvatar){this.getAvatar()}
}
User.prototype.validate =function(){
    return new Promise(async (resolve,reject)=>{
        
            if (this.data.username == "") {
                this.errors.push("please provide a username")
            }
            if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
                this.errors.push("username should only contain letters and numbers")
            }
            if (!validator.isEmail(this.data.email)) {
                this.errors.push("please provide an email address")
            }
            if (this.data.password == "") {
                this.errors.push("please provide a password")
            }
            //if (this.data.password == "") {this.errors.push("please confirm your passord")}
            if (this.data.password.length > 0 && this.data.password.length < 8) {
                this.errors.push("password must 8 characters long")
            }
            if (this.data.password.length > 8) {
                this.errors.push("password should not exceed 8 characters")
            }
            if (this.data.username.length > 0 && this.data.username.length < 4) {
                this.errors.push("username must be 4 characters long")
            }
            if (this.data.username.length > 20) {
                this.errors.push("username should not exceed 20 characters")
            }

            //check usr

            if (this.data.username.length > 3 && this.data.username.length < 21 && validator.isAlphanumeric(this.data.username)) {
                let usernameExists = await userCollection.findOne({
                    username: this.data.username
                })
                if (usernameExists) {
                    this.errors.push("user already exists")
                }
            }
            if (validator.isEmail(this.data.email)) {
                let emailExists = await userCollection.findOne({
                    email: this.data.email
                })
                if (emailExists) {
                    this.errors.push("email already exists")
                }
            }

       resolve() 
    })
}

User.prototype.cleanUp = function () {
    if (typeof (this.data.username) != "string") {
        this.data.username = ""
    }
    if (typeof (this.data.email) != "string") {
        this.data.email = ""
    }
    if (typeof (this.data.password) != "string") {
        this.data.password = ""
    }

    this.data = {
        username: this.data.username.trim(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
        //password:this.data.password


    }


}
User.prototype.login = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        userCollection.findOne({
            username: this.data.username
        }).then((attemptedUser) => {
            if (attemptedUser && bycrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.data = attemptedUser
                this.getAvatar()
                resolve("congrats")
            } else {
                reject("invalid username or password")
            }
        }).catch(() => {
            reject("try again")
        })

    })
}
User.prototype.register = function () {
    return new Promise(async (resolve, reject) => {
        //clean data
        this.cleanUp()
        //validate user
        await this.validate()
        //save to db
        if (!this.errors.length) {
            //has password
            let salt = bycrypt.genSaltSync(10)
            this.data.password = bycrypt.hashSync(this.data.password, salt)
            await userCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        } else {
            reject(this.errors)
        }
    })
}
User.prototype.getAvatar = function() {
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

User.findByUserName = function(username){
    return new Promise((resolve,reject)=>{
        if(typeof(username) != "string" ){
            reject()
            return
        }
        userCollection.findOne({username: username}).then((userDoc)=>{
            if(userDoc){
                userDoc = new User(userDoc,true)
                userDoc ={
                    _id: userDoc.data._id,
                    username: userDoc.data.username,
                    avatar: userDoc.avatar
                }
                resolve(userDoc)
            }else{
                reject()
            }

        }).catch(()=>{
            reject()
        })
    })
}

module.exports = User