const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, image1, image2, image3, sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL, category, price, description, discount } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'Error',
                    message: 'The name of product is already exist'
                })
            }
            if(isNaN(sizeXS)) {
                resolve({
                    status: 'Error',
                    message: 'sizeXS is not a number'
                })
            }
            if(isNaN(sizeS)) {
                resolve({
                    status: 'Error',
                    message: 'sizeS is not a number'
                })
            }
            if(isNaN(sizeM)) {
                resolve({
                    status: 'Error',
                    message: 'sizeM is not a number'
                })
            }
            if(isNaN(sizeL)) {
                resolve({
                    status: 'Error',
                    message: 'sizeL is not a number'
                })
            }
            if(isNaN(sizeXL)) {
                resolve({
                    status: 'Error',
                    message: 'sizeXL is not a number'
                })
            }
            if(isNaN(sizeXXL)) {
                resolve({
                    status: 'Error',
                    message: 'sizeXXL is not a number'
                })
            }
            if(isNaN(price)) {
                resolve({
                    status: 'Error',
                    message: 'price is not a number'
                })
            }
            if(isNaN(discount)) {
                resolve({
                    status: 'Error',
                    message: 'discount is not a number'
                })
            }
            
            const newProduct = await Product.create({
                name, 
                image, 
                image1,
                image2,
                image3,
                sizeXS: Number(sizeXS),
                sizeS: Number(sizeS),
                sizeM: Number(sizeM),
                sizeL: Number(sizeL),
                sizeXL: Number(sizeXL),
                sizeXXL: Number(sizeXXL),
                category,
                price: Number(price),  
                description,
                discount: Number(discount),
            })
            if (newProduct) {
                resolve({
                    status: 'Success',
                    message: 'Add product scuccess',
                    data: newProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'Error',
                    message: 'The product is not exist'
                })
            }
            if( isNaN(data.price) || isNaN(data.discount)) {
                resolve({
                    status: 'Error',
                    message: 'The input is not a number'
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'Success',
                message: 'Update product success',
                data: updatedProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'Error',
                    message: 'The product is not exist'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete many products success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'Error',
                    message: 'The product is not exist'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get details product success',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.count()
            let allProduct = []
            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Product.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Filter product success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Sort product success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(!limit) {
                allProduct = await Product.find().sort({createdAt: -1, updatedAt: -1})
            }else {
                allProduct = await Product.find().limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
            }
            resolve({
                status: 'OK',
                message: 'Get all product success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllCate = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCate = await Product.distinct('category')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allCate,
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllCate
}