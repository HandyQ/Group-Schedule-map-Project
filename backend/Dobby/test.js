// const Komoran = require("konply");
const admin = require("./firebase/fbconfig");
// function keywordExtractionwithKorean(text, language) {
//   var keywords = [];
//   var language = language || "ko";
//   if (text) {
//     if (language === "ko") {
//       var words = text.split(/[\s,]+/);
//       var wordCount = words.length;
//       var wordFrequency = {};
//       for (var i = 0; i < wordCount; i++) {
//         var word = words[i];
//         if (wordFrequency[word]) {
//           wordFrequency[word]++;
//         } else {
//           wordFrequency[word] = 1;
//         }
//       }
//       var wordCount = Object.keys(wordFrequency).length;
//       var wordFrequencyArray = Object.keys(wordFrequency).map(function (key) {
//         return {
//           word: key,
//           count: wordFrequency[key],
//         };
//       });
//       wordFrequencyArray.sort(function (a, b) {
//         return b.count - a.count;
//       });
//       for (var i = 0; i < wordCount; i++) {
//         keywords.push(wordFrequencyArray[i].word);
//       }
//     }
//   }
//   return keywords;
// }

// function konply_test() {
//   var komoran = new Komoran();
//   var result = komoran.morphs("제주도에서 가장 유명한 선생님은 어떻습니까?");
//   console.log(result);
// }

// var languauge = "ko";
// var keyword = keywordExtractionwithKorean("11월12일 2시에 동대구역에서 보자", languauge);
// console.log(keyword);
current = new Date();
currentTime =
  current.toISOString() +
  " " +
  current.getHours() +
  ":" +
  current.getMinutes() +
  ":" +
  current.getSeconds();
console.log(currentTime);
currenttime2 = new Date(+new Date() + 3240 * 10000)
  .toISOString()
  .replace("T", " ")
  .replace(/\..*/, "");
console.log(currenttime2);
console.log("create time : ", new Date());
