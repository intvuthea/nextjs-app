export default class Response {
    res: any

    constructor(res: any) {
        this.res = res
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

    error(error = {}) {
        return this.res.status(500).json({ error })
    }

    unprocessableEntity(message = {}) {
        return this.res.status(422).json({message})
    } 
}