import { DELETE, PUT } from "@constants/http_method"
import Todo from "@databases/models/Todo"
import Response from "@utils/Response"

export default function handler(req: any, res: any) {
    const response = new Response(res)
    const METHOD = req.method

    switch (METHOD) {
        case PUT:
            return update(req, response)

        case DELETE:
            return destroy(req, response)
    }

    return response.methodNotAllow()
}

async function update(req: any, res: Response) {
    try {
        var {todo} = req.body
        if (todo) {
            await Todo.update({todo}, {
                where: {
                    id: req.query.id
                }
            })

            return res.success()
        }

        return res.unprocessableEntity({ message: 'The Field name is require'})
    } catch (error) {
        if (error.original && error.original.errno === 19) {
            return res.unprocessableEntity({ message:  'The todo is duplicated'})
        }

        return res.error({error})
    }
}

async function destroy(req: any, res: Response) {

    try {
        await Todo.destroy({
            where: {
                id: req.query.id
            }
        })

        return res.success()
    } catch (error) {
        return res.error({error})
    }
}