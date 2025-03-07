type Karuta = {
    number: number;
    upper: string;
    lower: string;
};

let karutaList: Karuta[] = [];
let currentKaruta: Karuta | null = null;
let correctCount = 0;   // ←グローバル変数に配置
let totalCount = 0;     // ←グローバル変数に配置

// 📥 JSONデータ読み込み
fetch('karuta.json')
    .then(response => response.json())
    .then((data: Karuta[]) => {
        karutaList = data;
        nextQuestion();
    });

function nextQuestion() {
    const upperText = document.getElementById('upperText')!;
    const choicesDiv = document.getElementById('choices')!;
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;
    const scoreDisplay = document.getElementById('scoreDisplay')!;

    result.textContent = '';
    choicesDiv.innerHTML = '';

    // 次の問題をランダム選択
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;

    // 選択肢を作成（正解1つ + 不正解3つ）
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

    // 🔥 ここで毎回スコア表示を更新（リセットじゃないよ！）
    updateScore();
}

function checkAnswer(selected: string) {
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;

    totalCount++;  // 問題を解いた回数を加算

    if (selected === currentKaruta!.lower) {
        correctCount++;  // 正解なら加算
        result.innerHTML = `正解！🎉`;
        result.style.color = 'green';
    } else {
        result.innerHTML = `残念！正解は「${currentKaruta!.lower}」`;
        result.style.color = 'red';
    }

    updateScore();  // スコア再計算
    nextButton.style.display = 'inline-block';
}

// 💯 スコア表示を更新
function updateScore() {
    const scoreDisplay = document.getElementById('scoreDisplay')!;
    const accuracy = totalCount === 0 ? 0 : ((correctCount / totalCount) * 100).toFixed(2);
    scoreDisplay.textContent = `成績: ${correctCount} / ${totalCount} （正答率: ${accuracy}%）`;
}

// 「次の問題へ」ボタンにイベント登録
document.getElementById('nextButton')!.addEventListener('click', nextQuestion);