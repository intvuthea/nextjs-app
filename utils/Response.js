export default class Response {
    constructor(res) {
        const {body, query, method} = res
        this.res = res
        this.boby = body
        this.query = query
        this.method = method
    }

    success(data = {}) {
        return this.res.status(200).json({
            ...data,
            success: true
        })
    }

    methodNotAllow() {
        return this.res.status(405).json({ message: 'Method not allow'})
    }
}