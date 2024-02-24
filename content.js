// List of words to find
const words = ["Water", "Earth", "Titanic", "Ice Cream", "Hot Air Balloon"];
let currentWordIndex = 0;

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
            }
        }
    });

    // Move to the next word if the current word is found
    if (wordFound && currentWordIndex < words.length - 1) {
        currentWordIndex++;
        updateBar(); // Update the bar with the new word
    }
}

// Initial update of the bar
updateBar();

// Continuously check the items for the current word
setInterval(checkItemsForWord, 1000); // Check every 1 second