const Main = resolve => require.ensure([], () => resolve(require('./Main')), 'main')
const Home = resolve => require.ensure([], () => resolve(require('./Home')), 'home')
const Detail = resolve => require.ensure([], () => resolve(require('./Detail')), 'detail')

export {
	Main,
	Home,
	Detail
}
