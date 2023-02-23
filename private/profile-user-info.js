window.onload = () => {
  loadUserInfo();

  loadUserProfilePic();

  loadUsername();

  loadEmail();

  document
    .querySelector("#updatePassword")
    .addEventListener("submit", updatePassword);
};

const loadFile = function (event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.querySelector("#profilePic > img");
    console.log(reader.result);
    output.src = reader.result;
  };
  console.log(event.target.files[0]);
  reader.readAsDataURL(event.target.files[0]);
};

document
  .querySelector("#formUpdateProfile")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    //console.log(form.img.files[0]);
    formData.append("image", form.img.files[0]);
    //console.log(formData.get("image"));
    const resp = await fetch("/userInfo", {
      method: "PUT",
      body: formData,
    });

    const result = await resp.json();

    console.log("from profile-user-info line 44:", result);
  });

async function loadUserInfo() {
  const resp = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await resp.json();

    const hiTitle = document.createElement("h3");
    hiTitle.textContent = `Hi, ${user.username}`;
    document.querySelector("#hi").appendChild(hiTitle);

    const userIcon = document.querySelector("#icon-container");
    //const hiIcon = document.createElement("img");
    userIcon.innerHTML = `<img src="./${user.profile_picture}" onerror="this.onerror='null';this.src='https://cdn-icons-png.flaticon.com/512/25/25634.png'" alt="" id="userIconImg" width = "50" height = "50"></img>`;

    document.querySelector("#icon-container").appendChild(userIcon);
  }
}

async function loadUsername() {
  const resp = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await resp.json();
    const usernameTitle = document.createElement("box5");
    usernameTitle.textContent = `${user.username}`;
    document.querySelector("#username").appendChild(usernameTitle);
  }
}

async function loadUserProfilePic() {
  const resp = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await resp.json();
    const userProfilePic = document.querySelector(".profile-picture-container");
    userProfilePic.innerHTML = `<img src="./${user.profile_picture}" alt="" class="profile-picture"></img>`;
  }
}

async function loadEmail() {
  const resp = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await resp.json();
    console.log(user);
    const emailTitle = document.createElement("box5");
    emailTitle.textContent = `${user.email}`;
    document.querySelector("#email").appendChild(emailTitle);
  }
}

async function updatePassword(e) {
  e.preventDefault();

  const pw1 = document.getElementById("newPassword").value;
  const pw2 = document.getElementById("confirmPassword").value;

  if (pw1 == "") {
    document.getElementById("message1").innerHTML = "Fill the password please!";
    return false;
  }

  if (pw2 == "") {
    document.getElementById("message2").innerHTML =
      "Enter the password please!";
    return false;
  }

  if (pw1 != pw2) {
    document.getElementById("message2").innerHTML =
      "Passwords are not the same!";
  } else {
    const newPassword = pw2;

    console.log("newpw:", newPassword);
    const resp = await fetch("/changePassword", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newPassword,
      }),
    }).then(async (res) => await res.json());
    console.log("resp:", resp);
    if (resp.message === "success") {
      window.location = "/profile-user-info.html";
    }

    alert("Your password created successfully!");
  }
}
