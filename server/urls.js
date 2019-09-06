const key = "111744118-7abbfddc21426215a14c10862548b379";
const mpURL = `https://www.mountainproject.com/data/`;
const getTicks = `${mpURL}get-ticks?key=${key}`;
const getRoutes = `${mpURL}get-routes?key=${key}`;

//const TheScendantURL = `https://www.mountainproject.com/data/get-ticks?userId=112023884&key=${key}`;

export default {
  getTicks,
  getRoutes,
}