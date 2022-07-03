import { GET, POST } from "@constants/http_method";
import { Op } from "sequelize";
import Todo from "@databases/models/Todo";

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
        var where = {}
        if (req.query.todo) {
            where = {
                todo: {
                    [Op.like]: `%${req.query.todo ?? ''}%`
                }
            }
        }

        var results = await Todo.findAll({
            attributes: ['id', 'todo', 'isCompleted', 'createdAt'],
            where
        });

        return res.status(200).json({ data: results })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

async function create(req, res) {
    try {
        var {todo, isCompleted, createdAt} = req.body
        if (todo) {
            await Todo.create({todo, isCompleted, createdAt})
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