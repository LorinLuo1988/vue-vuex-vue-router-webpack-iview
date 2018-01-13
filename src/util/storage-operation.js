const setStorage = (storage) => (key, value) => storage.setItem(key, JSON.stringify(value))
const getStorage = (storage) => (key, jsonParse = true) => {
	const str = storage.getItem(key)

	return jsonParse ? JSON.parse(str) : str
}

const clearStorage = (storage) => (key) => storage.clearItem(key)

const setLocalStorage = setStorage(localStorage)
const getLocalStorage = getStorage(localStorage)
const clearLocalStorage = clearStorage(localStorage)

const getSessionStorage = getStorage(sessionStorage)
const setSessionStorage = setStorage(sessionStorage)
const clearSessionStorage = clearStorage(localStorage)

export {
	setLocalStorage,
	getLocalStorage,
	clearLocalStorage,
	setSessionStorage,
	getSessionStorage,
	clearSessionStorage
}
