type Karuta = {
    number: number;
    upper: string;
    lower: string;
};

let karutaList: Karuta[] = [];
let favoriteList: Karuta[] = JSON.parse(localStorage.getItem('favorites') || '[]');
let currentKaruta: Karuta | null = null;
let correctCount = 0;
let totalCount = 0;

// JSONデータの読み込み
fetch('karuta.json')
    .then(response => response.json())
    .then((data: Karuta[]) => {
        karutaList = data;
        updateScoreDisplay();
        nextQuestion();
    });

function nextQuestion() {
    const upperText = document.getElementById('upperText')!;
    const choicesDiv = document.getElementById('choices')!;
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;
    const favoriteButton = document.getElementById('favoriteButton')!;

    result.textContent = '';
    choicesDiv.innerHTML = '';

    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;

    // お気に入りボタンの状態更新
    updateFavoriteButton();

    const wrongChoices = karutaList
        .filter(k => k.number !== currentKaruta!.number)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(k => k.lower);

    const allChoices = [...wrongChoices, currentKaruta.lower].sort(() => Math.random() - 0.5);

    allChoices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        choicesDiv.appendChild(button);
    });

    nextButton.style.display = 'none';
}

function checkAnswer(selected: string) {
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;

    totalCount++;

    if (selected === currentKaruta!.lower) {
        correctCount++;
        result.innerHTML = `正解！🎉<br>`;
        result.style.color = 'green';
    } else {
        result.innerHTML = `残念！正解は「${currentKaruta!.lower}」<br>`;
        result.style.color = 'red';
    }

    updateScoreDisplay();
    nextButton.style.display = 'inline-block';
}

// ⭐ 常時成績を更新する関数
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay')!;
    const accuracy = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : '0';
    scoreDisplay.textContent = `成績: ${correctCount} / ${totalCount} （正答率: ${accuracy}%）`;
}

// ⭐ 復習リスト管理
function toggleFavorite() {
    if (!currentKaruta) return;

    const index = favoriteList.findIndex(k => k.number === currentKaruta!.number);

    if (index !== -1) {
        favoriteList.splice(index, 1); // 既にある場合は削除
    } else {
        favoriteList.push(currentKaruta); // ない場合は追加
    }

    localStorage.setItem('favorites', JSON.stringify(favoriteList));
    updateFavoriteButton();
}

function updateFavoriteButton() {
    const favoriteButton = document.getElementById('favoriteButton')!;
    if (currentKaruta && favoriteList.some(k => k.number === currentKaruta.number)) {
        favoriteButton.textContent = '★ 復習リストから削除';
    } else {
        favoriteButton.textContent = '☆ 復習リストに追加';
    }
}

// 「次の問題」ボタン
document.getElementById('nextButton')!.addEventListener('click', nextQuestion);

// 「復習ボタン」
document.getElementById('favoriteButton')!.addEventListener('click', toggleFavorite);