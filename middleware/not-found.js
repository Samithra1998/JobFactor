const notFoundMiddleware = (req,res) => {
    res.status(404).send('Not found the route!')
}

export default notFoundMiddleware;