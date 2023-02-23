window.onload = async () => {
  await loadUserInfo();
  await loadMadeOfferListings();
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

async function loadMadeOfferListings() {
  const resp = await fetch("/user/listings/offers/made");
  const madeOfferItems = await resp.json();

  const listingArea = document.querySelector("#listing-area");
  listingArea.innerHTML = "";

  for (let madeOfferItem of madeOfferItems) {
    console.log(madeOfferItem);

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
    itemBox.setAttribute("offer-id", `${madeOfferItem.id}`);
    itemBox.setAttribute("listing-id", `${madeOfferItem.listing_id}`);
    itemBox.setAttribute("listing-user-id", `${madeOfferItem.user_id}`);

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const itemImage = document.createElement("img");
    itemImage.src = `./${madeOfferItem.image}`;
    itemImage.alt = `alt="${madeOfferItem.name}`;
    itemImage.className = "item-image";

    const itemInfo = document.createElement("div");
    itemInfo.className = "item-info";

    const itemName = document.createElement("div");
    itemName.className = "item-name";
    itemName.innerText = `${madeOfferItem.name}`;

    const itemCondition = document.createElement("div");
    itemCondition.className = "item-condition";
    if (madeOfferItem.is_brand_new === true) {
      itemCondition.innerText = "全新";
    } else {
      itemCondition.innerText = "已用過";
    }

    const itemPrice = document.createElement("div");
    itemPrice.className = "item-price";
    itemPrice.innerText = `HK$ ${madeOfferItem.price}`;

    const offerBox = document.createElement("div");
    offerBox.className = "offer-box";

    const offerUser = document.createElement("div");
    offerUser.className = "offer-user";

    const offerInfo = document.createElement("span");
    offerInfo.className = "offer-info";
    offerInfo.innerText = `已出價: HK$${madeOfferItem.offer_price}`;

    const actionbutton = document.createElement("div");
    actionbutton.className = "action-button";

    if (
      madeOfferItem.is_accepted === false &&
      madeOfferItem.is_declined === false
    ) {
      actionbutton.innerHTML = `<button type="button" class="btn btn-primary">等待賣家回應</button>`;
    } else if (madeOfferItem.is_declined === true) {
      actionbutton.innerHTML = `<button type="button" class="btn btn-light">出價已被拒絕</button>`;
    } else if (madeOfferItem.is_accepted === true) {
      actionbutton.innerHTML = `<button type="button" class="btn btn-success" ">出價已被接受</button>`;
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
    offerUser.appendChild(offerInfo);
    offerBox.appendChild(actionbutton);
  }
}

document.querySelector("#listing-area").addEventListener("click", (e) => {
  e.preventDefault();
  const itemDiv = e.target;
  const item = itemDiv.closest(".item-box");
  const itemId = item.getAttribute("listing-id");
  const userId = item.getAttribute("listing-user-id");
  console.log(itemId);
  console.log(userId);

  window.location.href = `/item-details-with-login.html?listing_id=${itemId}&user_id=${userId}`;
});
