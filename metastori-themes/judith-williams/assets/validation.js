const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EMAIL_REGEX_STRING = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";


document.addEventListener("DOMContentLoaded", (event) => {
    initValidations()
});

function initValidations(){
    emailValidation();
}
function emailValidation(){
    var mailInput =  document.querySelector("[type=email]");
    if(mailInput) {
        mailInput.setAttribute("pattern", EMAIL_REGEX_STRING);
        mailInput.addEventListener("keyup", function () {
            if (!EMAIL_REGEX.test(this.value)) {
                if (this.classList.contains("border-green"))
                    this.classList.remove("border-green");
                if (!this.classList.contains("border-red"))
                    this.classList.add("border-red");
                this.setCustomValidity("Enter an valid email.");
                invalidateCheckoutForm();
            } else {
                if (this.classList.contains("border-red"))
                    this.classList.remove("border-red");
                if (!this.classList.contains("border-green"))
                    this.classList.add("border-green");
                this.setCustomValidity("");
                validCheckoutForm();
            }
        });
    }
}



function invalidateCheckoutForm(){
    var button = document.getElementById("continue_button");
    if(button){
        if(!button.classList.contains("background-red"))
            button.classList.add("background-red");
        button.setAttribute("disabled", true);
    }

}

function validCheckoutForm(){
    var button = document.getElementById("continue_button");
    if(button) {
        if (button.classList.contains("background-red"))
            button.classList.remove("background-red");
        button.removeAttribute("disabled");
    }
}