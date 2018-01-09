const Main = resolve => require.ensure([], () => resolve(require('./Main')), 'main')
const Home = resolve => require.ensure([], () => resolve(require('./Home')), 'home')
const Detail = resolve => require.ensure([], () => resolve(require('./Detail')), 'detail')
const List = resolve => require.ensure([], () => resolve(require('./List')), 'list')

export {
	Main,
	Home,
	Detail,
	List
}
