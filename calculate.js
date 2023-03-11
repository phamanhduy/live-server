const _ = require('lodash');

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

module.exports = {
  getLuckyNumberInText,
  getMemberLuckyInSession,
  calPrize,
};
