export default class RegistrationForm{
    constructor(){
        this.allFields = document.querySelectorAll("#registration-form .form-control")
        this.insertValidationElements()
        this.username = document.querySelector("#username-register")
        this.username.previousValue =""
        this.events()
    }
    //events
    events(){
         this.username.addEventListener("keyup",()=>{
             this.isDifferent(this.username,this.usernameHandler)
         })
    }
    //methods
    isDifferent(el,handler){
        if(el.previousValue != el.value){
            handler.call(this)
        }
        el.previousValue = el.value
    }
    usernameHandler(){
        //alert("hanler ran")
    }
    insertValidationElements(){
        this.allFields.forEach((el)=>{
            el.insertAdjacentHTML('afterend', '<div class="alert alert-danger small liveValidateMessage"></div>')
        })
    }

}