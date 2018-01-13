const getBreadcrumbs = (name, routes) => {
	let breadcrumbs = []
	let activeRoute = null
	const parentRoute = routes.find((route) => {
		activeRoute = route.children.find((childRoute) => name === childRoute.name)
		return activeRoute
	})

	if (parentRoute) {
		breadcrumbs.push({
			title: parentRoute.title
		})
	}

	if (activeRoute) {
		breadcrumbs.push({
			title: activeRoute.title,
			route: {
				name: activeRoute.name
			}
		})
	}

	return breadcrumbs
}

export {
	getBreadcrumbs
}

export * from './array-operation'
export * from './judge-type'
export * from './storage-operation'
