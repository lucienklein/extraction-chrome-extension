// // content.js

// // Function to add a button in the iframe
// function addButtonInIframe() {
//   var iframe = document.getElementById("Prinicpal");
//   // if (iframe) {
//   var button = document.createElement("button");
//   button.innerHTML = "My Button";
//   button.className = "my-button";
//   button.onclick = function () {
//     chrome.runtime.sendMessage({
//       message: "open_new_tab",
//       url: "http://www.google.com",
//     });
//   };
//   // iframe.contentWindow.document.body.appendChild(button);
//   document.body.appendChild(button);
//   // }
// }

// // Execute the function after the DOM is fully loaded
// document.addEventListener("DOMContentLoaded", addButtonInIframe, false);

const addButtonToTable = () => {
  var url = new URL(window.location.href);
  const title = document.querySelector("#pageTitle");

  console.log("extension", url.pathname, title.innerText);
  if (url.pathname === "/kalilab.php" && title.innerText === "RECHERCHE DE DEMANDE") {
    var iframe = document.getElementById("iframePrincipal");
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var rows = innerDoc.querySelectorAll(".tableau.tableDemande .dj");

    rows.forEach((row) => {
      const dataId = row.getAttribute("data-id");
      var button = document.createElement("button");

      button.innerHTML = "✨";
      button.style = "cursor: pointer;";

      button.onclick = function () {
        button.innerHTML = "🔄";
        // fetch("http://example.com/dataId", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ dataId: dataId }),
        // })
        //   .then((response) => response.json())
        //   .then((data) => {
        //     button.innerHTML = "✨";
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //   });
        //     console.error("Error:", error);
        //   });

        // Create a div for the message
        var messageDiv = document.createElement("div");
        messageDiv.style.position = "fixed";
        messageDiv.style.right = "20px";
        messageDiv.style.top = "20px";
        messageDiv.style.padding = "10px";
        messageDiv.style.backgroundColor = "#4CAF50";
        messageDiv.style.color = "white";
        messageDiv.innerHTML = "Ok";

        // Append the message to the body
        document.body.appendChild(messageDiv);

        // Remove the message after 5 seconds
        setTimeout(function () {
          document.body.removeChild(messageDiv);
        }, 5000);
      };

      row.appendChild(button);
    });
  }
};

const addButtonToRequest = () => {
  var iframe = document.getElementById("iframePrincipal");
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  var table = innerDoc.querySelector('tr[valign="top"]').parentNode;
  var button = document.createElement("button");

  const files = innerDoc.querySelectorAll(".scanGrand ");

  let filesInfo = [...files].map((file) => {
    const fileInfo = file.getAttribute("onclick");

    const matches = fileInfo.match(/remoteScan\(([^)]+)\)/);

    if (!matches || !matches[1]) return null;

    const params = matches[1].split(",").map((param) => param.trim().replace(/['"]/g, ""));

    return {
      idScan: params[0],
      idTypeReference: params[1],
      idTypeScan: params[2],
      idReference: params[3],
    };
  });

  console.log(filesInfo);

  button.innerHTML = "My Button";
  button.className = "my-button";

  button.onclick = () => {};

  var firstRow = table.querySelector("tr:first-child");
  firstRow.parentNode.insertBefore(button, firstRow.nextSibling);
};

var iframe = document.getElementById("iframePrincipal");
iframe.onload = function () {
  addButtonToTable();
  addButtonToRequest();
};
