import {networkInit} from './getSendData.js';
import {DATA_TYPE_ENUM} from './utilities.js';

async function update() {
  const finalMap = networkInit("hayden518@mgmail.com", DATA_TYPE_ENUM.EMAIL);
}

update();