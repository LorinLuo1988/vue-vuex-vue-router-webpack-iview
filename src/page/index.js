const Home = resolve => require.ensure([], () => resolve(require('./Home')), 'home')
const Detail = resolve => require.ensure([], () => resolve(require('./Detail')), 'detail')

export {
	Home,
	Detail
}
