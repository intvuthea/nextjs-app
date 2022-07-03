import { DELETE, PUT } from "@constants/http_method"
import Todo from "@databases/models/Todo"

export default function handler(req, res) {
    const METHOD = req.method

    switch (METHOD) {
        case PUT:
            return update(req, res)

        case DELETE:
            return destroy(req, res)
    }

    return res.status(405).json({ 'message': 'Method not allow', method:  req.method})
}

async function update(req, res) {
    try {
        var {todo} = req.body
        if (todo) {
            Todo.update({todo}, {
                where: {
                    id: req.query.id
                }
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

async function destroy(req, res) {

    try {
        await Todo.destroy({
            where: {
                id: req.query.id
            }
        })

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ error })
    }
}