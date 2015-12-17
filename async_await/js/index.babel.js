"use strict";

async function sleep(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve();
    }, timeout);
  });
}

async function sleep_error(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      reject("timeout");
    }, timeout);
  });
}

(async function() {
  console.log('Do some thing.' + new Date());
  await sleep(3000);

  try {
    console.log('Do other things, ' + new Date());
    await sleep_error(2000);
  } catch(e) {
    console.log(e);
  }

})();
