import {fetchAndJsonify} from './utilities.js';
import { getUser } from './urls.js';

async function getAllUserData(url) {
  const jsonBlob = await fetchAndJsonify(url);
  // dosomething? try catch here?
  return jsonBlob;
}

async function networkInit(data, DATA_TYPE) {
  try {
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

export {
    networkInit,
};