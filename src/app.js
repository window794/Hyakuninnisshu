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
// 成績を表示する要素
var scoreDisplay = document.getElementById('scoreDisplay');
// JSONデータを読み込む
fetch('src/karuta.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
    karutaList = data;
    updateScoreDisplay(); // 初回成績表示
    nextQuestion(); // 最初の問題を表示
});
// 次の問題を表示
function nextQuestion() {
    var upperText = document.getElementById('upperText');
    var choicesDiv = document.getElementById('choices');
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    result.textContent = ''; // 結果をクリア
    choicesDiv.innerHTML = ''; // 選択肢をクリア
    // ランダムに1首選ぶ
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;
    // 下の句を4択（正解+不正解3つ）
    var wrongChoices = karutaList
        .filter(function (k) { return k.number !== currentKaruta.number; })
        .sort(function () { return Math.random() - 0.5; })
        .slice(0, 3)
        .map(function (k) { return k.lower; });
    var allChoices = __spreadArray(__spreadArray([], wrongChoices, true), [currentKaruta.lower], false).sort(function () { return Math.random() - 0.5; });
    allChoices.forEach(function (choice) {
        var button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice-button'); // クラスを追加
        button.onclick = function () { return checkAnswer(choice); };
        choicesDiv.appendChild(button);
    });
    nextButton.style.display = 'none'; // 「次の問題へ」ボタンを非表示
}
// 正解チェック
function checkAnswer(selected) {
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    var choiceButtons = document.querySelectorAll('.choice-button'); // すべての選択肢を取得
    totalCount++;
    if (selected === currentKaruta.lower) {
        correctCount++;
        result.innerHTML = "\u6B63\u89E3\uFF01\uD83C\uDF89";
        result.style.color = 'green';
    }
    else {
        result.innerHTML = "\u6B8B\u5FF5\uFF01\u6B63\u89E3\u306F\u300C".concat(currentKaruta.lower, "\u300D");
        result.style.color = 'red';
    }
    // ✅ 修正: 成績の表示を常に更新する
    updateScoreDisplay();
    // ✅ 修正: すべての選択肢を無効化して、連打で正解数を稼げないようにする
    choiceButtons.forEach(function (button) {
        button.disabled = true;
    });
    nextButton.style.display = 'inline-block'; // 「次の問題へ」ボタンを表示
}
// ✅ 追加: 成績を更新する関数
function updateScoreDisplay() {
    scoreDisplay.innerHTML = "\u6210\u7E3E: ".concat(correctCount, " / ").concat(totalCount, " \uFF08\u6B63\u7B54\u7387: ").concat(totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : "0", "%\uFF09");
}
// 「次の問題へ」ボタンにイベント登録
document.getElementById('nextButton').addEventListener('click', nextQuestion);
