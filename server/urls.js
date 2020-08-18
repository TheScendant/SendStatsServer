const key = "200878297-91f728e3e3e9e66a5d63f1b933df2dd7";
const mpURL = `https://www.mountainproject.com/data/`;
const getTicks = `${mpURL}get-ticks?key=${key}`;
const getRoutes = `${mpURL}get-routes?key=${key}`;
const getUser = `${mpURL}get-user?key=${key}`;

export {
  getRoutes,
  getTicks,
  getUser,
}