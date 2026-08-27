// Game state variables
let gameState = {
    snake: {
        x: 200,
        y: 200,
        velocityX: 0,
        velocityY: 0,
        body: [{x: 200, y: 200}],
        foodX: 0,
        foodY: 0,
        score: 0,
        gameRunning: true
    },
    memory: {
        cards: [],
        flipped: [],
        matched: [],
        moves: 0,
        matches: 0
    },
    colorMatch: {
        score: 0,
        timeLeft: 30,
        gameRunning: false,
        currentColor: '',
        options: []
    },
    trivia: {
        score: 0,
        currentQuestion: 0,
        answered: false
    },
    reaction: {
        startTime: 0,
        gameStarted: false,
        canClick: false
    },
    typing: {
        score: 0,
        timeLeft: 30,
        gameRunning: false,
        currentWord: '',
        correct: 0,
        wrong: 0,
        words: []
    }
};

// Modal functions
function openGame(gameName) {
    document.getElementById(gameName + 'Modal').style.display = 'block';
    initGame(gameName);
}

function closeGame(gameName) {
    document.getElementById(gameName + 'Modal').style.display = 'none';
    stopGame(gameName);
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function initGame(gameName) {
    switch(gameName) {
        case 'snake':
            initSnakeGame();
            break;
        case 'memory':
            initMemoryGame();
            break;
        case 'colorMatch':
            initColorMatch();
            break;
        case 'trivia':
            initTrivia();
            break;
        case 'reaction':
            initReaction();
            break;
        case 'typing':
            initTyping();
            break;
    }
}

function stopGame(gameName) {
    switch(gameName) {
        case 'snake':
            gameState.snake.gameRunning = false;
            break;
        case 'colorMatch':
            gameState.colorMatch.gameRunning = false;
            break;
        case 'typing':
            gameState.typing.gameRunning = false;
            break;
    }
}

// SNAKE GAME
function initSnakeGame() {
    gameState.snake = {
        x: 200,
        y: 200,
        velocityX: 0,
        velocityY: 0,
        body: [{x: 200, y: 200}],
        foodX: Math.random() * 20 * 20,
        foodY: Math.random() * 20 * 20,
        score: 0,
        gameRunning: true
    };
    document.getElementById('snakeScore').textContent = '0';
    
    document.addEventListener('keydown', handleSnakeInput);
    drawSnakeGame();
}

function handleSnakeInput(e) {
    if (!gameState.snake.gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (gameState.snake.velocityY === 0) {
                gameState.snake.velocityX = 0;
                gameState.snake.velocityY = -20;
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (gameState.snake.velocityY === 0) {
                gameState.snake.velocityX = 0;
                gameState.snake.velocityY = 20;
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (gameState.snake.velocityX === 0) {
                gameState.snake.velocityX = -20;
                gameState.snake.velocityY = 0;
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (gameState.snake.velocityX === 0) {
                gameState.snake.velocityX = 20;
                gameState.snake.velocityY = 0;
            }
            e.preventDefault();
            break;
    }
}

function drawSnakeGame() {
    if (!gameState.snake.gameRunning) return;

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update snake position
    gameState.snake.x += gameState.snake.velocityX;
    gameState.snake.y += gameState.snake.velocityY;

    // Check wall collision
    if (gameState.snake.x < 0 || gameState.snake.x >= canvas.width || 
        gameState.snake.y < 0 || gameState.snake.y >= canvas.height) {
        gameState.snake.gameRunning = false;
        alert('Game Over! Score: ' + gameState.snake.score);
        return;
    }

    // Add new head
    gameState.snake.body.unshift({x: gameState.snake.x, y: gameState.snake.y});

    // Check food collision
    if (gameState.snake.x === gameState.snake.foodX && gameState.snake.y === gameState.snake.foodY) {
        gameState.snake.score += 10;
        document.getElementById('snakeScore').textContent = gameState.snake.score;
        gameState.snake.foodX = Math.floor(Math.random() * 20) * 20;
        gameState.snake.foodY = Math.floor(Math.random() * 20) * 20;
    } else {
        gameState.snake.body.pop();
    }

    // Check self collision
    for (let i = 1; i < gameState.snake.body.length; i++) {
        if (gameState.snake.body[0].x === gameState.snake.body[i].x && 
            gameState.snake.body[0].y === gameState.snake.body[i].y) {
            gameState.snake.gameRunning = false;
            alert('Game Over! Score: ' + gameState.snake.score);
            return;
        }
    }

    // Draw snake
    ctx.fillStyle = '#4caf50';
    gameState.snake.body.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });

    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(gameState.snake.foodX, gameState.snake.foodY, 20, 20);

    setTimeout(drawSnakeGame, 100);
}

// MEMORY GAME
function initMemoryGame() {
    const emojis = ['🎮', '🎮', '🎨', '🎨', '🎭', '🎭', '🎪', '🎪', '🎯', '🎯', '🎲', '🎲', '🎸', '🎸', '🎺', '🎺'];
    gameState.memory = {
        cards: emojis.sort(() => Math.random() - 0.5),
        flipped: [],
        matched: [],
        moves: 0,
        matches: 0
    };

    document.getElementById('memoryMatches').textContent = '0';
    document.getElementById('memoryMoves').textContent = '0';

    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';

    gameState.memory.cards.forEach((card, index) => {
        const button = document.createElement('button');
        button.className = 'memory-card';
        button.textContent = '?';
        button.onclick = () => flipCard(index);
        grid.appendChild(button);
    });
}

function flipCard(index) {
    if (gameState.memory.flipped.length >= 2 || gameState.memory.matched.includes(index) || gameState.memory.flipped.includes(index)) return;

    gameState.memory.flipped.push(index);
    const cards = document.querySelectorAll('.memory-card');
    cards[index].textContent = gameState.memory.cards[index];
    cards[index].classList.add('flipped');

    if (gameState.memory.flipped.length === 2) {
        gameState.memory.moves++;
        document.getElementById('memoryMoves').textContent = gameState.memory.moves;

        const [first, second] = gameState.memory.flipped;
        if (gameState.memory.cards[first] === gameState.memory.cards[second]) {
            gameState.memory.matched.push(first, second);
            gameState.memory.matches++;
            document.getElementById('memoryMatches').textContent = gameState.memory.matches;
            gameState.memory.flipped = [];

            if (gameState.memory.matches === 8) {
                setTimeout(() => alert('You won! Moves: ' + gameState.memory.moves), 300);
            }
        } else {
            setTimeout(() => {
                cards[first].textContent = '?';
                cards[second].textContent = '?';
                cards[first].classList.remove('flipped');
                cards[second].classList.remove('flipped');
                gameState.memory.flipped = [];
            }, 600);
        }
    }
}

// COLOR MATCH GAME
function initColorMatch() {
    gameState.colorMatch = {
        score: 0,
        timeLeft: 30,
        gameRunning: true,
        currentColor: '',
        options: []
    };

    document.getElementById('colorScore').textContent = '0';
    document.getElementById('colorTime').textContent = '30';

    nextColorMatch();
    
    const timer = setInterval(() => {
        gameState.colorMatch.timeLeft--;
        document.getElementById('colorTime').textContent = gameState.colorMatch.timeLeft;
        if (gameState.colorMatch.timeLeft <= 0) {
            clearInterval(timer);
            gameState.colorMatch.gameRunning = false;
            alert('Time\'s up! Score: ' + gameState.colorMatch.score);
        }
    }, 1000);
}

function nextColorMatch() {
    if (!gameState.colorMatch.gameRunning) return;

    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Cyan'];
    const colorValues = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#800080', '#ffa500', '#ff69b4', '#00ffff'];
    
    const correct = Math.floor(Math.random() * 4);
    gameState.colorMatch.options = [];
    gameState.colorMatch.currentColor = colors[Math.floor(Math.random() * colors.length)];
    
    const correctIndex = colorValues.indexOf(colors.indexOf(gameState.colorMatch.currentColor) < colors.length ? colorValues[colors.indexOf(gameState.colorMatch.currentColor)] : colorValues[0]);
    
    for (let i = 0; i < 4; i++) {
        if (i === correct) {
            gameState.colorMatch.options.push(gameState.colorMatch.currentColor);
        } else {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            gameState.colorMatch.options.push(randomColor);
        }
    }

    document.getElementById('colorName').textContent = gameState.colorMatch.currentColor;
    const optionsDiv = document.getElementById('colorOptions');
    optionsDiv.innerHTML = '';

    gameState.colorMatch.options.forEach((color, index) => {
        const button = document.createElement('button');
        button.className = 'color-btn';
        button.style.backgroundColor = colorValues[colors.indexOf(color)];
        button.onclick = () => checkColorMatch(color === gameState.colorMatch.currentColor);
        optionsDiv.appendChild(button);
    });
}

function checkColorMatch(correct) {
    if (correct) {
        gameState.colorMatch.score++;
        document.getElementById('colorScore').textContent = gameState.colorMatch.score;
        nextColorMatch();
    } else {
        gameState.colorMatch.gameRunning = false;
        alert('Wrong! Score: ' + gameState.colorMatch.score);
    }
}

// TRIVIA GAME
const triviaQuestions = [
    {
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct: 2
    },
    {
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1
    },
    {
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correct: 3
    },
    {
        question: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Michelangelo', 'Raphael'],
        correct: 1
    },
    {
        question: 'What is the smallest country in the world?',
        options: ['Monaco', 'Liechtenstein', 'Vatican City', 'San Marino'],
        correct: 2
    }
];

function initTrivia() {
    gameState.trivia = {
        score: 0,
        currentQuestion: 0,
        answered: false
    };

    document.getElementById('triviaScore').textContent = '0';
    document.getElementById('triviaQuestion').textContent = '1';
    showTriviaQuestion();
}

function showTriviaQuestion() {
    if (gameState.trivia.currentQuestion >= 5) {
        alert('Quiz Complete! Score: ' + gameState.trivia.score + '/5');
        return;
    }

    gameState.trivia.answered = false;
    const question = triviaQuestions[gameState.trivia.currentQuestion];
    
    document.getElementById('quizQuestion').textContent = question.question;
    const optionsDiv = document.getElementById('quizOptions');
    optionsDiv.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => answerTrivia(index, question.correct);
        optionsDiv.appendChild(button);
    });
}

