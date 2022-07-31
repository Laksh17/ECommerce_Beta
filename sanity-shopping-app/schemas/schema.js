import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import product from './product'
import banner from './banner'
import transactions from './transactions'
// import cart_items from './cart_items'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([product, banner, transactions]),
})


