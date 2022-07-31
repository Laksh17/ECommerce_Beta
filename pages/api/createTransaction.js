import { client } from "../../lib/client"

const createTransaction = async (req, res) => {
    try {
        const txDoc = {
            _id: 'transaction' + (new Date()).getTime(),
            _type: req.body._type,
            amount: req.body.amount,
            email: req.body.email,
            wallet_address: req.body.wallet_address,
            products_bought: req.body.products_bought
        }

        await client.createIfNotExists(txDoc)
        res.status(200).send({ message: "success" })

    } catch (error) {
        res.status(500).send({ message: "error", data: error.message })
    }
}

export default createTransaction


