var db = new Dexie('googlefeed_db');

db.version(1).stores({
    categories: 'id++, title, *title_search'
});

db.categories.hook('creating', function(primaryKey, objectStore, transaction) {
    if(typeof objectStore.title == 'string') objectStore.title_search = getAllWords(objectStore.title);
});

db.categories.hook('updating', function(mods, primaryKey, objectStore, transaction) {
    if(mods.hasOwnProperty('title')) {
        if(typeof mods.title == 'string') {
            return { title_search: getAllWords(mods.title) };
        } else {
            return { title_search: [] };
        }
    }
});

function getAllWords(text) {
    var allWordsIncludingDups = text.toLowerCase().split(' ');
    var wordSet = allWordsIncludingDups.reduce(function (prev, current) {
        prev[current] = true;
        return prev;
    }, {});
    return Object.keys(wordSet);
}

db.open();