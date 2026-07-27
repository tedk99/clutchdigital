export const MACHINES = Object.freeze({
  legion: Object.freeze({
    address: "192.168.68.52",
    label: "Legion",
  }),
  macbook: Object.freeze({
    address: "192.168.68.50",
    label: "MacBook",
  }),
  macmini: Object.freeze({
    address: "192.168.68.67",
    label: "Mac mini",
  }),
});

const MACHINE_BY_HOST = new Map(
  Object.entries(MACHINES).flatMap(([key, machine]) => {
    const names = [
      key,
      machine.address,
      `${key}.lan`,
      `${key}.home.arpa`,
    ];

    if (key === "macmini") {
      names.push("mini", "study", "study.local");
    }
    if (key === "macbook") {
      names.push("mbp", "macbookpro");
    }

    return names.map((name) => [name, key]);
  }),
);

export function validatePort(portText) {
  const trimmedPort = portText.trim();

  if (!/^[1-9]\d{0,4}$/.test(trimmedPort)) {
    throw new Error("The local URL needs a valid port.");
  }

  const port = Number(trimmedPort);
  if (port > 65535) {
    throw new Error("The local URL needs a valid port.");
  }

  return port;
}

export function buildLocalTarget(machineKey, portText, pathText = "", queryText = "") {
  const machine = MACHINES[machineKey];
  if (!machine) {
    throw new Error("That machine is not supported.");
  }

  const port = validatePort(portText);
  const target = new URL(`http://${machine.address}:${port}/`);
  target.pathname = `/${pathText.trim().replace(/^\/+/, "")}`;
  target.search = queryText.replace(/^\?/, "");
  return target.href;
}

export function buildShareLink(origin, machineKey, portText, pathText = "", queryText = "") {
  const port = validatePort(portText);
  if (!MACHINES[machineKey]) {
    throw new Error("That machine is not supported.");
  }

  const share = new URL(`/fwd/${machineKey}/`, origin);
  share.searchParams.set("port", String(port));

  const path = pathText.trim().replace(/^\/+/, "");
  if (path) {
    share.searchParams.set("path", path);
  }

  const query = queryText.replace(/^\?/, "");
  if (query) {
    share.searchParams.set("query", query);
  }

  share.searchParams.set("v", "2");

  return share.href;
}

export function convertLocalUrl(origin, input) {
  let local;
  try {
    local = new URL(input.trim());
  } catch {
    throw new Error("Paste the complete local URL, including http://.");
  }

  if (local.protocol !== "http:") {
    throw new Error("This forwarder currently supports local http:// links.");
  }

  const machineKey = MACHINE_BY_HOST.get(local.hostname.toLowerCase());
  if (!machineKey) {
    throw new Error("That URL is not on Legion, the MacBook, or the Mac mini.");
  }

  const port = local.port || "80";
  return buildShareLink(
    origin,
    machineKey,
    port,
    local.pathname,
    local.search,
  );
}
