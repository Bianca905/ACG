window.onload = async () => {
  await loadUserInfo();
  await loadMessages();
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

//-----Load Message Data-----

async function loadMessages() {
  const search = new URLSearchParams(location.search);
  const fromUserId = search.get("from_user_id");
  console.log(fromUserId);

  const resp = await fetch(`/messages/${fromUserId}`);
  const messages = await resp.json();

  const messageArea = document.querySelector("#message-area");
  messageArea.innerHTML = "";

  for (let message of messages) {
    console.log(message);

    const messageBox = document.createElement("div");
    messageBox.className = "message-box";
    messageBox.setAttribute("data-offer-id", `${message.to_user_id}`);
    messageBox.setAttribute("data-listing-id", `${message.from_user_id}`);

    const senderInfo = document.createElement("div");
    senderInfo.className = "sender-info";

    const senderImageContainer = document.createElement("div");
    senderImageContainer.className = "sender-image-container";

    const senderImage = document.createElement("img");
    senderImage.src = `./${message.profile_picture}`;
    senderImage.alt = `alt="${message.username}`;
    senderImage.className = "sender-image";

    const senderNameContainer = document.createElement("div");
    senderNameContainer.className = "sender-name-container";

    const senderName = document.createElement("div");
    senderName.className = "sender-name";
    senderName.innerText = `${message.username}`;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.innerText = `${message.content}`;

    const sendTimeBox = document.createElement("div");
    sendTimeBox.className = "send-time-box";

    const messageSendTime = document.createElement("div");
    messageSendTime.className = "message-send-time";
    messageSendTime.innerText = moment(`${message.created_at}`).format("lll");

    messageArea.appendChild(messageBox);
    messageBox.appendChild(senderInfo);
    senderInfo.appendChild(senderImageContainer);
    senderImageContainer.appendChild(senderImage);
    senderInfo.appendChild(senderNameContainer);
    senderNameContainer.appendChild(senderName);
    messageBox.appendChild(messageContent);
    messageBox.appendChild(sendTimeBox);
    sendTimeBox.appendChild(messageSendTime);
  }

  const replyArea = document.createElement("div");
  replyArea.className = "reply-area";

  const replyHere = document.createElement("div");
  replyHere.className = "reply-here";
  replyHere.innerText = "回覆";

  const replyBox = document.createElement("div");
  replyBox.className = "reply-box";
  replyBox.innerHTML =
    /*html*/
    `<form id="reply-form">
                <textarea class="input-reply-area" name="content" placeholder="輸入文字"></textarea>
            <div class="reply-button">
                <input type="submit" value="傳送" class="btn btn-primary">
            </div>
        </form>`;

  messageArea.appendChild(replyArea);
  replyArea.appendChild(replyHere);
  replyArea.appendChild(replyBox);

  // ----Reply Message---
  const replyForm = document.querySelector("#reply-form");
  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const replyContent = form.content.value;

    console.log("Message Content: ", replyContent);

    // const search = new URLSearchParams(location.search);
    // const senderId = search.get("from_user_id");
    // console.log("From User id: ", senderId);

    Swal.fire({
      title: "你要確定嗎?",
      text: "確定後將不能更改！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "傳送",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/messages/${fromUserId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: replyContent,
          }),
        });
        const dbResult = await res.json();

        if (res.status !== 201) {
          alert("Missing Message Content!!!");
        } else {
          console.log(dbResult);
          form.reset();
        }

        Swal.fire("信息已送出!", `用家將會收到你的信息`, "success");
      }
    });

    if (!replyContent) {
      Swal.fire({
        icon: "error",
        title: "錯誤...",
        text: "請輸入信息內容！",
      });
    }
  });
}
