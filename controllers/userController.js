const User = require('../models/User')
const Account = require('../models/Account')


exports.login = function (req, res) {
    let user = new User(req.body)
    user.login().then((result) => {
        req.session.user = {
            avatar: user.avatar,
            username: user.data.username,
            _id: user.data._id
        }
        req.session.save(() => {
            res.redirect('/')
        })
    }).catch((e) => {
        req.flash('errors', e)
        req.session.save(() => {
            res.redirect('/')
        })
    })
}
exports.register = (req, res) => {
    let user = new User(req.body)
    user.register().then(()=>{
        req.session.user = ({username:this.data.username,avatar: user.avatar,_id: user.data._id})
        req.session.save(() => {
            res.redirect('/')
        })
    }).catch((regErrors)=> {

        regErrors.forEach(function(err){ 
            req.flash('regErrors',err)
        })
    
        req.session.save(() => {
            res.redirect('/')
        })
    })
    
}
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}
exports.home =async function(req, res) {
    if (req.session.user) {
        //fectch feed of accounts
        let account =await Account.getAccounts()
        console.log(account)
        res.render('home-dashboard',{account:account})
    } else {
        res.render('home', {
            errors: req.flash('errors'),
            regErrors: req.flash('regErrors')
        })
    }
}

exports.mustBeLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("errors", 'you must be logged in')
        req.session.save(() => {
            res.redirect('/')
        })
    }

}

exports.ifUserExists = function(req,res,next){
User.findByUserName(req.params.username).then((authorDocument)=>{
req.profileUser = authorDocument
next()
}).catch(()=>{
res.render('404')
})
}
exports.profile = function(req,res){
    // ask account model for certain creations fro certain usr ids
Account.findByUserId(req.profileUser._id).then(function(account){
 res.render('profile',{
        account:account,
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar
    })
}).catch(()=>{
    res.render('404')
})
   
}