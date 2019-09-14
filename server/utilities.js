import fetch from "node-fetch";
/**
 * Fetches a json of user sends
 * @param {String} url
 * @return {JSONObject}
 */
async function fetchAndJsonify(url) {
  try {
    return fetch(url).then(async (a) => {
      const json = await a.json();
      return json;
    });
  } catch (e) {
    console.error(e);
  }
}

const DATA_TYPE_ENUM = {
  EMAIL: 'EMAIL',
  USER_ID: 'USER_ID',
}

export default {
  DATA_TYPE_ENUM,
  fetchAndJsonify
};