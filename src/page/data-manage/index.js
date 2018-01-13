const CaseImport = resolve => require.ensure([], () => resolve(require('./CaseImport')), 'data-manage/case-impor')

export {
	CaseImport
}
