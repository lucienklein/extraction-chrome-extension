const API = "https://api.extraction.querco.co";

const extractData = async (apikey, file) => {
  let response = await fetch(`${API}/prescription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apikey, file }),
  });

  response = await response.json();

  return { data: response.data, index };
};

const main = async (apikey, files) => {
  let responses = await Promise.all(
    files.map(async (file, index) => {
      const response = await extractData(apikey, file);
      return { response, index };
    })
  );

  responses = responses.sort((a, b) => a.index - b.index);

  return responses;
};

export default main;