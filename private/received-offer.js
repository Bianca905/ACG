window.onload = async () => {
  await loadUserInfo();
  await loadOfferedListings();
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
//-----Load Offered Listings Data-----

async function loadOfferedListings() {
  const resp = await fetch("/user/listings/offers/received");
  const offeredItems = await resp.json();

  const listingArea = document.querySelector("#listing-area");
  listingArea.innerHTML = "";

  for (let offeredItem of offeredItems) {
    console.log(offeredItem);

    //   if (offeredItem.is_brand_new.value = true) {
    // 	 condition = "Brand New"
    //   } else {
    // 	condition = "Used"
    //   };

    //   listingArea.innerHTML +=  /*html*/
    //   ` <div class="col-sm-4 item-box" data-id="${offeredItem.id}">
    //     <div class="image-container">
    //         <img src="./${offeredItem.image}" alt="${offeredItem.name}" class="item-image">
    //     </div>
    //     <div class="item-info">
    //         <div class="item-name">${offeredItem.name}</div>
    //         <div class="item-condition">${condition}</div>
    //         <div class="item-price">HK$${offeredItem.price}</div>
    //     </div>
    //     <div class="offer-box">
    //         <div class="offer-user">
    //         <i class="bi bi-person-fill"></i>
    //         ${offeredItem.username} Offered: HK$${offeredItem.offer_price}
    //         </div>
    //         <div class="action-button">
    //             <button type="button" class="btn btn-outline-success accept-button">Accept</button>
    //             <button type="button" class="btn btn-outline-danger decline-button">Decline</button>
    //         </div>
    //     </div>
    // </div> `

    const itemBox = document.createElement("div");
    itemBox.className = "col-sm-4 item-box";
    itemBox.setAttribute("offer-id", `${offeredItem.id}`);
    itemBox.setAttribute("listing-id", `${offeredItem.listing_id}`);
    itemBox.setAttribute("listing-user-id", `${offeredItem.user_id}`);

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";
    imageContainer.setAttribute("listing-id", `${offeredItem.listing_id}`);
    imageContainer.setAttribute("listing-user-id", `${offeredItem.user_id}`);

    const itemImage = document.createElement("img");
    itemImage.src = `./${offeredItem.image}`;
    itemImage.alt = `alt="${offeredItem.name}`;
    itemImage.className = "item-image";

    const itemInfo = document.createElement("div");
    itemInfo.className = "item-info";

    const itemName = document.createElement("div");
    itemName.className = "item-name";
    itemName.innerText = `${offeredItem.name}`;

    const itemCondition = document.createElement("div");
    itemCondition.className = "item-condition";
    if (offeredItem.is_brand_new === true) {
      itemCondition.innerText = "全新";
    } else {
      itemCondition.innerText = "已用過";
    }

    const itemPrice = document.createElement("div");
    itemPrice.className = "item-price";
    itemPrice.innerText = `${offeredItem.price}`;

    const offerBox = document.createElement("div");
    offerBox.className = "offer-box";

    const offerUser = document.createElement("div");
    offerUser.className = "offer-user";

    const userIcon = document.createElement("i");
    userIcon.className = "bi bi-person-fill";

    const offerInfo = document.createElement("span");
    offerInfo.className = "offer-info";
    offerInfo.innerText = `${offeredItem.username} 出價: HK$${offeredItem.offer_price}`;

    const actionbutton = document.createElement("div");
    actionbutton.className = "action-button";

    if (offeredItem.is_reserved === true && offeredItem.is_sold === false) {
      actionbutton.innerHTML = `<button type="button" class="btn btn-warning sold-button">賣出</button>`;
    } else if (offeredItem.is_declined === true) {
      actionbutton.innerHTML = `<button type="button" class="btn btn-light declined-status">已拒絕出價</button>`;
    } else if (offeredItem.is_sold === true) {
      actionbutton.innerHTML = `<button type="button" class="btn btn-dark sold-status">產品已出售</button>`;
    } else {
      actionbutton.innerHTML = ` <button type="button" class="btn btn-outline-success accept-button">接受</button>
        <button type="button" class="btn btn-outline-danger decline-button">拒絕</button>`;
    }

    listingArea.appendChild(itemBox);
    itemBox.appendChild(imageContainer);
    imageContainer.appendChild(itemImage);
    itemBox.appendChild(itemInfo);
    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemCondition);
    itemInfo.appendChild(itemPrice);
    itemBox.appendChild(offerBox);
    offerBox.appendChild(offerUser);
    offerUser.appendChild(userIcon);
    offerUser.appendChild(offerInfo);
    offerBox.appendChild(actionbutton);
  }
}

// ---- Accept / Decline Offers -----
document.querySelector("#listing-area").addEventListener("click", async (e) => {
  if (e.target.matches(".accept-button")) {
    // Accept logic

    const acceptButton = e.target;
    const itemDiv = acceptButton.closest(".item-box");
    const offerId = itemDiv.getAttribute("offer-id");
    const listingId = itemDiv.getAttribute("listing-id");

    Swal.fire({
      title: "你要確定嗎??",
      text: "確定後將不能更改!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "接受",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await fetch(
          `/user/listings/offers/${offerId}/${listingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_accepted: true,
              is_declined: false,
              is_reserved: true,
            }),
          }
        );
        const dbResult = await resp.json();
        console.log(dbResult);

        Swal.fire("已接受出價!", "請與買家聯絡", "success");

        loadOfferedListings();
      }
    });
  } else if (e.target.matches(".decline-button")) {
    // Decline logic

    const declineButton = e.target;
    const itemDiv = declineButton.closest(".item-box");
    const offerId = itemDiv.getAttribute("offer-id");
    const listingId = itemDiv.getAttribute("listing-id");

    Swal.fire({
      title: "你要確定嗎?",
      text: "確定後將不能更改!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "拒絕",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await fetch(
          `/user/listings/offers/${offerId}/${listingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_accepted: false,
              is_declined: true,
              is_reserved: false,
            }),
          }
        );
        const dbResult = await resp.json();
        console.log(dbResult);

        Swal.fire("已拒絕出價!", "產品將繼續出售", "success");

        loadOfferedListings();
      }
    });
  }
});

document.querySelector("#listing-area").addEventListener("click", async (e) => {
  if (e.target.matches(".sold-button")) {
    const soldButton = e.target;
    const itemDiv = soldButton.closest(".item-box");
    const offerId = itemDiv.getAttribute("offer-id");
    const listingId = itemDiv.getAttribute("listing-id");

    Swal.fire({
      title: "產品已經售出了嗎?",
      text: "此產品將不會顯示在市場上",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "確認",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await fetch(
          `/user/listings/offers/${offerId}/${listingId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              offerId: offerId,
              listingId: listingId,
            }),
          }
        );

        const dbResult = await resp.json();
        console.log(dbResult);

        const respIsSold = await fetch(
          `/user/listings/offers/${offerId}/${listingId}/sold`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_sold: true,
            }),
          }
        );

        const dbResult2 = await respIsSold.json();
        console.log(dbResult2);

        Swal.fire("產品已經出售", "多謝閣下使用ACG平台", "success");

        loadOfferedListings();
      }
    });
  }
});

document.querySelector("#listing-area").addEventListener("click", (e) => {
  e.preventDefault();
  const itemDiv = e.target;
  const item = itemDiv.closest(".image-container");
  const itemId = item.getAttribute("listing-id");
  const userId = item.getAttribute("listing-user-id");
  console.log(itemId);
  console.log(userId);

  window.location.href = `/item-details-with-login.html?listing_id=${itemId}&user_id=${userId}`;
});
