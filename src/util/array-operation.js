const objectArrayIsIncludes = (key = 'name', value = '', arr = []) => {
	return arr.find(item => item[key] === value)
}

export {
	objectArrayIsIncludes
}
