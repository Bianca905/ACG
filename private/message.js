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

    const userIcon = document.querySelector("#icon-container");
    //const hiIcon = document.createElement("img");
    userIcon.innerHTML = `<img src="./${user.profile_picture}" onerror="this.onerror='null';this.src='https://cdn-icons-png.flaticon.com/512/25/25634.png'" alt="" id="userIconImg" width = "50" height = "50"></img>`;

    document.querySelector("#icon-container").appendChild(userIcon);
  }
}

//-----Load Message Data-----

async function loadMessages() {
  const resp = await fetch("/messages");
  const messages = await resp.json();

  const messageArea = document.querySelector("#message-area");
  messageArea.innerHTML = "";

  for (let message of messages) {
    console.log(message);

    const messageBox = document.createElement("div");
    messageBox.className = "message-box";
    messageBox.setAttribute("to-user-id", `${message.to_user_id}`);
    messageBox.setAttribute("from-user-id", `${message.from_user_id}`);

    const senderInfo = document.createElement("div");
    senderInfo.className = "sender-info";

    const senderImageContainer = document.createElement("div");
    senderImageContainer.className = "sender-image-container";

    const senderImage = document.createElement("img");
    senderImage.src = `./${message.profile_picture}`;
    senderImage.alt = `alt="${message.username}`;
    senderImage.className = "sender-image";

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.innerText = `${message.username} 傳送了信息給您!`;

    const sendTimeBox = document.createElement("div");
    sendTimeBox.className = "send-time-box";

    const messageSendTime = document.createElement("div");
    messageSendTime.className = "message-send-time";
    messageSendTime.innerText = moment(`${message.created_at}`).format("lll");

    messageArea.appendChild(messageBox);
    messageBox.appendChild(senderInfo);
    senderInfo.appendChild(senderImageContainer);
    senderImageContainer.appendChild(senderImage);
    messageBox.appendChild(messageContent);
    messageBox.appendChild(sendTimeBox);
    sendTimeBox.appendChild(messageSendTime);
  }
}

document.querySelector("#message-area").addEventListener("click", (e) => {
  e.preventDefault();
  const messageDiv = e.target;
  const message = messageDiv.closest(".message-box");
  const fromUserId = message.getAttribute("from-user-id");
  console.log(fromUserId);

  window.location.href = `/message-content.html?from_user_id=${fromUserId}`;
});