function answerTrivia(selected, correct) {
    if (gameState.trivia.answered) return;
    gameState.trivia.answered = true;

    const options = document.querySelectorAll('.quiz-option');
    options[selected].classList.add(selected === correct ? 'correct' : 'incorrect');
    options[correct].classList.add('correct');

    if (selected === correct) {
        gameState.trivia.score++;
        document.getElementById('triviaScore').textContent = gameState.trivia.score;
    }

    gameState.trivia.currentQuestion++;
    document.getElementById('triviaQuestion').textContent = gameState.trivia.currentQuestion + 1;

    setTimeout(() => {
        showTriviaQuestion();
    }, 1500);
}

// REACTION TIME GAME
function initReaction() {
    gameState.reaction = {
        startTime: 0,
        gameStarted: false,
        canClick: false
    };

    const box = document.getElementById('reactionBox');
    box.textContent = 'Click to start!';
    box.style.background = '#f0f0f0';
    box.style.color = '#333';
    document.getElementById('reactionStatus').textContent = 'Click to start!';
    document.getElementById('reactionTime').textContent = '--';

    box.onclick = () => startReactionTest();
}

function startReactionTest() {
    const box = document.getElementById('reactionBox');
    box.textContent = 'Wait...';
    box.style.background = '#ffc107';
    box.style.color = '#333';
    gameState.reaction.gameStarted = true;

    const delay = Math.random() * 3000 + 2000;
    setTimeout(() => {
        if (gameState.reaction.gameStarted) {
            box.textContent = 'CLICK NOW!';
            box.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            box.style.color = 'white';
            gameState.reaction.startTime = Date.now();
            gameState.reaction.canClick = true;
            document.getElementById('reactionStatus').textContent = 'Click!';
        }
    }, delay);
}

