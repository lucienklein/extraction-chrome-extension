const dwtURL = new URL(chrome.runtime.getURL("/dwt"));

import getFiles from "./files";
import extractData from "./extractData";
import { loadLibrary, getChromeStorage } from "./utils";
import { displayFiles, displayPolygons } from "./display";
import insertData from "./insertData";

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

async function init() {
  if (!window.location.href.includes("moduleSil/demande/saisie/index.php")) return;

  await loadLibrary(dwtURL + "/dynamsoft.webtwain.initiate.js", "text/javascript");
  await loadLibrary(dwtURL + "/dynamsoft.webtwain.config.js", "text/javascript");

  const license = await getChromeStorage("dwt");
  if (!license) return;

  await loadLibrary(dwtURL + "/dwt.js", "text/javascript", "dwt", { dwtURL, license });

  const examDiv = document.querySelector("#ajoutAnalyse");
  const button = document.createElement("button");
  button.innerText = "Extraction Automatique";
  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const files = await getFiles(apikey);

    displayFiles(files);

    const apikey = await getChromeStorage("apikey");
    const responses = await extractData(apikey, files);

    const acts = await insertData(responses);

    displayPolygons(acts);
  });
  examDiv.appendChild(button);
}

init();
