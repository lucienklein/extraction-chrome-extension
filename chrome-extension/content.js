init();

window.addEventListener(
  "message",
  function (event) {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data.myGlobalVariable) {
      console.log(event.data.myGlobalVariable); // Outputs: "Hello, world!"
    }
  },
  false
);

const addButtonToExamDiv = (resourcesURL) => {
  const examDiv = document.querySelector("#ajoutAnalyse");
  const button = document.createElement("button");
  button.innerText = "Extraction Automatique";
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    await loadLibrary(resourcesURL + "/scan.js", "text/javascript", "dwt-scan");
  });
  examDiv.appendChild(button);

  const button2 = document.createElement("button");
  button2.innerText = "Extraction Manuelle";
  button2.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(window.myGlobalVariable);
  });
  examDiv.appendChild(button2);
};

async function init() {
  const resourcesURL = new URL(chrome.runtime.getURL("/Resources"));
  await loadLibrary(resourcesURL + "/dynamsoft.webtwain.initiate.js", "text/javascript");
  await loadLibrary(resourcesURL + "/dynamsoft.webtwain.config.js", "text/javascript");
  chrome.storage.sync.get(
    { license: "" },
    async (items) =>
      await loadLibrary(resourcesURL + "/dwt.js", "text/javascript", "dwt", {
        resourcesURL: resourcesURL,
        license: items.license,
      })
  );
  addButtonToExamDiv(resourcesURL);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.message === "scan_done") {
    console.log(request);
    sendResponse({ message: "scan_done" });
  }
});

function loadLibrary(src, type, id, data) {
  return new Promise(function (resolve, reject) {
    let scriptEle = document.createElement("script");
    scriptEle.setAttribute("type", type);
    scriptEle.setAttribute("src", src);
    if (id) {
      scriptEle.id = id;
    }
    if (data) {
      for (let key in data) {
        scriptEle.setAttribute(key, data[key]);
      }
    }
    document.body.appendChild(scriptEle);
    scriptEle.addEventListener("load", () => {
      console.log(src + " loaded");
      resolve(true);
    });
    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading " + src, ev);
      reject(ev);
    });
  });
}
