var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var karutaList = [];
var currentKaruta = null;
var correctCount = 0;
var totalCount = 0;
// 📥 JSONデータを読み込み
fetch('karuta.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
    karutaList = data;
    nextQuestion();
})
    .catch(function (error) {
    console.error("データの読み込みに失敗しました", error);
});
function nextQuestion() {
    var upperText = document.getElementById('upperText');
    var choicesDiv = document.getElementById('choices');
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    var score = document.getElementById('score');
    result.textContent = '';
    choicesDiv.innerHTML = '';
    nextButton.style.display = 'none';
    // ランダムに1首を選ぶ
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;
    // 4択問題（正解1＋不正解3）
    var wrongChoices = karutaList
        .filter(function (k) { return k.number !== currentKaruta.number; })
        .sort(function () { return Math.random() - 0.5; })
        .slice(0, 3)
        .map(function (k) { return k.lower; });
    var allChoices = __spreadArray(__spreadArray([], wrongChoices, true), [currentKaruta.lower], false).sort(function () { return Math.random() - 0.5; });
    allChoices.forEach(function (choice) {
        var button = document.createElement('button');
        button.textContent = choice;
        button.onclick = function () { return checkAnswer(choice); };
        choicesDiv.appendChild(button);
    });
    // 現在のスコアを表示
    score.textContent = "\u6B63\u89E3\u6570: ".concat(correctCount, " / ").concat(totalCount);
}
function checkAnswer(selected) {
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    var score = document.getElementById('score');
    totalCount++;
    if (selected === currentKaruta.lower) {
        correctCount++;
        result.innerHTML = "\u6B63\u89E3\uFF01\uD83C\uDF89";
        result.style.color = 'green';
    }
    else {
        result.innerHTML = "\u6B8B\u5FF5\uFF01\u6B63\u89E3\u306F\u300C".concat(currentKaruta.lower, "\u300D\u3067\u3059");
        result.style.color = 'red';
    }
    // スコア更新
    score.textContent = "\u6B63\u89E3\u6570: ".concat(correctCount, " / ").concat(totalCount);
    nextButton.style.display = 'inline-block';
}
// 「次の問題へ」ボタンのクリックイベント登録
document.getElementById('nextButton').addEventListener('click', nextQuestion);
