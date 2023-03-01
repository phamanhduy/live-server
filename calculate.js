
function getLuckyNumberInText(text) {
  const result = (text.match(/\d+/g) || []).map(n => parseInt(n));
  if (result[result.length - 1]) {
    return result[result.length - 1];
  }
  return false;
}

module.exports = {
  getLuckyNumberInText,
};

// getLuckyNumberInText('Tôi có 1 con gà, xong tôi mua 1 con gài nữa, là 3 con, đúng 4 con 6se')