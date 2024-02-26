document.getElementById('submit-custom').addEventListener('click', function() {
    const wordCount = document.getElementById('word-count').value;
    const wordListId = document.getElementById('word-list-id').value;
    const url = wordListId === 'random' ? 'random' : `https://matula.github.io/infinite-craft-extension/json/premade/${wordListId}.json`;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {url: url, count: wordCount, wordListId: wordListId});
    });
});

document.getElementById('toggle-mode').addEventListener('click', function() {
    this.classList.toggle('active');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {toggleMode: true});
    });
});