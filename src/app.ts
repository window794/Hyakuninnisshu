type Karuta = {
    number: number;
    upper: string;
    lower: string;
};

let karutaList: Karuta[] = [];
let currentKaruta: Karuta | null = null;

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

    if (selected === currentKaruta!.lower) {
        result.textContent = '正解！🎉';
        result.style.color = 'green';
    } else {
        result.textContent = `残念！正解は「${currentKaruta!.lower}」`;
        result.style.color = 'red';
    }

    nextButton.style.display = 'inline-block';
}

// 「次の問題」ボタンにイベント登録
document.getElementById('nextButton')!.addEventListener('click', nextQuestion);