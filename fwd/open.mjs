import { MACHINES, buildLocalTarget } from "/fwd/links.mjs?v=4";

const machineKey = document.body.dataset.machine;
const machine = MACHINES[machineKey];
const heading = document.querySelector("[data-heading]");
const explanation = document.querySelector("[data-explanation]");
const button = document.querySelector("[data-open]");
const targetLabel = document.querySelector("[data-target]");

function showError(message) {
  document.title = "Invalid home link";
  heading.textContent = "That link is incomplete";
  explanation.textContent = message;
  button.hidden = true;
  targetLabel.hidden = true;
}

if (!machine) {
  showError("That machine is not supported.");
} else {
  const params = new URLSearchParams(window.location.search);

  try {
    const target = buildLocalTarget(
      machineKey,
      params.get("port") || "",
      params.get("path") || "",
      params.get("query") || "",
      params.get("scheme") || "http",
    );

    document.title = `Opening ${machine.label}`;
    heading.textContent = `Opening ${machine.label}…`;
    button.href = target;
    button.textContent = `Open ${machine.label}`;
    targetLabel.textContent = target;

    window.setTimeout(() => window.location.replace(target), 150);
  } catch (error) {
    showError(error.message);
  }
}