function handleReactionClick() {
    if (gameState.reaction.canClick) {
        const reactionTime = Date.now() - gameState.reaction.startTime;
        document.getElementById('reactionTime').textContent = reactionTime + 'ms';
        document.getElementById('reactionStatus').textContent = 'Great! Reaction: ' + reactionTime + 'ms';
        gameState.reaction.canClick = false;
        gameState.reaction.gameStarted = false;

        const box = document.getElementById('reactionBox');
        box.textContent = 'Ready?';
        box.style.background = '#f0f0f0';
        box.style.color = '#333';
    }
}

// TYPING SPEED GAME
const typingWords = [
    'JavaScript', 'Programming', 'Computer', 'Keyboard', 'Algorithm',
    'Function', 'Variable', 'Database', 'Network', 'Developer',
    'Browser', 'Internet', 'Security', 'Framework', 'Library',
    'Testing', 'Debugging', 'Console', 'Server', 'Client'
];

function initTyping() {
    gameState.typing = {
        score: 0,
        timeLeft: 30,
        gameRunning: true,
        currentWord: '',
        correct: 0,
        wrong: 0,
        words: typingWords.sort(() => Math.random() - 0.5)
    };

    document.getElementById('typingTime').textContent = '30';
    document.getElementById('typingWPM').textContent = '0';
    document.getElementById('typingCorrect').textContent = '0';
    document.getElementById('typingWrong').textContent = '0';

    const input = document.getElementById('typingInput');
    input.value = '';
    input.disabled = false;
    input.focus();
    input.oninput = checkTyping;

    nextTypingWord();

    const timer = setInterval(() => {
        gameState.typing.timeLeft--;
        document.getElementById('typingTime').textContent = gameState.typing.timeLeft;
        
        if (gameState.typing.timeLeft <= 0) {
            clearInterval(timer);
            gameState.typing.gameRunning = false;
            input.disabled = true;
            const wpm = Math.round((gameState.typing.correct / 5) / (30 / 60));
            alert('Time\'s up! WPM: ' + wpm + ' | Correct: ' + gameState.typing.correct + ' | Wrong: ' + gameState.typing.wrong);
        }
    }, 1000);
}

function nextTypingWord() {
    if (gameState.typing.words.length === 0) {
        gameState.typing.words = typingWords.sort(() => Math.random() - 0.5);
    }
    gameState.typing.currentWord = gameState.typing.words.pop();
    document.getElementById('typingWord').textContent = gameState.typing.currentWord;
    document.getElementById('typingInput').value = '';
}

function checkTyping() {
    if (!gameState.typing.gameRunning) return;

    const input = document.getElementById('typingInput');
    
    if (input.value === gameState.typing.currentWord) {
        gameState.typing.correct++;
        document.getElementById('typingCorrect').textContent = gameState.typing.correct;
        
        const wpm = Math.round((gameState.typing.correct / 5) / ((30 - gameState.typing.timeLeft) / 60)) || 0;
        document.getElementById('typingWPM').textContent = wpm;
        
        nextTypingWord();
    } else if (input.value.length > gameState.typing.currentWord.length) {
        gameState.typing.wrong++;
        document.getElementById('typingWrong').textContent = gameState.typing.wrong;
        input.value = input.value.slice(0, -1);
    }
}
