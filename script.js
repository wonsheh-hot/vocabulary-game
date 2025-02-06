const words = [
    { en: "fox", zh: "狐狸" },
    { en: "giraffe", zh: "长颈鹿" },
    { en: "eagle", zh: "雕；鹰" },
    { en: "wolf", zh: "狼" },
    { en: "penguin", zh: "企鹅" },
    { en: "care", zh: "照顾；护理" },
    { en: "take care of", zh: "照顾；处理" },
    { en: "sandwich", zh: "三明治" },
    { en: "snake", zh: "蛇" },
    { en: "scary", zh: "吓人的；恐怖的" },
    { en: "neck", zh: "脖子" },
    { en: "guess", zh: "猜测；估计" },
    { en: "shark", zh: "鲨鱼" },
    { en: "whale", zh: "鲸" },
    { en: "huge", zh: "巨大的；极多的" },
    { en: "dangerous", zh: "危险的；有危害的" },
    { en: "save", zh: "救；储蓄；保存" },
    { en: "luck", zh: "幸运；运气" },
    { en: "Thai", zh: "泰国的；泰国人的" },
    { en: "trunk", zh: "象鼻" },
    { en: "pick", zh: "捡；摘" },
    { en: "pick up", zh: "拿起；举起" },
    { en: "carry", zh: "拿；提" },
    { en: "playful", zh: "爱嬉戏的；爱玩的" },
    { en: "swimmer", zh: "游泳者" },
    { en: "one another", zh: "互相" },
    { en: "look after", zh: "照顾" },
    { en: "culture", zh: "文化；文明" },
    { en: "however", zh: "然而；不过" },
    { en: "danger", zh: "危险" },
    { en: "in danger", zh: "处于危险之中" },
    { en: "forest", zh: "森林" },
    { en: "cut down", zh: "砍伐；减少" },
    { en: "too many", zh: "太多" },
    { en: "kill", zh: "杀死；弄死" },
    { en: "made of", zh: "由……制成的" },
    { en: "ivory", zh: "象牙" },
    { en: "friendly", zh: "友好的" },
    { en: "quite", zh: "相当；完全" },
    { en: "quite a", zh: "相当；非常" },
    { en: "not ... at all", zh: "一点也不；完全不" },
    { en: "fur", zh: "（动物浓厚的）软毛" },
    { en: "blind", zh: "瞎的；失明的" },
    { en: "hearing", zh: "听力；听觉" },
    { en: "Antarctica", zh: "南极洲" },
    { en: "Africa", zh: "非洲" },
    { en: "Malee", zh: "马莉" },
    { en: "Thailand", zh: "泰国" }
];


let currentWordIndex = 0;
let score = 0;

function showWord() {
    const wordContainer = document.getElementById('word-container');
    const currentWord = words[currentWordIndex];
    wordContainer.textContent = currentWord.zh;
}

function checkAnswer() {
    const answerInput = document.getElementById('answer-input');
    const feedback = document.getElementById('feedback');
    const currentWord = words[currentWordIndex];

    if (answerInput.value.toLowerCase() === currentWord.en.toLowerCase()) {
        feedback.textContent = 'Correct!';
        score++;
    } else {
        feedback.textContent = `Wrong! The correct answer is ${currentWord.en}`;
    }

    currentWordIndex = (currentWordIndex + 1) % words.length;
    answerInput.value = '';
    showWord();
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

showWord();