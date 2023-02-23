window.onload = () => {
  loadCurrentListings();
};

async function loadCurrentListings() {
  const search = new URLSearchParams(location.search);
  const listingId = search.get("listing_id");

  const userId = search.get("user_id");

  const resp = await fetch(`/listings/${listingId}/${userId}`);
  const listing = await resp.json();

  const itemContainer = document.querySelector("#item-container");
  itemContainer.setAttribute("listing-id", `${listing.id}`);
  itemContainer.setAttribute("user-id", `${listing.user_id}`);
  itemContainer.innerHTML = "";

  if (listing.is_brand_new === true) {
    condition = "全新";
  } else {
    condition = "已用過";
  }

  if (listing.is_postage === true) {
    delivery = "郵寄";
  } else {
    delivery = "面交";
  }

  const postedDate = `${listing.created_at}`.slice(0, 10);

  const itemCategory = listing.category;
  if (itemCategory === "figures") {
    category = "人型公仔";
  } else if (itemCategory === "books") {
    category = "漫畫藏書";
  } else if (itemCategory === "accessories") {
    category = "配件";
  } else if (itemCategory === "others") {
    category = "其他";
  }

  itemContainer.innerHTML +=
    /*html*/
    `
      <div class="image-container">
          <img src="./${listing.image}" alt="${listing.name}" class="item-image">
      </div>
      <div class="details-container">
          <div class="item-info">
              <div class="item-name">${listing.name}</div>
              <div class="item-price">HK$${listing.price}</div>
              <div class="condition-delivery-container">
                  <div class="item-condition">
                      <i class="bi bi-app-indicator"></i>
                      ${condition}
                  </div>
                  <div class="delivery-method">
                      <i class="fa-regular fa-handshake"></i>
                      ${delivery}
                  </div>
                  <div class="meet-up-location">
                      <i class="bi bi-geo-alt"></i>
                      ${listing.meet_up_location}
                  </div>
              </div>
              <div class="cat-date-container">
                  <div class="item-category">
                    <i class="bi bi-list-ul"></i>
                      ${category}
                  </div>
                  <div class="item-posted-date">
                      <i class="bi bi-clock-history"></i>
                      ${postedDate}
                  </div>
              </div>
          </div>
          <div class="item-description">
              ${listing.description}
          </div>
        </div>`;
}
