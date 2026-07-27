import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLocalTarget,
  buildShareLink,
  convertLocalUrl,
  validatePort,
} from "../fwd/links.mjs";

const ORIGIN = "https://clutchdigital.co.uk";

test("builds each machine target", () => {
  assert.equal(
    buildLocalTarget("legion", "18080", "car-accident-repair/"),
    "http://192.168.68.52:18080/car-accident-repair/",
  );
  assert.equal(
    buildLocalTarget("macbook", "4747", "/explore"),
    "http://192.168.68.50:4747/explore",
  );
  assert.equal(
    buildLocalTarget("macmini", "8788", "today"),
    "http://192.168.68.67:8788/today",
  );
});

test("preserves an encoded destination query string", () => {
  assert.equal(
    buildLocalTarget("legion", "18080", "report", "shot=42&view=summary"),
    "http://192.168.68.52:18080/report?shot=42&view=summary",
  );
});

test("builds a WhatsApp-friendly share link", () => {
  assert.equal(
    buildShareLink(ORIGIN, "legion", "18080", "/car-accident-repair/"),
    "https://clutchdigital.co.uk/fwd/legion/?port=18080&path=car-accident-repair%2F&v=3",
  );
});

test("trims whitespace from ports and paths", () => {
  assert.equal(
    buildLocalTarget("legion", " 18080 ", " car-accident-repair/ "),
    "http://192.168.68.52:18080/car-accident-repair/",
  );
  assert.equal(
    buildShareLink(
      ORIGIN,
      "legion",
      " 18080 ",
      " car-accident-repair/ ",
    ),
    "https://clutchdigital.co.uk/fwd/legion/?port=18080&path=car-accident-repair%2F&v=3",
  );
});

test("converts raw LAN URLs for all supported machines", () => {
  assert.equal(
    convertLocalUrl(
      ORIGIN,
      "http://192.168.68.52:18080/car-accident-repair/",
    ),
    "https://clutchdigital.co.uk/fwd/legion/?port=18080&path=car-accident-repair%2F&v=3",
  );
  assert.match(
    convertLocalUrl(ORIGIN, "http://192.168.68.50:4747/explore"),
    /\/fwd\/macbook\/\?port=4747/,
  );
  assert.match(
    convertLocalUrl(ORIGIN, "http://study.local:8788/today"),
    /\/fwd\/macmini\/\?port=8788/,
  );
});

test("rejects unknown machines and invalid ports", () => {
  assert.throws(
    () => convertLocalUrl(ORIGIN, "http://192.168.68.99:8080/"),
    /not on Legion/,
  );
  assert.throws(() => validatePort("99999"), /valid port/);
  assert.throws(() => validatePort("22x"), /valid port/);
});
