const formReview = document.querySelector("#review-form")
formReview.addEventListener("change", function(){
    const reviewBtn = document.querySelector("#reviewBtn")
    reviewBtn.removeAttribute("disabled")
})