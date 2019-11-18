import cachedAllSends from './cachedJSONs/sends.js';
import fakeAllGrades from './cachedJSONs/allGrades.js';
import { DATA_TYPE_ENUM, fetchAndJsonify, gradeSorter } from './utilities.js';
import { getTicks, getRoutes } from './urls.js';

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
    const sendTypes = ['flash', 'onsight', 'pinkpoint', 'redpoint'];
    if (style === 'Lead') {
      if (leadStyle && sendTypes.includes(leadStyle.toLowerCase())) {
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
async function getAllSends(url) {
  let allTicksFound = false;
  const allSends = [];
  let startPos = 0;
  while (!allTicksFound) {
    const tempUrl = `${url}&startPos=${startPos}`
    const jsonBlob = await fetchAndJsonify(tempUrl);
    const sends = await didYouSendThough(jsonBlob);
    allSends.push(...sends);
    startPos += 200;
    if (jsonBlob.ticks.length !== 200) {
      allTicksFound = true;
    }
  }
  return allSends;
}

async function allGradesInit() {
  const allSends = [];
  allSends.push(...fakeAllGrades);
  const finalMap = new Map();
  for (const send of allSends) {
    finalMap.set(send.routeId, send);
  }
  return finalMap;
}

async function localInit(email) {
  const allSends = [];
  allSends.push(...cachedAllSends);

  const finalMap = new Map();
  for (const send of allSends) {
    finalMap.set(send.routeId, send);
  }

  // console.warn(finalMap.forEach((value, key) => console.warn(`${value.name} is routeId ${value.routeId} and rated ${value.rating}`)));
  return finalMap;
}

async function networkInit(data, DATA_TYPE) {
  try {
    let tempURL;
    if (DATA_TYPE === DATA_TYPE_ENUM.EMAIL) {
      tempURL = `${getTicks}&email=${data}`;
    } else if (DATA_TYPE === DATA_TYPE_ENUM.USER_ID) {
      tempURL = `${getTicks}&userId=${data}`;
    }
    const allSends = await getAllSends(tempURL);
    const sendMap = new Map();
    for (const send of allSends) {
      sendMap.set(send.routeId, send);
    }
    const finalMap = await getAllSendData(allSends, sendMap);
    // console.warn(finalMap.forEach((value, key) => console.warn(value)));

    /* let hardestFlash = {rating: '5.0'};
    let hardestOnsight = {rating: '5.0'};
    for (const sendId of finalMap.keys()) {
      const send = finalMap.get(sendId);
      const {leadStyle, rating} = send;
      if (leadStyle && leadStyle.toLowerCase() === 'flash') {
        const harder = gradeSorter(rating, hardestFlash.rating);
        if (harder === 1) {
          hardestFlash = send;
        }
      } else if (leadStyle && leadStyle.toLowerCase() === 'onsight') {
        const harder = gradeSorter(rating, hardestOnsight.rating);
        if (harder === 1) {
          hardestOnsight = send;
        }
      }
    } */
    return finalMap;
  }
  catch (e) {
    console.error(e);
  }
}

function getGradeMap(finalMap) {
  const gradeMap = new Map();
  finalMap.forEach((send) => {
    let currCount = gradeMap.get(send.rating);
    let count = (currCount) ? currCount + 1 : 1;
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
  const finalMap = await networkInit('hayden518@gmail.com', DATA_TYPE_ENUM.EMAIL);
  const gradeMap = getGradeMap(finalMap);
  const stars = getStarCount(finalMap);

  console.warn('Sends at each grade:');
  const keys = Array.from(gradeMap.keys()).sort();
  for (const key of keys) {
    console.warn(`${key}: ${gradeMap.get(key)}`);
  }
  console.warn(`\nTotal stars sent: ${stars.toFixed(2)}`);
}

export {
  allGradesInit,
  getGradeMap,
  getStarCount,
  localInit,
  networkInit,
};
