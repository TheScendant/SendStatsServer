import fetch from "node-fetch";
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false
})
/**
 * Fetches a json of user sends
 * @param {String} url
 * @return {JSONObject}
 */
async function fetchAndJsonify(url) {
  try {
    return fetch(url,  { agent }).then(async (a) => {
    // return fetch(url).then(async (a) => {
      const json = await a.json();
      return json;
    });
  } catch (e) {
    console.error(e);
  }
}

const getDataAndType = (body) => {
  let data, dataType;
  if (body.userId) {
    data = body.userId;
    dataType = DATA_TYPE_ENUM.USER_ID;
  } else if (body.email) {
    data = body.email;
    dataType = DATA_TYPE_ENUM.EMAIL;
  } else {
    throw Error("No userId or email");
  }
  return [data, dataType];
}

const DATA_TYPE_ENUM = {
  EMAIL: 'EMAIL',
  USER_ID: 'USER_ID',
}

export {
  DATA_TYPE_ENUM,
  fetchAndJsonify,
  getDataAndType,
};