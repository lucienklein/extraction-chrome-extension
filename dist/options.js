const API = "https://api.extraction.querco.co";

const alertUser = (message) => {
  const div = document.getElementById("alertBox");
  div.innerHTML = message;
  div.style.display = "block";
  setTimeout(() => {
    div.style.display = "none";
  }, 5000);
};

const login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alertUser("Veuillez remplir tous les champs");

  try {
    const response = await fetch(API + "/user/localapikey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.status !== 200 && data.message) return alertUser(data.message);
    if (response.status !== 200 || !data.user || !data.user.apikey) {
      console.log(data);
      return alertUser("Une erreur est survenue");
    }

    console.log(data);

    await setChromeStorage({ apikey: data.user.apikey, dwt: data.dwt });

    document.getElementById("form").style.display = "none";
    document.getElementById("status").style.display = "block";
    document.getElementById("apikey").value = data.user.apikey;
    document.getElementById("dwt").value = data.dwt;

    alertUser(`Connexion r&#233;ussie - Vous devez rafraichir la page`);
  } catch (error) {
    console.log(error);
    alertUser("Une erreur est survenue");
  }
};

const load = async () => {
  const apikey = await getChromeStorage("apikey");
  const dwt = await getChromeStorage("dwt");

  if (!apikey || !dwt) return (document.getElementById("form").style.display = "block");

  document.getElementById("form").style.display = "none";
  document.getElementById("status").style.display = "block";
  document.getElementById("apikey").value = apikey;
  document.getElementById("dwt").value = dwt;
};

const getChromeStorage = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(result[key]);
    });
  });
};

const setChromeStorage = (values) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(values, () => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(true);
    });
  });
};

document.getElementById("login").addEventListener("click", () => {
  login();
});

document.getElementById("logout").addEventListener("click", async () => {
  await setChromeStorage({ apikey: "", dwt: "" });

  document.getElementById("form").style.display = "block";
  document.getElementById("status").style.display = "none";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("apikey").value = "";
  document.getElementById("dwt").value = "";
});

document.addEventListener("DOMContentLoaded", load);
