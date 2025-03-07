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
// ページ読み込み時にJSONデータを取得
fetch('karuta.json')
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
    result.textContent = '';
    choicesDiv.innerHTML = '';
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
        button.onclick = function () { return checkAnswer(choice); };
        choicesDiv.appendChild(button);
    });
    nextButton.style.display = 'none';
}
function checkAnswer(selected) {
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    if (selected === currentKaruta.lower) {
        result.textContent = '正解！🎉';
        result.style.color = 'green';
    }
    else {
        result.textContent = "\u6B8B\u5FF5\uFF01\u6B63\u89E3\u306F\u300C".concat(currentKaruta.lower, "\u300D");
        result.style.color = 'red';
    }
    nextButton.style.display = 'inline-block';
}
// 「次の問題」ボタンにイベント登録
document.getElementById('nextButton').addEventListener('click', nextQuestion);
