window.onload = () => {
  loadUserInfo();
  loadSavedFavourites();
};

async function loadUserInfo() {
  const resp = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await resp.json();

    const hiTitle = document.createElement("h3");
    hiTitle.textContent = `Hi, ${user.username}`;
    document.querySelector("#hi").appendChild(hiTitle);

    const userIcon = document.querySelector("#icon-container");
    userIcon.innerHTML = `<img src="./${user.profile_picture}" onerror="this.onerror='null';this.src='https://cdn-icons-png.flaticon.com/512/25/25634.png'" alt="" id="userIconImg" width = "50" height = "50"></img>`;

    document.querySelector("#icon-container").appendChild(userIcon);
  }
}

async function loadSavedFavourites() {
  const resp = await fetch("/userInfo/favourites");
  const userFavArr = await resp.json();

  const sliderContainer = document.querySelector("#slider-container");
  let allSliderContainer = document.querySelectorAll("#slider-container div");
  allSliderContainer.forEach((child) => sliderContainer.removeChild(child));

  for (const userFav of userFavArr) {
    const uploadRecordEle = document.createElement("div");
    uploadRecordEle.className = "recordBox";
    uploadRecordEle.setAttribute("listing-id", `${userFav.id}`);
    uploadRecordEle.setAttribute("listing-user-id", `${userFav.user_id}`);
    sliderContainer.appendChild(uploadRecordEle);

    const favImgContainer = document.createElement("div");
    favImgContainer.className = "favImgContainer";
    uploadRecordEle.appendChild(favImgContainer);

    const favImage = document.createElement("img");
    favImage.src = `${userFav.image}`;
    favImage.alt = `${userFav.name}`;
    favImgContainer.appendChild(favImage);

    const detailArea = document.createElement("div");
    detailArea.className = "detail-div";
    uploadRecordEle.appendChild(detailArea);

    const favName = document.createElement("div");
    favName.classList.add("favName");
    favName.innerText = `${userFav.name}`;
    detailArea.appendChild(favName);

    const favCondition = document.createElement("div");
    favCondition.classList.add("favCondition");
    favCondition.innerText = userFav.is_brand_new ? "全新" : "已用過";
    detailArea.appendChild(favCondition);

    const priceLikeContainer = document.createElement("div");
    priceLikeContainer.className = "price-like-container";
    detailArea.appendChild(priceLikeContainer);

    const favPrice = document.createElement("div");
    favPrice.classList.add("favPrice");
    favPrice.textContent = `HK$ ${userFav.price}`;
    priceLikeContainer.appendChild(favPrice);

    const likeButton = document.createElement("i");
    likeButton.classList.add("bi", "bi-heart", "likeIcon", "text-danger");
    likeButton.setAttribute("data-id", userFav.id);
    likeButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      e.target.classList.toggle("bi-heart");
      e.target.classList.toggle("bi-heart-fill");
      e.target.classList.toggle("text-danger");

      setFavourite(e, listing_id);
    });

    priceLikeContainer.appendChild(likeButton);
  }
}

async function setFavourite(e, listing_id) {
  if (e.target.classList === "text-danger" || "bi-heart-fill") {
    const url = `/userInfo/favoured/${listing_id}`;
    const resp = await fetch(url);
    await resp.json();
  }
}

document.querySelector("#slider-container").addEventListener("click", (e) => {
  e.preventDefault();
  const itemDiv = e.target;
  const item = itemDiv.closest(".recordBox");
  const itemId = item.getAttribute("listing-id");
  const userId = item.getAttribute("listing-user-id");

  window.location.href = `/item-details-with-login.html?listing_id=${itemId}&user_id=${userId}`;
});
