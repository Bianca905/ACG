window.onload = () => {
  loadUserInfo();
  listRecords();
};

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

// async function loadUserInfo() {
//   const resp = await fetch("/userInfo");
//   if (resp.status === 200) {
//     const user = await resp.json();
//     const hiTitle = document.createElement("h3");
//     hiTitle.textContent = `Hi, ${user.username}`;
//     document.querySelector("#hi").appendChild(hiTitle);
//   }
// }

// async function loadUsername() {
//   const resp = await fetch("/userInfo");
//   if (resp.status === 200) {
//     const user = await resp.json();
//     const usernameTitle = document.createElement("box5");
//     usernameTitle.textContent = `${user.username}`;
//     document.querySelector("#username").appendChild(usernameTitle);
//   }
// }

// async function loadEmail() {
//   const resp = await fetch("/userInfo");
//   if (resp.status === 200) {
//     const user = await resp.json();
//     console.log(user);
//     const emailTitle = document.createElement("box5");
//     emailTitle.textContent = `${user.email}`;
//     document.querySelector("#email").appendChild(emailTitle);
//   }
// }

////////////////////////// function start ///////////////////
async function listRecords() {
  const resp = await fetch(`/userInfo/uploadRecords`);
  const listRecordArr = await resp.json(); //json = db

  const listingRecordArea = document.querySelector("#listingRecordArea");
  // console.log("listingRecorddArea: ", listingRecordArea);
  let allListingchild = document.querySelectorAll("#listingRecordArea div");
  allListingchild.forEach((child) => listingRecordArea.removeChild(child));

  //listingRecordArea.innerHTML = "";

  for (const listing of listRecordArr) {
    console.log(listing);
    const uploadRecordEle = document.createElement("div");
    uploadRecordEle.className = "recordBox";
    uploadRecordEle.setAttribute("listing-id", `${listing.id}`);
    uploadRecordEle.setAttribute("listing-user-id", `${listing.user_id}`);

    const listingImgContainer = document.createElement("div");
    listingImgContainer.className = "listingImgContainer";
    listingImgContainer.setAttribute("listing-id", `${listing.id}`);
    listingImgContainer.setAttribute("listing-user-id", `${listing.user_id}`);
    uploadRecordEle.appendChild(listingImgContainer);

    const listingImage = document.createElement("img");
    // listingImage.setAttribute('width','100px')
    listingImage.src = listing.image;
    listingImgContainer.appendChild(listingImage);
    //console.log('check listing image from HTML:',listing.image);

    const detailArea = document.createElement("div");
    detailArea.className = "detail-div";

    const listingName = document.createElement("div");
    listingName.classList.add("listingUploadName");
    listingName.textContent = listing.name;
    detailArea.appendChild(listingName);

    const listingCondition = document.createElement("div");
    listingCondition.className = "listingCondition";
    if (listing.is_brand_new === true) {
      listingCondition.innerText = "全新";
    } else {
      listingCondition.innerText = "已用過";
    }
    detailArea.appendChild(listingCondition);

    const listingPrice = document.createElement("div");
    listingPrice.classList.add("listingUploadPrice");
    listingPrice.textContent = `HK$ ${listing.price}`;
    detailArea.appendChild(listingPrice);

    uploadRecordEle.appendChild(detailArea);
    listingRecordArea.appendChild(uploadRecordEle);

    const deleteButton = document.createElement("i");
    deleteButton.className = "bi bi-x-circle-fill";
    uploadRecordEle.appendChild(deleteButton);

    if (listing.is_deleted === true) {
      uploadRecordEle.remove();
    }
  }

  document
    .querySelector("#listingRecordArea")
    .addEventListener("click", async (e) => {
      if (e.target.matches(".bi-x-circle-fill")) {
        const deleteButton = e.target;
        const itemDiv = deleteButton.closest(".recordBox");
        const listingId = itemDiv.getAttribute("listing-id");

        Swal.fire({
          title: "你要確定嗎?",
          text: "確定後將不能更改!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "取消",
          confirmButtonText: "刪除",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const resp = await fetch(`/userInfo/uploadRecords/${listingId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                is_deleted: true,
              }),
            });
            const dbResult = await resp.json();
            console.log(dbResult);

            Swal.fire("產品已刪除!", "產品已不存在", "success");

            listRecords();
          }
        });
      }
    });
}
////////////////////////////////////////// funtion end ///////////////

// for (const listingUploadRecord of listingUploadRecords) {
//   const uploadRecordEle = document.createElement("div");
//   uploadRecordEle.className = "listingUploadImage";
//   uploadRecordEle.textContent = `${listing.images}`;
// //console.log('check listing image from HTML:',listing.image);

//   const detailArea = document.createElement("div");
//   detailArea.className = "detail-div";

//   const listingName = document.createElement("div");
//   listingName.className.add("listingUploadName");
//   listingName.textContent = `${listing.name}`
//   detailArea.appendChild(listingName);

//   const listingPrice = document.createElement("div");
//   listingPrice.className.add("listingUploadPrice");
//   listingName.textContent = `${listing.price}`
//   detailArea.appendChild(listingPrice);

//   uploadRecordEle.appendChild(detailArea);
//   box-listingRecord.appendChild(uploadRecordEle)

// }
// for (const listing of listingUploadRecord) {
//   boxListingRecordContainer.innerHTML +=
//     /*html*/

//     `<div class = box-detail-container>
//   <div class = box-info-container>
//   <div class="box-image-container"><img src="${listing.image}" alt="${listing.name}" class="box-image"></div>

//   <div class="box-name">${listing.name}</div>
//   <div class="box-price">${listing.price}</div>

//   `;
// }

document.querySelector("#listingRecordArea").addEventListener("click", (e) => {
  e.preventDefault();
  const itemDiv = e.target;
  const item = itemDiv.closest(".listingImgContainer");
  const itemId = item.getAttribute("listing-id");
  const userId = item.getAttribute("listing-user-id");
  console.log(itemId);
  console.log(userId);

  window.location.href = `/item-details-with-login.html?listing_id=${itemId}&user_id=${userId}`;
});
