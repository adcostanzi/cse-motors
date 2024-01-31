// Show password button code
const passBtn = document.querySelector("#show-password");
passBtn.addEventListener("click", function() {
  const passInput = document.querySelector("#password");
  const type = passInput.getAttribute("type");
  if (type == "password") {
    passInput.setAttribute("type", "text");
    passBtn.innerHTML = "Hide Password";
  } else {
    passInput.setAttribute("type", "password");
    passBtn.innerHTML = "Show Password";
  }
});
