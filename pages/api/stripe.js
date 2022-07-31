import Stripe from 'stripe'
import { useStateContext } from '../../context/StateContext'

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default async function handler(req, res) {
    if (req.method === 'POST') {

        // console.log("Request body looks like :", req.body)


        try {
            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    {
                        shipping_rate: 'shr_1LOuyRSFi9RjSA0MFd3ml4qq'
                    },
                    {
                        shipping_rate: 'shr_1LOv3cSFi9RjSA0MJFi1xLIc'
                    },
                ],
                line_items: req.body.map((item) => {
                    const img = item.image[0].asset._ref
                    const newImage = img.replace('image-', 'https://cdn.sanity.io/images/0mf7febm/production/').replace('-webp', '.webp')
                    // console.log('IMAGE', newImage)

                    return {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: item.name,
                                images: [newImage],
                            },
                            unit_amount: item.price * 100,
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity
                    }
                }),
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/canceled`,
            }
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create
                (params);
            // console.log(session);
            res.status(200).json(session)
            // console.log(req.body)
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}