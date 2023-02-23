window.onload = async () => {
  loadUserInfo();
};
//-----------Hi, xxx and icon---------//
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

// Preview upload image
const loadFile = function (event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.querySelector(".item-image-box > img");
    console.log(reader.result);
    output.src = reader.result;
  };
  console.log(event.target.files[0]);
  reader.readAsDataURL(event.target.files[0]);
};

// POST ---upload listing---

function oneCheckedBox(checkbox_id) {
  if (document.getElementById(checkbox_id).checked) {
    for (var i = 1; i < 3; i++) {
      document.getElementById("CheckId" + i).checked = false;
    }
    document.getElementById(checkbox_id).checked = true;
  }
}

document.querySelector("#sell-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();
  const previewImageBox = document.querySelector(".item-image-box");

  formData.append("image", form.image.files[0]);
  formData.append("name", form.name.value);
  formData.append("description", form.description.value);
  formData.append("price", form.price.value);
  formData.append("category", form.category.value);
  formData.append("brand_new", form.brand_new.checked);
  formData.append("used", form.used.checked);
  formData.append("postage", form.postage.checked);
  formData.append("meet_up", form.meet_up.checked);
  formData.append("meet_up_location", form.meet_up_location.value);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "你要確定嗎??",
      text: "請確認產品資料無誤",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確認",
      cancelButtonText: "取消",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const resp = await fetch("/listings", {
          method: "POST",
          body: formData,
        });

        const dbResult = await resp.json();

        if (resp.status !== 201) {
          alert("Missing Name / Price");
        } else {
          console.log(dbResult);
          form.reset();
        }

        swalWithBootstrapButtons.fire(
          "你已成功上傳產品出售!",
          "你的產品已在ACG平台上發佈出售 ",
          "success"
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("已取消", "你並未上傳任何產品", "error");
      }
    });

  if (!form.image.files[0]) {
    Swal.fire({
      icon: "error",
      title: "錯誤...",
      text: "請為即將發佈的產品添加相片",
    });
  }

  if (!form.name.value || !form.price.value) {
    Swal.fire({
      icon: "error",
      title: "錯誤...",
      text: "請為即將發佈的產品填上名稱 / 價格",
    });
  }
});
