import * as Sentry from "@sentry/browser";

import { loadLibrary, getChromeStorage } from "./utils";

const dwtURL = new URL(chrome.runtime.getURL("/dwt"));
const apikey = await getChromeStorage("apikey");
const license = await getChromeStorage("dwt");

Sentry.init({
  dsn: "https://11e7e81067272e6c50f0d6595e4ff077@o4505545038888960.ingest.sentry.io/4505941359132672",
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

Sentry.configureScope((scope) => {
  scope.setTag("version", chrome.runtime.getManifest().version);
  scope.setTag("browser", navigator.userAgent);
  scope.setTag("url", window.location.href);
  scope.setTag("apikey", apikey);
  scope.setTag("license", license);
});

// let extractedActs = [];

// const observer = new MutationObserver(async (mutations) => {
//   let acts = [];

//   for (const mutation of mutations) {
//     for (const node of mutation.addedNodes) {
//       if (!node.classList || !node.classList.contains("analyseBox")) return;
//       const codeanalyse = node.getAttribute("codeanalyse");
//       const codegroupe = node.getAttribute("codegroupe");
//       const code = codegroupe || codeanalyse;

//       const act = extractedActs.find((act) => act.code === code);
//       if (act) return;

//       acts.push({ code, isAdded: true });
//     }
//   }
//   if (acts.length === 0) return;

//   const apikey = await getChromeStorage("apikey");
//   const mongoid = document.querySelector("#displayImage").getAttribute("mongoid");

//   const response = await fetch(`${API}/prescription/${mongoid}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ apikey, acts }),
//   });

//   if (!response.ok) return;
//   const prescription = await response.json();
//   extractedActs = [...extractedActs, ...prescription.data.acts];
// });

// observer.observe(document.body, {
//   childList: true,
//   subtree: true,
// });

// content.jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./scenes/popup.jsx";

const init = async () => {
  if (!window.location.href.includes("moduleSil/demande/saisie/index.php")) return;
  if (!license) return;

  await loadLibrary(dwtURL + "/dynamsoft.webtwain.initiate.js", "text/javascript");
  await loadLibrary(dwtURL + "/dynamsoft.webtwain.config.js", "text/javascript");
  await loadLibrary(dwtURL + "/dynamsoft.webtwain.install.js", "text/javascript");

  const inputAnalyse = document.querySelector("#analyseCodeAjout");
  if (!inputAnalyse) return;

  const app = document.createElement("div");
  inputAnalyse.parentNode.insertBefore(app, inputAnalyse.nextSibling);
  ReactDOM.render(<App />, app);
};

try {
  init();
} catch (error) {
  Sentry.captureException(error);
  console.error(error);

  const container = document.createElement("div");
  container.className = "tailwind";
  const errorDiv = document.createElement("div");
  errorDiv.innerText = "L'extension Extraction a rencontré une erreur. L'erreur a été envoyée à l'équipe technique.";
  errorDiv.className =
    "rounded-md bg-red-600 px-3.5 py-2.5 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 bottom-3 right-4 fixed z-50";

  container.appendChild(errorDiv);
  document.body.appendChild(container);
}
