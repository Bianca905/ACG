window.onload = () => {
  initLoginForm();
  loadUserInfo();
  rejectLogin();
};

// function initLoginForm() {
// 	document
// 		.querySelector('#form-login')
// 		.addEventListener('submit', async (e) => {
// 			e.preventDefault()
// 			const form = e.target
// 			console.log(`check`)
// 			const formBody = {
// 				username: form.username.value,
// 				password: form.password.value
// 			}
// 			const resp = await fetch('/login', {
// 				method: 'POST',
// 				headers: {
// 					'content-type': 'application/json;charset=utf-8'
// 				},
// 				body: JSON.stringify(formBody)
// 			})
// 			if (resp.status === 200) {
// 				window.location = '/logined.html'
// 			} else {
// 				const data = await resp.json()
// 				alert(data.message)
// 			}
// 		})
// }

//<<<<<<< HEAD
function initLoginForm() {
  document
    .querySelector("#form-login")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      console.log(`check`);
      const formBody = {
        username: form.username.value,
        password: form.password.value,
      };
      const resp = await fetch("/login", {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        window.location = "/logined.html";
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}

function initRegisterForm() {
  document
    .querySelector("#form-register")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      console.log("check register");
      const formBody = {
        username: form.username.value,
        password: form.password.value,
        email: form.email.value,
      };
      const resp = await fetch("/register", {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        window.location = "/logined.html";
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}

async function rejectLogin() {
  const resp = await fetch("/login");
  if (resp.status === 400) {
    const rejectLoginContent = document.createElement("h3");
    rejectLoginContent.textContent = `Invalid username/password`;
    document.querySelector("#rejectLogin").appendChild(rejectLoginContent);
  }
}
