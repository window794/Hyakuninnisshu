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
var correctCount = 0; // ←グローバル変数に配置
var totalCount = 0; // ←グローバル変数に配置
// 📥 JSONデータ読み込み
fetch('src/karuta.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
    karutaList = data;
    nextQuestion();
});
function nextQuestion() {
    var upperText = document.getElementById('upperText');
    var choicesDiv = document.getElementById('choices');
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    var scoreDisplay = document.getElementById('scoreDisplay');
    result.textContent = '';
    choicesDiv.innerHTML = '';
    // 次の問題をランダム選択
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;
    // 選択肢を作成（正解1つ + 不正解3つ）
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
    nextButton.style.display = 'none';
    // 🔥 ここで毎回スコア表示を更新（リセットじゃないよ！）
    updateScore();
}
function checkAnswer(selected) {
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    totalCount++; // 問題を解いた回数を加算
    if (selected === currentKaruta.lower) {
        correctCount++; // 正解なら加算
        result.innerHTML = "\u6B63\u89E3\uFF01\uD83C\uDF89";
        result.style.color = 'green';
    }
    else {
        result.innerHTML = "\u6B8B\u5FF5\uFF01\u6B63\u89E3\u306F\u300C".concat(currentKaruta.lower, "\u300D");
        result.style.color = 'red';
    }
    updateScore(); // スコア再計算
    nextButton.style.display = 'inline-block';
}
// 💯 スコア表示を更新
function updateScore() {
    var scoreDisplay = document.getElementById('scoreDisplay');
    var accuracy = totalCount === 0 ? 0 : ((correctCount / totalCount) * 100).toFixed(2);
    scoreDisplay.textContent = "\u6210\u7E3E: ".concat(correctCount, " / ").concat(totalCount, " \uFF08\u6B63\u7B54\u7387: ").concat(accuracy, "%\uFF09");
}
// 「次の問題へ」ボタンにイベント登録
document.getElementById('nextButton').addEventListener('click', nextQuestion);
