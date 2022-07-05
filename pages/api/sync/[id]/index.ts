import { DELETE, PUT } from "@constants/http_method"
import { TODO_DB } from "services/firebase/firebaseAdmin";
import { getAllTodo } from "../index";
import Response from "@utils/Response";


export default function handler(req: any, res: any) {
    const response = new Response(res)
    const METHOD = req.method

    switch (METHOD) {
        case PUT:
            return update(req, response)

        case DELETE:
            return deleteTodo(req, response)
    }

    return response.methodNotAllow()
}

async function update(req: any, res: Response) {
    try {

        var {todo} = req.body
        if (todo) {
            var allTodos = await getAllTodo();
            var isExist = allTodos.find((item) => (item.todo === todo) && (item.id != req.query.id))
            if (isExist) {
                return res.unprocessableEntity({ message: 'The Todo already exist'})
            }

            await TODO_DB.child(req.query.id).update({todo})

            return res.success()
        }

        return res.unprocessableEntity({message: 'The Field name is require'})
    } catch (error) {
        return res.error(error)
    }
}

async function deleteTodo(req: any, res: Response) {
    try {
        await TODO_DB.child(req.query.id).remove()

        return res.success()
    } catch (error) {
        return res.error(error)
    }
}