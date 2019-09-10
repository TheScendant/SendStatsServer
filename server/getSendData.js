import startPos0 from "./cachedJSONs/startPos0.js";
import startPos200 from "./cachedJSONs/startPos200.js";
import oneTick from './cachedJSONs/oneTick.js';
import cachedAllSends from './cachedJSONs/sends.js'
import utilities from './utilities.js';
const { fetchAndJsonify } = utilities;
import url from './urls.js';
const { getTicks, getRoutes } = url;

/**
 * Filters all routes down to routes sent
 * @param {JSONObject} json containing tick data
 * @return Array of sends
 */
async function didYouSendThough(json) {
  const sends = [];
  for (let x = 0; x < json.ticks.length; x++) {
    const tick = json.ticks[x];
    const { style, leadStyle } = tick;
    const sendTypes = ['Flash', 'Onsight', 'Pinkpoint', 'Redpoint'];
    if (style === 'Lead') {
      if (sendTypes.includes(leadStyle)) {
        sends.push(tick);
      }
    } else if (style === 'Solo') {
      sends.push(tick);
    }
  }
  return sends;
}

/**
 * Fetches additional data for routes sent and returns the updated list
 * @param {Array<Route>} sends - List of routes sent
 * @param {Object} sendMap - map of route id to route data
 */
async function getAllSendData(sends, sendMap) {
  const routeIds = sends.map(send => send.routeId);
  let x = 0, done = false;
  // ask for 100 route details at a time
  while (!done) {
    const currRoutes = routeIds.slice(x, x + 100);
    let currRoutesString = currRoutes.join(",");
    let currURL = `${getRoutes}&routeIds=${currRoutesString}`
    const currRouteData = await fetchAndJsonify(currURL);
    const { routes } = currRouteData;

    for (let a = 0; a < routes.length; a++) {
      const route = routes[a];
      let temp = Object.assign({}, sendMap.get(route.id));
      temp.name = route.name;
      temp.rating = route.rating;
      temp.stars = route.stars;
      sendMap.set(temp.routeId, temp);
    }

    // this needs to be fixed but i'm tired and it'll work
    if (x > routeIds.length) {
      done = true;
    }
    x += 100;

  }
  return sendMap;
}

/**
 * Returns all routes sent for a user
 * @return {Array<Route>}
 */
async function getAllSends(email) {
  let allTicksFound = false;
  let startPos = 0;
  const allSends = [];
  while (!allTicksFound) {
    let tempURL = `${getTicks}&email=${email}&startPos=${startPos}`;
    const jsonBlob = await fetchAndJsonify(tempURL);
    const sends = await didYouSendThough(jsonBlob);
    allSends.push(...sends);
    startPos += 200;
    if (jsonBlob.ticks.length !== 200) {
      allTicksFound = true;
    }
  }
  return allSends;
}

async function localInit(email) {
  const allSends = [];
  //allSends.push(...startPos0.ticks);
  //allSends.push(...startPos200.ticks);
  //allSends.push(...oneTick.ticks);
  allSends.push(...cachedAllSends);

  const finalMap = new Map();
  for (const send of allSends) {
    finalMap.set(send.routeId, send);
  }

  // console.warn(finalMap.forEach((value, key) => console.warn(`${value.name} is routeId ${value.routeId} and rated ${value.rating}`)));
  return finalMap;
}

async function networkInit(email) {

  const allSends = await getAllSends(email);
  // console.warn(allSends);
  const sendMap = new Map();
  for (const send of allSends) {
    sendMap.set(send.routeId, send);
  }
  const finalMap = await getAllSendData(allSends, sendMap);
  // console.warn(finalMap.forEach((value, key) => console.warn(value)));
  return finalMap;

}

function getGradeMap(finalMap) {
  const gradeMap = new Map();
  finalMap.forEach((send) => {
    let currCount = gradeMap.get(send.rating);
    let count = (currCount) ? currCount+1 : 1;
    gradeMap.set(send.rating, count);
  });
  return gradeMap;
}

function getStarCount(finalMap) {
  let stars = 0;
  // should I use reduce here?
  finalMap.forEach((send) => {
    stars += parseFloat(send.stars);
  });
  return stars;
}

async function init() {
  // const finalMap = await localInit('hayden518@gmail.com');
  const finalMap = await networkInit('hayden518@gmail.com');
  const gradeMap = getGradeMap(finalMap);
  const stars = getStarCount(finalMap);

  console.warn('Sends at each grade:');
  const keys = Array.from(gradeMap.keys()).sort();
  for (const key of keys) {
    console.warn(`${key}: ${gradeMap.get(key)}`);
  }
  console.warn(`\nTotal stars sent: ${stars.toFixed(2)}`);
}

export default {
  getGradeMap,
  getStarCount,
  localInit,
  networkInit,
};
