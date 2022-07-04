import { GET, POST } from "@constants/http_method";
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
        let snapshot = await TODO_DB.get()

        var results = []
        snapshot.forEach((data) => {
            results.push({
                id: data.key,
                ...data.val()
            })
        });

        const search = req.query.todo
        if (search) {
            results = results.filter( (item) => {
                let is = item.todo.includes(search)
                return is
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

            TODO_DB.push({
                todo,
                isCompleted: isCompleted ?? false,
                createdAt: createdAt ?? new Date()
            })

            return res.status(200).json({ success: true })
        }

        return res.status(422).json({ message: 'The Field name is require'})
    } catch (error) {
        if (error.original && error.original.errno == 19) {
            return res.status(422).json({ message:  error.name})
        }
        return res.status(500).json({ error })
    }
}
