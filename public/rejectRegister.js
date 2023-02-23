async function rejectRegister() {
  const resp = await fetch("/register");
  if (resp.status === 400) {
    const rejectRegisterContent = document.createElement("h5");
    rejectRegisterContent.textContent = `Username/ email have already been used, please try another one!`;
    document
      .querySelector("#rejectRegister")
      .appendChild(rejectRegisterContent);
  }
}
