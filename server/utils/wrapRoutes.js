export const wrapRouter = (router, asyncHandler) => {
    router.stack.forEach(layer => {
        if (layer.route) {
            const routePath = Object.keys(layer.route.methods)[0].toUpperCase() + ' ' + layer.route.path
            Object.keys(layer.route.methods).forEach(method => {
                layer.route.stack.forEach(stack => {
                    if (stack.name !== asyncHandler.name) {
                        stack.handle = asyncHandler(stack.handle)
                    }
                })
            })
        }
    })
    return router
}