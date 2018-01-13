const Main = resolve => require.ensure([], () => resolve(require('./Main')), 'main')

export * from './data-manage'

export {
	Main
}
