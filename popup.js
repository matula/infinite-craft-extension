function populateList() {
    fetch('https://matula.github.io/infinite-craft-extension/json/list.json')
        .then(response => response.json())
        .then(data => {
            const wordListDropdown = document.getElementById('word-list');
            Object.entries(data).forEach(([id, name]) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                wordListDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching lists:', error));
}

document.getElementById('word-list').addEventListener('change', function () {
    const listId = this.value;
    let url = '';
    if (listId === 'random') {
        url = 'random';
    } else {
        url = `https://matula.github.io/infinite-craft-extension/json/premade/${listId}.json`;
    }
    // Send a message to the content script with the URL of the selected word list
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {url: url});
    });
});

document.getElementById('list-type').addEventListener('change', function() {
    const listType = this.value;
    if (listType === 'premade') {
        populateList();
        document.getElementById('premade-list').classList.remove('hidden');
        document.getElementById('custom-list').classList.add('hidden');
    } else {
        document.getElementById('premade-list').classList.add('hidden');
        document.getElementById('custom-list').classList.remove('hidden');
    }
});

document.getElementById('submit-custom').addEventListener('click', function() {
    const wordCount = document.getElementById('word-count').value;
    const wordListId = document.getElementById('word-list-id').value;
    const url = wordListId === 'random' ? 'random' : `https://matula.github.io/infinite-craft-extension/json/premade/${wordListId}.json`;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {url: url, count: wordCount});
    });
});

document.getElementById('toggle-mode').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {toggleMode: true});
    });
});