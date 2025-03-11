type Karuta = {
    number: number;
    upper: string;
    lower: string;
};

let karutaList: Karuta[] = [];
let currentKaruta: Karuta | null = null;
let correctCount = 0;
let totalCount = 0;

// 成績を表示する要素
const scoreDisplay = document.getElementById('scoreDisplay')!;

// JSONデータを読み込む
fetch('src/karuta.json')
    .then(response => response.json())
    .then((data: Karuta[]) => {
        karutaList = data;
        updateScoreDisplay(); // 初回成績表示
        nextQuestion(); // 最初の問題を表示
    });

// 次の問題を表示
function nextQuestion() {
    const upperText = document.getElementById('upperText')!;
    const choicesDiv = document.getElementById('choices')!;
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;

    result.textContent = ''; // 結果をクリア
    choicesDiv.innerHTML = ''; // 選択肢をクリア

    // ランダムに1首選ぶ
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;

    // 下の句を4択（正解+不正解3つ）
    const wrongChoices = karutaList
        .filter(k => k.number !== currentKaruta!.number)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(k => k.lower);

    const allChoices = [...wrongChoices, currentKaruta.lower].sort(() => Math.random() - 0.5);

    allChoices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice-button'); // クラスを追加
        button.onclick = () => checkAnswer(choice);
        choicesDiv.appendChild(button);
    });

    nextButton.style.display = 'none'; // 「次の問題へ」ボタンを非表示
}

// 正解チェック
function checkAnswer(selected: string) {
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;
    const choiceButtons = document.querySelectorAll('.choice-button'); // すべての選択肢を取得

    totalCount++;

    if (selected === currentKaruta!.lower) {
        correctCount++;
        result.innerHTML = `正解！🎉`;
        result.style.color = 'green';
    } else {
        result.innerHTML = `残念！正解は「${currentKaruta!.lower}」`;
        result.style.color = 'red';
    }

    // ✅ 修正: 成績の表示を常に更新する
    updateScoreDisplay();

    // ✅ 修正: すべての選択肢を無効化して、連打で正解数を稼げないようにする
    choiceButtons.forEach(button => {
        (button as HTMLButtonElement).disabled = true;
    });

    nextButton.style.display = 'inline-block'; // 「次の問題へ」ボタンを表示
}

// ✅ 追加: 成績を更新する関数
function updateScoreDisplay() {
    scoreDisplay.innerHTML = `成績: ${correctCount} / ${totalCount} （正答率: ${totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : "0"}%）`;
}

// 「次の問題へ」ボタンにイベント登録
document.getElementById('nextButton')!.addEventListener('click', nextQuestion);