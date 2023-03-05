const _ = require('lodash');

function getLuckyNumberInText(text) {
  const result = (text.match(/\d+/g) || []).map(n => parseInt(n));
  if (result[result.length - 1]) {
    return result[result.length - 1];
  }
  return false;
}


function getMemberLuckyInSession(membersInSession, numberLucky) {
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
    return userLuckyWithNumber;
  }

  if (_.isNull(userLuckyWithNumber)) {
    let randomIndex = Math.floor(Math.random() * uniqueMembers.length);
    let memberLucky = uniqueMembers[randomIndex];
    return memberLucky;
  }
}
// 1.6K
function randomArr (array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
function calPrize({viewers}) {
  if (_.includes(viewers, 'K')) {
    return randomArr([3000, 8000, 5000, 5000, 50000, 70000, 3000, 8000, 150000, 5000, 5000, 10000, 3000, 8000, 5000, 5000, 5000, 300000]);
  } else if (parseInt(viewers) < 100) {
    return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 7000, 15000, 8000, 5000, 20000, 5000, 10000, 30000]);
  } else if (parseInt(viewers) < 300) {
    return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 70000, 3000, 8000, 5000, 5000, 5000, 10000, 3000, 8000, 5000, 5000, 5000, 10000, 70000, 3000]);
  } else if (parseInt(viewers) < 700) {
    return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 70000, 3000, 8000, 5000, 5000, 5000, 90000, 3000, 8000, 5000, 5000, 5000, 10000, 70000, 3000, 8000, 5000, 5000, 5000, 90000]);
  } else if (parseInt(viewers) < 999) {
  return randomArr([3000, 8000, 5000, 5000, 5000, 10000, 70000, 3000, 8000, 5000, 5000, 5000, 90000]);
}
}

module.exports = {
  getLuckyNumberInText,
  getMemberLuckyInSession,
  calPrize,
};
