import { convertLocalUrl } from "/fwd/links.mjs?v=4";

const form = document.querySelector("[data-generator]");
const input = document.querySelector("[data-local-url]");
const result = document.querySelector("[data-result]");
const resultLink = document.querySelector("[data-result-link]");
const copyButton = document.querySelector("[data-copy]");
const errorMessage = document.querySelector("[data-error]");

function makeLink() {
  errorMessage.textContent = "";

  try {
    const shareLink = convertLocalUrl(window.location.origin, input.value);
    resultLink.href = shareLink;
    resultLink.textContent = shareLink;
    result.hidden = false;
    return shareLink;
  } catch (error) {
    result.hidden = true;
    errorMessage.textContent = error.message;
    return null;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const link = makeLink();
  if (link) {
    resultLink.focus();
  }
});

copyButton.addEventListener("click", async () => {
  const link = makeLink();
  if (!link) {
    return;
  }

  try {
    await navigator.clipboard.writeText(link);
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = "Copy WhatsApp link";
    }, 1600);
  } catch {
    resultLink.focus();
    window.getSelection()?.selectAllChildren(resultLink);
  }
});
