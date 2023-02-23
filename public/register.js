// const switchToRegisterRoute = document.querySelector('.btn-register').addEventListener('click',(e)=>{
//     window.location='/register';
// })

const form = document.querySelector("#form-register");
form.addEventListener("submit", registerUser);

async function registerUser(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.username.value;
  const password = form.password.value;
  const email = form.email.value;
  console.log("form: ", username, password);
  const result = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  }).then(async (res) => await res.json());
  console.log(result);
  if (result.message === "success") {
    window.location = "/logined.html";
  }
  if (
    result.message ===
    "Username/ email have already been used, please try another one!"
  ) {
    const rejectRegisterContent = document.createElement("h6");
    rejectRegisterContent.textContent = `Username/ email have already been used, please try another one!`;
    document
      .querySelector("#rejectRegister")
      .appendChild(rejectRegisterContent);
    // const warning = document.querySelector('#rejectRegister')
    // console.log('warning:',warning)
  }
}
