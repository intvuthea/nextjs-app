import { PUT } from "@constants/http_method"
import Todo from "@databases/models/Todo"
import Response from "@utils/Response"

export default function handler(req: any, res: any) {
    const response = new Response(res)
    const METHOD = req.method

    switch (METHOD) {
        case PUT:
            return update(req, response)
    }

    return response.methodNotAllow()
}

async function update(req: any, res: Response) {
    try {
        var {is_complete} = req.body
        await Todo.update({
            isCompleted: is_complete ?? false
        }, {
            where: {
                id: req.query.id
            }
        })

        return res.success()
    } catch (error) {
        return res.error({error})
    }
}