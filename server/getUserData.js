import {DATA_TYPE_ENUM, fetchAndJsonify} from './utilities.js';
import { getUser } from './urls.js';
import cachedUserData from './cachedJSONs/savedUserData.js';

async function getAllUserData(url) {
  const jsonBlob = await fetchAndJsonify(url);
  // dosomething? try catch here?
  return jsonBlob;
}

async function networkInit(data, DATA_TYPE) {
  try {
    let tempURL;
    if (DATA_TYPE === DATA_TYPE_ENUM.EMAIL) {
      tempURL = `${getUser}&email=${data}`;
    } else if (DATA_TYPE === DATA_TYPE_ENUM.USER_ID) {
      tempURL = `${getUser}&userId=${data}`;
    }
    const userData = await getAllUserData(tempURL);
    return userData;
  } catch(e) {
    console.error(e);
  }
}

async function localInit(data, DATA_TYPE) {
  return cachedUserData;
}

export {
    localInit,
    networkInit,
};