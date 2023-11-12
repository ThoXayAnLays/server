const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems,paymentMethod, itemsPrice, shippingPrice, totalPrice, address, city, phone, fullname, user, isPaid, paidAt, email } = newOrder
        if(!orderItems){
            resolve({
                status: 'Error',
                message: 'The orderItems is required'
            })
        }
        if(!paymentMethod) {
            resolve({
                status: 'Error',
                message: 'The paymentMethod is required'
            })
        }
        if(!itemsPrice){
            resolve({
                status: 'Error',
                message: 'The itemsPrice is required'
            })
        }
        if(!shippingPrice){
            resolve({
                status: 'Error',
                message: 'The shippingPrice is required'
            })
        }
        if(!totalPrice){
            resolve({
                status: 'Error',
                message: 'The totalPrice is required'
            })
        }
        if(!address){
            resolve({
                status: 'Error',
                message: 'The address is required'
            })
        }
        if(!city){
            resolve({
                status: 'Error',
                message: 'The city is required'
            })
        }
        if(!phone){
            resolve({
                status: 'Error',
                message: 'The phone is required'
            })
        }
        if(!fullname){
            resolve({
                status: 'Error',
                message: 'The fullname is required'
            })
        }
        if(!user){
            resolve({
                status: 'Error',
                message: 'The user is required'
            })
        }
        if(!isPaid){
            resolve({
                status: 'Error',
                message: 'The isPaid is required'
            })
        }
        if(!email){
            resolve({
                status: 'Error',
                message: 'The email is required'
            })
        }

        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        sizeXS: {$gte: order.sizeXS} ,
                        sizeS: {$gte: order.sizeS} ,
                        sizeM: {$gte: order.sizeM} ,
                        sizeL: {$gte: order.sizeL} ,
                        sizeXL: {$gte: order.sizeXL} ,
                        sizeXXL: {$gte: order.sizeXXL} ,
                    },
                    {$inc: {
                        sizeXS: -order.sizeXS,
                        sizeS: -order.sizeS,
                        sizeM: -order.sizeM,
                        sizeL: -order.sizeL,
                        sizeXL: -order.sizeXL,
                        sizeXXL: -order.sizeXXL,
                        selled: +order.sizeXS + +order.sizeS + +order.sizeM + +order.sizeL + +order.sizeXL + +order.sizeXXL
                    }},
                    {new: true}
                )
                if(productData) {
                    return {
                        status: 'OK',
                        message: 'Add product to cart success'
                    }
                } else {
                    return{
                        status: 'Error',
                        message: 'Cannot find product',
                        name: order.name,
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.name)
            if(newData.length) {
                const arrPr = []
                newData.forEach((item) => {
                    arrPr.push(item.name)
                })
                resolve({
                    status: 'Error',
                    message: `Product with name: ${arrPr.join(',')} is out of stock`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        address,
                        city, 
                        phone,
                        fullname
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user, 
                    isPaid, paidAt
                })
                if (createdOrder) {
                    await EmailService.sendEmailCreateOrder(email,orderItems)
                    resolve({
                        status: 'OK',
                        message: 'Order and Send Email Success',
                    })
                }
            }
        } catch (e) {
        //   console.log('e', e)
            reject(e)
        }
    })
}

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({createdAt: -1, updatedAt: -1})
            if (order === null) {
                resolve({
                    status: 'Error',
                    message: 'The order is not exist'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get All Order Detail Success',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'Error',
                    message: 'The order is not exist'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get Order Detail Success',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        sizeXS: {$gte: order.sizeXS} || 0,
                        sizeS: {$gte: order.sizeS} || 0,
                        sizeM: {$gte: order.sizeM} || 0,
                        sizeL: {$gte: order.sizeL} || 0,
                        sizeXL: {$gte: order.sizeXL} || 0,
                        sizeXXL: {$gte: order.sizeXXL} || 0,
                        selled: {$gte: order.sizeXS + order.sizeS + order.sizeM + order.sizeL + order.sizeXL + order.sizeXXL} || 0,
                    },
                    {$inc: {
                        sizeXS: +order.sizeXS,
                        sizeS: +order.sizeS,
                        sizeM: +order.sizeM,
                        sizeL: +order.sizeL,
                        sizeXL: +order.sizeXL,
                        sizeXXL: +order.sizeXXL,
                        selled: -order.sizeXS + -order.sizeS + -order.sizeM + -order.sizeL + -order.sizeXL + -order.sizeXXL
                    }},
                    {new: true}
                )
                if(productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'Error',
                            message: 'The order is not exist'
                        })
                    }
                } else {
                    return{
                        status: 'OK',
                        message: 'Cannot find product',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id
            
            if(newData) {
                resolve({
                    status: 'ERR',
                    message: `Product with id: ${newData} is not exist`
                })
            }
            resolve({
                status: 'OK',
                message: 'Cancel Order Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({createdAt: -1, updatedAt: -1})
            resolve({
                status: 'OK',
                message: 'Get All Order Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findOne({
                _id: id
            })
            if (checkOrder === null) {
                resolve({
                    status: 'Error',
                    message: 'The order is not exist'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete order success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyOrder = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await Order.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete orders success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    deleteOrder,
    deleteManyOrder
}