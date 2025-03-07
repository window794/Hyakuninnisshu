type Karuta = {
    number: number;
    upper: string;
    lower: string;
};

let karutaList: Karuta[] = [];
let currentKaruta: Karuta | null = null;
let correctCount = 0;
let totalCount = 0;

// ページ読み込み時にJSONデータを取得
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

    result.textContent = '';
    choicesDiv.innerHTML = '';

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
        result.innerHTML = `正解！🎉<br>現在の成績：${correctCount} / ${totalCount}`;
        result.style.color = 'green';
    } else {
        result.innerHTML = `残念！正解は「${currentKaruta!.lower}」<br>現在の成績：${correctCount} / ${totalCount}`;
        result.style.color = 'red';
    }

    nextButton.style.display = 'inline-block';
}

// 「次の問題」ボタンにイベント登録
document.getElementById('nextButton')!.addEventListener('click', nextQuestion);