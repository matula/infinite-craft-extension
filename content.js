let currentWordIndex = 0;
let words = [];
let wordsFound = 0;
let hasWon = false;
let listMode = true;
let foundWords = [];

const parentDiv = document.createElement('div');
parentDiv.id = 'word-bar-container';
document.body.insertBefore(parentDiv, document.body.firstChild);

const bar = document.createElement('div');
bar.id = 'random-word-bar';
parentDiv.appendChild(bar);

const wordListElement = document.createElement('div');
wordListElement.id = 'word-list-element';
parentDiv.appendChild(wordListElement);

function updateDisplay() {
    bar.textContent = listMode ? 'Find any of these words:' : `Find this word: ${words[currentWordIndex]}`;
    wordListElement.innerHTML = words.map((word, index) => {
        const isFound = listMode ? foundWords.includes(index) : index < currentWordIndex;
        return isFound ? `<s>${word}</s>` : word;
    }).join(', ');
}

function checkItemsForWord() {
    document.querySelectorAll('.item').forEach(item => {
        // Clone the item and remove the .item-emoji element
        const itemClone = item.cloneNode(true);
        const emoji = itemClone.querySelector('.item-emoji');
        if (emoji) {
            itemClone.removeChild(emoji);
        }
        const itemText = itemClone.textContent.trim().toLowerCase();

        words.forEach((word, index) => {
            if (itemText === word.toLowerCase() && !foundWords.includes(index)) {
                item.classList.add('item-highlight');
                foundWords.push(index);
                if (!listMode && index === currentWordIndex) {
                    currentWordIndex++;
                }
            }
        });
    });

    if (foundWords.length === words.length && !hasWon) {
        hasWon = true;
        alert('You win!');
    }

    updateDisplay();
}

function loadWordList(url, count) {
    resetGame();
    let isRandom = url === 'random';
    if (isRandom) {
        url = 'https://matula.github.io/infinite-craft-extension/json/infinite_craft_words.json';
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            words = isRandom ? selectRandomWords(data, count) : data;
            resetGame();
        })
        .catch(error => console.error('Error loading word list:', error));
}

function selectRandomWords(wordList, count = 10) {
    return wordList.sort(() => 0.5 - Math.random()).slice(0, count);
}

function resetGame() {
    currentWordIndex = 0;
    wordsFound = 0;
    hasWon = false;
    foundWords = [];
    updateDisplay();
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.url) {
        loadWordList(request.url, request.count || 10);
    } else if (request.toggleMode) {
        listMode = !listMode;
        resetGame();
    }
});

loadWordList('https://matula.github.io/infinite-craft-extension/json/premade/easy.json', 5);
setInterval(checkItemsForWord, 1000);