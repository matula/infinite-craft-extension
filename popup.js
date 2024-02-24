document.getElementById('word-list').addEventListener('change', function () {
    const listId = this.value;
    if (listId === 'random') {
        const url = 'random';
    } else {
        const url = `https://matula.github.io/infinite-craft-extension/${listId}.json`;
    }
    // Send a message to the content script with the URL of the selected word list
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {url: url});
    });
});