window.onload = async () => {
  loadUserInfo();
  await loadListings();
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

//-----Load Listings Data-----

async function loadListings() {
  const resp = await fetch("/listings");
  const listings = await resp.json();
  const favouredItemsJson = await fetch("/listings/loadfavoured");
  const favouredItems = await favouredItemsJson.json();

  console.log("favouredItems: ", favouredItems);
  const listingArea = document.querySelector("#listing-area");
  listingArea.innerHTML = "";

  for (let listing of listings) {
    const itemBox = document.createElement("div");
    itemBox.className = "item-box";
    itemBox.setAttribute("listing-id", `${listing.id}`);
    itemBox.setAttribute("user-id", `${listing.user_id}`);

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const itemImage = document.createElement("img");
    itemImage.src = `./${listing.image}`;

    itemImage.alt = `alt="${listing.name}`;
    itemImage.className = "item-image";

    const itemDetails = document.createElement("div");
    itemDetails.className = "item-info";

    const itemName = document.createElement("div");
    itemName.className = "item-name";
    itemName.innerText = `${listing.name}`;

    const itemCondition = document.createElement("div");
    itemCondition.className = "item-condition";
    if (listing.is_brand_new === true) {
      itemCondition.innerText = "全新";
    } else {
      itemCondition.innerText = "已用過";
    }

    const priceLikeContainer = document.createElement("div");
    priceLikeContainer.className = "price-like-container";

    const itemPrice = document.createElement("div");
    itemPrice.className = "item-price";
    itemPrice.innerText = "HK$" + `${listing.price}`;

    const likeButton = document.createElement("i");
    const favouredChecking = favouredItems.filter(
      (item) => item.listing_id === listing.id
    );
    console.log("favouredChecking: ", favouredChecking);
    if (favouredChecking.length > 0) {
      likeButton.classList.add(
        "bi",
        "bi-heart-fill",
        "likeIcon",
        "text-danger"
      );
    } else {
      likeButton.classList.add("bi", "bi-heart", "likeIcon");
    }
    likeButton.setAttribute("data-id", listing.id);

    listingArea.appendChild(itemBox);
    itemBox.appendChild(imageContainer);
    imageContainer.appendChild(itemImage);
    itemBox.appendChild(itemDetails);
    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemCondition);
    itemDetails.appendChild(priceLikeContainer);
    priceLikeContainer.appendChild(itemPrice);
    priceLikeContainer.appendChild(likeButton);

    // -- Version 1--
    //   if (listing.is_brand_new.value = true) {
    // 	 condition = "Brand New"
    //   } else {
    // 	condition = "Used"
    //   };

    //   listingArea.innerHTML +=  /*html*/
    //   `<div class="col-md-3 listing-box">
    // 	  <div class="image-container">
    // 		  <img src="./uploads/${listing.image}" alt ="${listing.name}" class="item-image">
    // 	  </div>
    // 	  <div class="item-details">
    // 		  <div class="item-name">${listing.name}</div>
    // 		  <div class="item-condition">${condition}</div>
    // 		  <div class="price-like-container">
    // 			  <div class="item-price">HK$${listing.price}</div>
    // 			  <i class="bi bi-heart"></i>
    // 		  </div>
    // 	  </div>
    //   </div>`
  }

  document.querySelectorAll(".likeIcon").forEach((heartIcon) => {
    heartIcon.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      // e.preventDefault()
      e.target.classList.toggle("bi-heart");
      e.target.classList.toggle("bi-heart-fill");
      e.target.classList.toggle("text-danger");

      setFavourite(e);
    });
  });

  async function setFavourite(e) {
    //   const resp = await fetch("/:listingId/favoured");
    //   const savedFavourite = await resp.json();

    // let is_favoured = false;
    if (e.target.classList === "text-danger" || "bi-heart-fill") {
      // is_favoured = true;
      const url = `listings/${e.target.dataset.id}/favoured`;
      const resp = await fetch(url);
      const respJson = await resp.json();
    }
  }

  //-----------------------------------------------------------------//
  document.querySelectorAll("#listing-area .image-container").forEach((elem) =>
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      const itemDiv = e.target;
      const item = itemDiv.closest(".item-box");
      const itemId = item.getAttribute("listing-id");
      const userId = item.getAttribute("user-id");

      window.location.href = `/item-details-with-login.html?listing_id=${itemId}&user_id=${userId}`;
    })
  );
}

//---- Click to specific item for linking to details page----

// const heartIcon = document.querySelector('.bi-heart')
//     heartIcon.addEventListener('click',function onclick(e){
// 		document.querySelector('i').classList.remove('"bi", "bi-heart');
// 		document.querySelector('i').classList.add('bi', 'bi-heart-fill', 'text-danger');

//     })
