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
var favoriteList = JSON.parse(localStorage.getItem('favorites') || '[]');
var currentKaruta = null;
var correctCount = 0;
var totalCount = 0;
// JSONデータの読み込み
fetch('karuta.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
    karutaList = data;
    updateScoreDisplay();
    nextQuestion();
});
function nextQuestion() {
    var upperText = document.getElementById('upperText');
    var choicesDiv = document.getElementById('choices');
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    var favoriteButton = document.getElementById('favoriteButton');
    result.textContent = '';
    choicesDiv.innerHTML = '';
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;
    // お気に入りボタンの状態更新
    updateFavoriteButton();
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
    totalCount++;
    if (selected === currentKaruta.lower) {
        correctCount++;
        result.innerHTML = "\u6B63\u89E3\uFF01\uD83C\uDF89<br>";
        result.style.color = 'green';
    }
    else {
        result.innerHTML = "\u6B8B\u5FF5\uFF01\u6B63\u89E3\u306F\u300C".concat(currentKaruta.lower, "\u300D<br>");
        result.style.color = 'red';
    }
    updateScoreDisplay();
    nextButton.style.display = 'inline-block';
}
// ⭐ 常時成績を更新する関数
function updateScoreDisplay() {
    var scoreDisplay = document.getElementById('scoreDisplay');
    var accuracy = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : '0';
    scoreDisplay.textContent = "\u6210\u7E3E: ".concat(correctCount, " / ").concat(totalCount, " \uFF08\u6B63\u7B54\u7387: ").concat(accuracy, "%\uFF09");
}
// ⭐ 復習リスト管理
function toggleFavorite() {
    if (!currentKaruta)
        return;
    var index = favoriteList.findIndex(function (k) { return k.number === currentKaruta.number; });
    if (index !== -1) {
        favoriteList.splice(index, 1); // 既にある場合は削除
    }
    else {
        favoriteList.push(currentKaruta); // ない場合は追加
    }
    localStorage.setItem('favorites', JSON.stringify(favoriteList));
    updateFavoriteButton();
}
function updateFavoriteButton() {
    var favoriteButton = document.getElementById('favoriteButton');
    if (currentKaruta && favoriteList.some(function (k) { return k.number === currentKaruta.number; })) {
        favoriteButton.textContent = '★ 復習リストから削除';
    }
    else {
        favoriteButton.textContent = '☆ 復習リストに追加';
    }
}
// 「次の問題」ボタン
document.getElementById('nextButton').addEventListener('click', nextQuestion);
// 「復習ボタン」
document.getElementById('favoriteButton').addEventListener('click', toggleFavorite);
