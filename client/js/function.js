const FunctionUtil = {
  randomArr: (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  },
  capitalizeFirstLetterInWords(string) {
    var words = string.split(" ");
    var capitalizedWords = [];
  
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      capitalizedWords.push(capitalizedWord);
    }
  
    return capitalizedWords.join(" ");
  }
}