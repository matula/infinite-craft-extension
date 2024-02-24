// List of words to find
let currentWordIndex = 0;
let words = [];
let wordsFound = 0;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let count = 10;
    if (request.count) {
        count = request.count;
    }

    if (request.url) {
        loadWordList(request.url, count);
    }
});

// Function to clear highlights from all items
function clearHighlights() {
    const highlightedItems = document.querySelectorAll('.item-highlight');
    highlightedItems.forEach(item => {
        item.classList.remove('item-highlight');
    });
}

function selectRandomWords(wordList, count = 10) {
    // shuffle the wordList
    let shuffled = wordList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadWordList(url, count) {
    let isRandom = false;
    if (url === 'random') {
        isRandom = true;
        url = 'https://matula.github.io/infinite-craft-extension/json/infinite_craft_words.json';
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (isRandom) {
                words = selectRandomWords(data, count); // Select 10 random words
            } else {
                words = data; // Use the entire list
            }
            currentWordIndex = 0; // Reset the index to the first word
            clearHighlights();
            updateBar(); // Update the bar with the first word from the new list
            checkItemsForWord(); // Check the items for the new word
        })
        .catch(error => console.error('Error loading word list:', error));
}

// Load the default word list when the page first loads
loadWordList('https://matula.github.io/infinite-craft-extension/json/premade/easy.json');

// Create the bar element
const bar = document.createElement('div');
bar.id = 'random-word-bar';
document.body.style.marginTop = '50px'; // Adjust body margin to accommodate the bar
document.body.insertBefore(bar, document.body.firstChild);

// Function to update the bar with the current word
function updateBar() {
    bar.textContent = `Find this word: ${words[currentWordIndex]}`;
}

// Function to check all items for the current word
function checkItemsForWord() {
    const items = document.querySelectorAll('.item');
    let wordFound = false;
    const currentWordLowerCase = words[currentWordIndex].toLowerCase();

    items.forEach(item => {
        // Preliminary check to see if the selected word exists at all
        if (item.textContent.toLowerCase().includes(currentWordLowerCase)) {
            // Clone the item and remove the span element
            const itemClone = item.cloneNode(true);
            const span = itemClone.querySelector('.item-emoji');
            if (span) {
                itemClone.removeChild(span);
            }

            // Check the text content of the clone against the current word
            const itemText = itemClone.textContent.trim().toLowerCase();
            if (itemText === currentWordLowerCase) {
                item.classList.add('item-highlight'); // Highlight the item
                wordFound = true;
                wordsFound++;
            }
        }
    });

    // Move to the next word if the current word is found
    if (wordFound && currentWordIndex < words.length - 1) {
        currentWordIndex++;
        updateBar(); // Update the bar with the new word
    }

    if (wordsFound === words.length) {
        alert('You win!'); // Display a message
        wordsFound = 0;
    }
}

// Initial update of the bar
updateBar();

// Continuously check the items for the current word
setInterval(checkItemsForWord, 1000); // Check every 1 second