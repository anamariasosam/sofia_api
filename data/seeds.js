const db = require('../db/db')
const ObjectId = require('mongoose').Types.ObjectId
const assert = require('assert')
const Subcategory = require('../api/models/subcategory')
const Business = require('../api/models/business')
const subcategoriesData = require('./subcategories.json')
const businessesData = require('./businesses.json')

// Add the categoryId to all subcategories
function addCategoryId(subcategories) {
  subcategories.map(subcategory => {
    subcategory.category = new ObjectId('5a26f20c465da00935ebc239')
  })
}

// Add the subcategoryId to all businesses
function addsubcategoriesId(businesses) {
  return businesses.map(async business => {
    const { _id: id } = await Subcategory.findOne({ name: business.subcategory }).select('_id')
    business.subcategory = id
    return business
  })
}

// create the collections for a specific model
function createCollections(model, data, number) {
  return model.collection.insertMany(data, function(err, r) {
    db.close()
    console.log(r.insertedCount + ' collections added')
    process.exit(1)
  })
}

db.then(async () => {
  // Subcategory.find().remove();
  // addCategoryId(subcategoriesData)
  // createCollections(Subcategory, subcategoriesData, 17)

  await Business.find().remove()
  const data = await Promise.all(addsubcategoriesId(businessesData))
  console.log(data)
  await createCollections(Business, data, 141)
})
