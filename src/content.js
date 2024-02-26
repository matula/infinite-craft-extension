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

function getInfiniteCraftData() {
    const dataString = localStorage.getItem('infinite-craft-data');
    const data = dataString ? JSON.parse(dataString) : {};
    return data.elements || [];
}

function checkItemsForWord() {
    const infiniteCraftData = getInfiniteCraftData();

    infiniteCraftData.forEach((item, index) => {
        const itemText = item.text.toLowerCase();

        words.forEach((word, wordIndex) => {
            if (itemText === word.toLowerCase() && !foundWords.includes(wordIndex)) {
                if (listMode || (!listMode && wordIndex === currentWordIndex)) {
                    foundWords.push(wordIndex);
                    if (!listMode) {
                        currentWordIndex++;
                    }

                    // Highlight the item in the DOM
                    document.querySelectorAll('.item').forEach(domItem => {
                        // Clone the domItem and remove the .item-emoji element
                        const domItemClone = domItem.cloneNode(true);
                        const emojiSpan = domItemClone.querySelector('.item-emoji');
                        if (emojiSpan) {
                            domItemClone.removeChild(emojiSpan);
                        }
                        // Compare the text content of the clone with the word
                        if (domItemClone.textContent.trim().toLowerCase() === itemText) {
                            domItem.classList.add('item-highlight');
                        }
                    });
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
    clearHighlights();
    updateDisplay();
}

function clearHighlights() {
    const highlightedItems = document.querySelectorAll('.item-highlight');
    highlightedItems.forEach(item => {
        item.classList.remove('item-highlight');
    });
}


chrome.runtime.onMessage.addListener((request) => {
    if (request.url) {
        resetGame();
        loadWordList(request.url, request.count || 10);
    } else if (request.toggleMode) {
        listMode = !listMode;
        resetGame();
    }
});

loadWordList('https://matula.github.io/infinite-craft-extension/json/premade/easy.json', 5);
setInterval(checkItemsForWord, 1000);