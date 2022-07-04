import { GET, POST } from "@constants/http_method";
import { async } from "@firebase/util";
import { TODO_DB } from "services/firebase/firebaseAdmin";

export default function handler(req, res) {
    const METHOD = req.method

    switch (METHOD) {
        case GET:
            return list(req, res)

        case POST:
            return create(req, res)
    }

    return res.status(405).json({ message: 'Method not allow'})
}

async function list(req, res) {
    try {
        var results = await getAllTodo()
        const search = req.query.todo
        if (search) {
            results = results.filter( (item) => {
                return item.todo.includes(search)
            })
        }

        return res.status(200).json({ data: results ?? []})
    } catch (error) {
        return res.status(500).json({ error })
    }
}

async function create(req, res) {
    try {
        var {todo, isCompleted, createdAt} = req.body
        if (todo) {

            var allTodos = await getAllTodo();
            var isExist = allTodos.find((item) => item.todo === todo)
            if (isExist) {
                return res.status(422).json({ message: 'The Todo already exist'})
            }

            TODO_DB.push({
                todo,
                isCompleted: isCompleted ?? false,
                createdAt: createdAt ?? new Date()
            })

            return res.status(200).json({ success: true })
        }

        return res.status(422).json({ message: 'The Field name is require'})
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export async function getAllTodo() {
    let snapshot = await TODO_DB.get()

    var results = []
    snapshot.forEach((data) => {
        results.push({
            id: data.key,
            ...data.val()
        })
    });

    return results
}
