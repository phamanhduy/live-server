const _ = require('lodash');
const https = require('https');

function getLuckyNumberInText(text) {
  const result = (text.match(/\d+/g) || []).map(n => parseInt(n));
  if (result[result.length - 1]) {
    return result[result.length - 1];
  }
  return false;
}


function getMemberLuckyInSession(membersInSession, numberLucky, viewers) {
  if (_.isEmpty(membersInSession)) {
    return null;
  }
  const uniqueMembers = _.uniqBy(membersInSession, (member) => {
    return member.name + member.username + member.avatar;
  });

  let userLuckyWithNumber = null;
  for (let i = 0; i < uniqueMembers.length; i++) {
    let elm = uniqueMembers[i];
    if (_.get(elm, 'numberLucky') === numberLucky) {
      userLuckyWithNumber = elm;
      break;
    }
  }

  if (userLuckyWithNumber) {
    return {
      memberLucky: userLuckyWithNumber,
      prize: calPrize(viewers, 'number'),
      type: 'number',
      numberLucky,
    };
  }

  if (_.isNull(userLuckyWithNumber)) {
    let randomIndex = Math.floor(Math.random() * uniqueMembers.length);
    let memberLucky = uniqueMembers[randomIndex];
    return {
      memberLucky,
      type: 'ramdom',
      prize: calPrize(viewers, 'random'),
      prizeNumber: calPrize(viewers, 'number'),
      numberLucky,
    };
  }
}
// 1.6K
function randomArr (array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function calPrize(viewers, type = 'random') {
  if (!viewers) {
    return 6000;
  }
  if (type === 'random') {
    if (_.includes(viewers, 'K')) {
      return randomArr([3000, 8000, 5000, 5000, 5000, 7000, 3000, 8000, 15000, 5000, 5000, 10000, 3000, 8000, 5000, 5000, 5000, 30000]);
    } else if (parseInt(viewers) < 100) {
      return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 7000, 15000, 8000, 5000, 20000, 5000, 10000, 3000, 10000, 7000, 15000, 8000, 5000, 20000, 5000, 10000, 3000, 3000, 8000, 5000, 5000, 5000, 10000]);
    } else if (parseInt(viewers) < 300) {
      return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 7000, 3000, 8000, 5000, 5000, 5000, 10000, 3000, 8000, 5000, 5000, 5000, 10000, 70000, 3000]);
    } else if (parseInt(viewers) < 700) {
      return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 30000, 3000, 8000, 5000, 5000, 5000, 9000, 3000, 8000, 5000, 5000, 5000, 10000, 7000, 3000, 8000, 5000, 5000, 5000, 9000]);
    } else if (parseInt(viewers) < 999) {
      return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 7000, 3000, 8000, 5000, 5000, 5000, 9000]);
    }
  } else if (type === 'number') {
    if (_.includes(viewers, 'K')) {
      return randomArr([30000, 80000, 50000, 50000, 500000, 70000, 30000, 80000, 150000, 50000, 50000, 10000, 30000, 80000, 50000, 50000, 50000, 300000]);
    } else if (parseInt(viewers) < 100) {
      return randomArr([30000, 80000, 50000, 50000, 50000, 10000, 7000, 15000, 80000, 50000, 20000, 50000, 10000, 30000, 10000, 7000, 15000, 80000]);
    } else if (parseInt(viewers) < 300) {
      return randomArr([30000, 60000, 40000, 50000, 50000, 10000, 40000, 30000, 80000, 10000, 30000, 80000, 50000, 50000, 50000, 10000, 40000, 30000]);
    } else if (parseInt(viewers) < 700) {
      return randomArr([30000, 80000, 50000, 50000, 50000, 10000, 70000, 30000, 80000, 50000, 50000, 50000, 90000]);
    } else if (parseInt(viewers) < 999) {
      return randomArr([30000, 80000, 50000, 50000, 50000, 10000, 70000, 30000, 80000, 50000, 50000, 50000, 90000]);
    }
  }
}


async function imageToBase64(url) {
  console.log(url)
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
        console.log({chunk})
      });
      res.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        const base64String = buffer.toString('base64');
        resolve(base64String);
        console.log({base64String})
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// imageToBase64("https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/91681f096465da29c9bf8023ae8b77ad~tplv-tiktok-shrink:72:72.webp?x-expires=1679317200&x-signature=cePeGrU2Zj%2BPIhud8qhuBIEU%2Bi4%3D")
async function getParam(string, query) {
  const params = string.split('?')[1].split('&');
  for (let i = 0; i < params.length; i++) {
    const param = params[i].split('=');
    if (param[0] === query) {
      return decodeURIComponent(param[1]);
    }
  }
  return null;
}

function checkTimeExpire(secondTime) {
  const nowDateSec = (new Date).getTime() / 1000;
  if ((secondTime - nowDateSec) > 0) {
    return true;
  }
  return false;
}

async function compareImagesPath(imagePath1, imagePath2) {
  const base64String1 = await imageToBase64(imagePath1);
  const base64String2 = await imageToBase64(imagePath2);
  if (base64String1 === base64String2) {
    console.log('Hai ảnh giống nhau.');
  } else {
    console.log('Hai ảnh khác nhau.');
  }
}

async function compareImagesBase(imagePath, imageBase64) {
  const base64String = await imageToBase64(imagePath);
  if (base64String === imageBase64) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getLuckyNumberInText,
  getMemberLuckyInSession,
  calPrize,
  imageToBase64,
  compareImagesBase,
  compareImagesPath,
  getParam,
  checkTimeExpire,
};
