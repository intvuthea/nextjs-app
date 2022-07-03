import { PUT } from "@constants/http_method"
import Todo from "@databases/models/Todo"

export default function handler(req, res) {
    const METHOD = req.method

    switch (METHOD) {
        case PUT:
            return update(req, res)
    }

    return res.status(405).json({ 'message': 'Method not allow', method:  req.method})
}

async function update(req, res) {
    try {
        var {is_complete} = req.body
        await Todo.update({
            isCompleted: is_complete ?? false
        }, {
            where: {
                id: req.query.id
            }
        })

        return res.status(200).json({ success: true })
    } catch (error) {
        if (error.original && error.original.errno == 19) {
            return res.status(422).json({ message:  error.name})
        }
        return res.status(500).json({ error })
    }
}