import { GET, POST } from "@constants/http_method";
import { TODO_DB } from "@services/firebase/firebaseAdmin";
import Response from "@utils/Response";

export default function handler(req: any, res: any) {
    const respons = new Response(res)
    const METHOD = req.method

    switch (METHOD) {
        case GET:
            return list(req, respons)

        case POST:
            return create(req, respons)
    }

    return respons.methodNotAllow()
}

async function list(req: any, res: Response) {
    try {
        var results = await getAllTodo()
        const search = req.query.todo
        if (search) {
            results = results.filter( (item) => {
                return item.todo.includes(search)
            })
        }

        return res.success({ data: results ?? []})
    } catch (error) {
        return res.error({error})
    }
}

async function create(req: any, res: Response) {
    try {
        var {todo, isCompleted, createdAt} = req.body
        if (todo) {

            var allTodos = await getAllTodo();
            var isExist = allTodos.find((item) => item.todo === todo)
            if (isExist) {
                return res.unprocessableEntity({ message: 'The Todo already exist'})
            }

            await TODO_DB.push({
                todo,
                isCompleted: isCompleted ?? false,
                createdAt: createdAt ?? new Date()
            })

            return res.success()
        }

        return res.unprocessableEntity({ message: 'The Field name is require'})
    } catch (error) {
        return res.error({error})
    }
}

export async function getAllTodo() {
    let snapshot = await TODO_DB.get()

    var results = []
    snapshot.forEach((data: any) => {
        results.push({
            id: data.key,
            ...data.val()
        })
    });

    return results
}
