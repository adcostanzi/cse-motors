const formInfo = document.querySelector("#update-account-info")
formInfo.addEventListener("change", function(){
    const updateBtn = document.querySelector("#updateBtn")
    updateBtn.removeAttribute("disabled")
})




const formPass = document.querySelector("#update-account-password")
formPass.addEventListener("change", function(){
    const changeBtn = document.querySelector("#changeBtn")
    changeBtn.removeAttribute("disabled")
})