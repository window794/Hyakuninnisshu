type Karuta = {
    number: number;
    upper: string;
    lower: string;
};

let karutaList: Karuta[] = [];
let currentKaruta: Karuta | null = null;
let correctCount = 0;
let totalCount = 0;

// 📥 JSONデータを読み込み
fetch('karuta.json')
    .then(response => response.json())
    .then((data: Karuta[]) => {
        karutaList = data;
        nextQuestion();
    })
    .catch(error => {
        console.error("データの読み込みに失敗しました", error);
    });

function nextQuestion() {
    const upperText = document.getElementById('upperText')!;
    const choicesDiv = document.getElementById('choices')!;
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;
    const score = document.getElementById('score')!;

    result.textContent = '';
    choicesDiv.innerHTML = '';
    nextButton.style.display = 'none';

    // ランダムに1首を選ぶ
    currentKaruta = karutaList[Math.floor(Math.random() * karutaList.length)];
    upperText.textContent = currentKaruta.upper;

    // 4択問題（正解1＋不正解3）
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

    // 現在のスコアを表示
    score.textContent = `正解数: ${correctCount} / ${totalCount}`;
}

function checkAnswer(selected: string) {
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;
    const score = document.getElementById('score')!;

    totalCount++;

    if (selected === currentKaruta!.lower) {
        correctCount++;
        result.innerHTML = `正解！🎉`;
        result.style.color = 'green';
    } else {
        result.innerHTML = `残念！正解は「${currentKaruta!.lower}」です`;
        result.style.color = 'red';
    }

    // スコア更新
    score.textContent = `正解数: ${correctCount} / ${totalCount}`;

    nextButton.style.display = 'inline-block';
}

// 「次の問題へ」ボタンのクリックイベント登録
document.getElementById('nextButton')!.addEventListener('click', nextQuestion);