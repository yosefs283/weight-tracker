const STORAGE_KEY = 'weightEntries';

export function getAllEntries() {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function addEntry(entry) {
    const entries = getAllEntries();
    const newEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
}

export function updateEntry(entryId, updatedEntry) {
    const entries = getAllEntries();
    const index = entries.findIndex(entry => entry.id === entryId);
    if (index !== -1) {
        entries[index] = {
            ...entries[index],
            ...updatedEntry,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
}

export function deleteEntry(entryId) {
    const entries = getAllEntries();
    const filteredEntries = entries.filter(entry => entry.id !== entryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
} 