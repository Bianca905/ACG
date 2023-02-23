window.onload = () => {
  loadUserInfo();
  loadCurrentListings();
};

async function loadUserInfo() {
  const resp = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await resp.json();

    const hiTitle = document.createElement("h3");
    hiTitle.textContent = `Hi, ${user.username}`;
    document.querySelector("#hi").appendChild(hiTitle);

    const hiIcon = document.createElement("img");

    hiIcon.src = `${user.profile_picture}`;
    hiIcon.alt = `${user.name}`;
    hiIcon.width = 50;
    hiIcon.height = 50;

    document.querySelector("#hi-icon-container").appendChild(hiIcon);
  }
}

async function loadCurrentListings() {
  const search = new URLSearchParams(location.search);
  const listingId = Number(search.get("listing_id"));
  console.log("listingId: ", listingId);

  const userId = search.get("user_id");
  console.log(userId);

  const resp = await fetch(`/listings/${listingId}/${userId}`);
  const listing = await resp.json(); //json = db

  const favourRespJson = await fetch("/listings/loadfavoured");
  const favourResp = await favourRespJson.json();
  const favourList = favourResp
    .map((item) => item.listing_id)
    .filter((item) => item);

  const itemContainer = document.querySelector("#item-container");
  itemContainer.setAttribute("data-id", `${listing.id}`);
  itemContainer.innerHTML = "";
  let condition = listing.is_brand_new ? "全新" : "已用過";
  let delivery = listing.is_postage ? "郵寄" : "面交";

  const postedDate = `${listing.created_at}`.slice(0, 10);
  console.log(postedDate);

  const itemCategory = listing.category;
  const categoryMapping = {
    figures: "人型公仔",
    books: "漫畫藏書",
    accessories: "配件",
    others: "其他",
  };

  itemContainer.innerHTML +=
    /*html*/
    `
        <div class="image-container">
    <img src="./${listing.image}" alt="${listing.name}" class="item-image">
</div>
<div class="details-container">
    <div class="item-info-container">
        <div class="item-name">${listing.name}</div>
        <div class="price-like-container">
        <div class="item-price">HK$ ${listing.price}</div>
        <div class="favourite-button">

        <i class="${
          favourList.includes(listingId)
            ? "bi-heart-fill text-danger likeIcon"
            : "bi bi-heart likeIcon"
        }"></i> 
          

     </div>
    </div>
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
                ${listing.meet_up_location || "N/A"}
            </div>
        </div>
        <div class="cat-date-container">
            <div class="item-category">
                <i class="bi bi-list-ul"></i> 
                ${categoryMapping[itemCategory]}
            </div>
            <div class="item-posted-date">
                <i class="bi bi-clock-history"></i> 
                ${postedDate}
            </div>
        </div>
    </div>
    <div class="description-container">
        <div class="item-description">
            ${listing.description}
        </div>
    </div>
    <div class="seller-container">
        <div class="seller-info">
          <div class="seller-picture-container">
            <img src="./${listing.profile_picture}" alt="" class="seller-pic">
          </div>
         <div class="seller-name">
            ${listing.username}
          </div>
         </div> 
        <div class="message-box">
            <form id="message-form">
                <textarea class="input-message-box" name="content" placeholder="輸入文字"></textarea>
                <div class="message-button">
                    <input type="submit" value="傳送信息" class="btn btn-primary">
                </div>
            </form>
        </div>

        <div class="offer-box">
            <form id="offer-form">
                <label for="offer">
                    HK$
                    <input type="number" name="offer" class="offer-input" placeholder="輸入銀碼" />
                    <input type="submit" value="出價" class="btn btn-danger">
                </label>
            </form>
        </div>
    </div>
</div>
</div>
   `;
  const sellerContainer = document.querySelector(".seller-container");
  const messageBox = document.querySelector(".message-box");
  const offerBox = document.querySelector(".offer-box");
  if (listing.is_sold === true) {
    sellerContainer.removeChild(messageBox);
    sellerContainer.removeChild(offerBox);
  }

  const respCurrentUser = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await respCurrentUser.json();
    if (user.id === listing.user_id) {
      sellerContainer.removeChild(messageBox);
      sellerContainer.removeChild(offerBox);
    }
  }

  //------mark favourite------//

  document.querySelectorAll(".likeIcon").forEach((heartIcon) => {
    heartIcon.addEventListener("click", async (e) => {
      e.stopImmediatePropagation();
      // e.preventDefault()
      console.log("likeIcon");
      e.target.classList.toggle("bi-heart");
      e.target.classList.toggle("bi-heart-fill");
      e.target.classList.toggle("text-danger");

      await setFavourite(e);
    });
  });

  async function setFavourite(e) {
    // let is_favoured = false;
    if (e.target.classList === "text-danger" || "bi-heart-fill") {
      // is_favoured = true;
      const url = `listings/favoured/add/${listingId}`;
      const resp = await fetch(url);
      const respJson = await resp.json();

      console.log(
        "from item-details-with-login.js line 153",
        e.target.dataset.id
      );
    }
  }

  // ----Make Offer---
  const offerForm = document.querySelector("#offer-form");
  offerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const offerPrice = parseInt(form.offer.value);

    console.log("offer price: ", offerPrice);

    const search = new URLSearchParams(location.search);
    const listingId = search.get("listing_id");
    console.log("listing id: ", listingId);

    const sellerId = search.get("user_id");
    console.log("seller id: ", sellerId);

    Swal.fire({
      title: "你要確定嗎?",
      text: "確定後將不能更改!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "提交",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await fetch(`/listings/${listingId}/${sellerId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerPrice,
          }),
        });
        const result = await resp.json();

        if (resp.status !== 201) {
          alert("Missing Offer Price");
        } else {
          console.log(result);
          form.reset();
        }

        Swal.fire("已提交出價!", "請等待賣家回應。", "success");
      }
    });

    if (isNaN(offerPrice)) {
      Swal.fire({
        icon: "error",
        title: "錯誤",
        text: "請輸入銀碼數字！",
      });
    }
  });

  // ----Send Message---
  const messageForm = document.querySelector("#message-form");
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const messageContent = form.content.value;

    console.log("Message Content: ", messageContent);

    const search = new URLSearchParams(location.search);
    const listingId = search.get("listing_id");
    console.log("listing id: ", listingId);

    const sellerId = search.get("user_id");
    console.log("seller id: ", sellerId);

    Swal.fire({
      title: "你要確定嗎?",
      text: `信息將會傳送給 ${listing.username}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "傳送",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await fetch(`/messages/${sellerId}/${listingId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: messageContent,
          }),
        });
        const result = await resp.json();

        if (resp.status !== 201) {
          alert("Missing Message Content!!!");
        } else {
          console.log(result);
          form.reset();
        }

        Swal.fire(
          "信息已送出!",
          `${listing.username} 將會收到你的信息。`,
          "success"
        );
      }
    });

    if (!messageContent) {
      Swal.fire({
        icon: "error",
        title: "錯誤",
        text: "請輸入信息內容！",
      });
    }
  });
}
