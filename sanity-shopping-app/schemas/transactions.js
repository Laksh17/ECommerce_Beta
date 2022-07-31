export default {
    name: 'transactions',
    title: 'Transaction',
    type: 'document',
    fields: [
        {
            name: 'wallet_address',
            title: 'Wallet Address',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
        },
        {
            name: 'amount',
            title: 'Amount',
            type: 'number',
        },
        {
            name: 'products_bought',
            title: 'Products Bought',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'product_item',
                            title: 'Product',
                            type: 'product',
                        },
                        {
                            name: 'quantity',
                            title: 'Quantity',
                            type: 'number',
                        },
                        {
                            name: 'nft_status',
                            title: 'NFT is published?',
                            type: 'boolean'
                        }
                    ]
                }
            ]
        },
    ]
}