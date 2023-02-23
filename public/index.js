window.onload = () => {
  loadListings();
  initSearchOnChange();
  // loadSearchResult();
};

async function loadListings() {
  const searchParams = new URLSearchParams(window.location.search);
  let url = "/listings";
  if (searchParams.has("category")) {
    url += `?category=${searchParams.get("category")}`;
  }
  const resp = await fetch(url);
  const listings = await resp.json();
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
    if (listing.is_brand_new) {
      itemCondition.innerText = "全新";
    } else {
      itemCondition.innerText = "已用過";
    }

    const priceLikeContainer = document.createElement("div");
    priceLikeContainer.className = "price-like-container";

    const itemPrice = document.createElement("div");
    itemPrice.className = "item-price";
    itemPrice.innerText = "HK$" + `${listing.price}`;

    listingArea.appendChild(itemBox);
    itemBox.appendChild(imageContainer);
    imageContainer.appendChild(itemImage);
    itemBox.appendChild(itemDetails);
    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemCondition);
    itemDetails.appendChild(priceLikeContainer);
    priceLikeContainer.appendChild(itemPrice);
  }
}

//---- Click to specific item for linking to details page----

document.querySelector("#listing-area").addEventListener("click", (e) => {
  e.preventDefault();
  const itemDiv = e.target;
  const item = itemDiv.closest(".item-box");
  const itemId = item.getAttribute("listing-id");
  const userId = item.getAttribute("user-id");

  window.location.href = `/item-details.html?listing_id=${itemId}&user_id=${userId}`;
});

//---------load search results------------//
function loadSearchResult() {
  let search = document.querySelector("#searchBar");

  search.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    const resp = await fetch(`/listings?keyword=${form.keyword.value}`);
    const data = await resp.json();
    updateSearchResultUI(data);
  });
}

function updateSearchResultUI(data) {
  console.log(data);

  const searchResultArea = document.querySelector("#listing-area");
  searchResultArea.innerHTML = "";
  for (let result of data) {
    const uploadRecordEle = document.createElement("div");
    uploadRecordEle.className = "recordBox";
    uploadRecordEle.setAttribute("listing-id", `${result.id}`);
    uploadRecordEle.setAttribute("user-id", `${result.user_id}`);

    const resultImgContainer = document.createElement("div");
    resultImgContainer.className = "resultImgContainer";
    uploadRecordEle.appendChild(resultImgContainer);

    const resultImg = document.createElement("img");
    resultImg.src = `${result.image}`;
    resultImg.alt = `${result.name}`;
    resultImgContainer.appendChild(resultImg);
    const detailArea = document.createElement("div");
    detailArea.className = "detail-div";
    uploadRecordEle.appendChild(detailArea);

    const resultName = document.createElement("div");
    resultName.className = "resultName";
    resultName.innerHTML = `${result.name}`;
    detailArea.appendChild(resultName);

    const resultCondition = document.createElement("div");
    resultCondition.className = "result-condition";
    if (result.is_brand_new) {
      resultCondition.innerText = "全新";
    } else {
      resultCondition.innerText = "已用過";
    }

    const resultPrice = document.createElement("div");
    resultPrice.className = "resultPrice";
    resultPrice.innerHTML = `HK$ ${result.price}`;
    detailArea.appendChild(resultPrice);
    detailArea.appendChild(resultCondition);

    uploadRecordEle.appendChild(detailArea);
    searchResultArea.appendChild(uploadRecordEle);
  }
}

function initSearchOnChange() {
  const keywordInput = document.querySelector("#keyword");
  let intervalId;
  keywordInput.addEventListener("keyup", (e) => {
    if (intervalId) {
      clearTimeout(intervalId);
    }
    intervalId = setTimeout(async () => {
      const resp = await fetch(`/listings?keyword=${e.target.value}`);
      const data = await resp.json();
      updateSearchResultUI(data);
    }, 500);
  });
}
