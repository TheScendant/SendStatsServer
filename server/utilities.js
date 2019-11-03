import fetch from "node-fetch";
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: true
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

const microWeights = new Map([["-", 1], ["a", 2], ["a/b", 3], ["b", 4], ["b/c", 5], ["c", 6], ["c/d", 7], ["d", 8], ["+", 9]]);
const getMicroRating = (grade) => microWeights.get(grade.match(/5\.\d+(.*)/)[1]); // matches anything after 5.numbers
const getMacroRating = (grade) => parseInt(grade.match(/5\.(\d+)/)[1]); // matches the number after '5'
const gradeSorter = (a, b) => {
    const macroA = getMacroRating(a);
    const macroB = getMacroRating(b);
    if (macroA > macroB) {
        return 1;
    }
    if (macroA < macroB) {
        return -1;
    }
    let microA = getMicroRating(a) || 5.5;
    let microB = getMicroRating(b) || 5.5;
    if (microA > microB) {
        return 1;
    }
    if (microA < microB) {
        return -1;
    }
    return 0;
}

export {
  DATA_TYPE_ENUM,
  fetchAndJsonify,
  getDataAndType,
  gradeSorter,
};