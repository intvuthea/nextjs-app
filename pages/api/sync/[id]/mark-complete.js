import { PUT } from "@constants/http_method"
import { TODO_DB } from "services/firebase/firebaseAdmin"

export default function handler(req, res) {
    const METHOD = req.method

    switch (METHOD) {
        case PUT:
            return updateStatus(req, res)
    }

    return res.status(405).json({ 'message': 'Method not allow', method:  req.method})
}

async function updateStatus(req, res) {
    try {
        var {is_complete} = req.body
        TODO_DB.child(req.query.id).update({isCompleted: is_complete})

        return res.status(200).json({ success: true })
    } catch (error) {
        if (error.original && error.original.errno === 19) {
            return res.status(422).json({ message:  error.name})
        }
        return res.status(500).json({ error })
    }
}