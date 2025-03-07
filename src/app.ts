type Karuta = {
    number: number;
    upper: string;
    lower: string;
};

let karutaList: Karuta[] = [];
let currentKaruta: Karuta | null = null;
let correctCount = 0;
let totalCount = 0;

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

    // 次の歌をランダムに選択
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;

    // 選択肢（正解＋不正解3つ）
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
    updateScore();  // スコア表示も更新
}

function checkAnswer(selected: string) {
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;

    totalCount++;

    if (selected === currentKaruta!.lower) {
        correctCount++;
        result.innerHTML = `正解！🎉`;
        result.style.color = 'green';
    } else {
        result.innerHTML = `残念！正解は「${currentKaruta!.lower}」`;
        result.style.color = 'red';
    }

    updateScore();
    nextButton.style.display = 'inline-block';
}

function updateScore() {
    const scoreDisplay = document.getElementById('scoreDisplay')!;
    const accuracy = totalCount === 0 ? 0 : ((correctCount / totalCount) * 100).toFixed(2);
    scoreDisplay.textContent = `成績: ${correctCount} / ${totalCount} （正答率: ${accuracy}%）`;
}

document.getElementById('nextButton')!.addEventListener('click', nextQuestion);