import { TODO_DB } from "@services/firebase/firebaseAdmin"
import { PUT } from "@constants/http_method"
import Response from "@utils/Response";

export default function handler(req: any, res: any) {
    const response = new Response(res)
    const METHOD = req.method

    switch (METHOD) {
        case PUT:
            return updateStatus(req, response)
    }

    return res.status(405).json({ 'message': 'Method not allow', method:  req.method})
}

async function updateStatus(req: any, res: Response) {
    try {
        var {is_complete} = req.body
        await TODO_DB.child(req.query.id).update({isCompleted: is_complete})

        return res.success()
    } catch (error) {
        return res.error({error})
    }
}