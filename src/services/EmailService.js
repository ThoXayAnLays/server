const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email, orderItems, shippingPrice, totalPrice) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, 
      pass: process.env.MAIL_PASSWORD, 
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    if(order.sizeXS !== 0) {
      listItem += `<div>
      <div>
        You order product: <b>${order.name}</b> with ${order.sizeXS} size XS and price: <b>${order.price * order.sizeXS} VND</b>
      </div> 
      </div>`
    }
    if(order.sizeS !== 0) {
      listItem += `<div>
      <div>
        You order product: <b>${order.name}</b> with ${order.sizeS} size S and price: <b>${order.price * order.sizeS} VND</b>
      </div> 
      </div>`
    }
    if(order.sizeM !== 0) {
      listItem += `<div>
      <div>
        You order product: <b>${order.name}</b> with ${order.sizeM} size M and price: <b>${order.price * order.sizeM} VND</b>
      </div> 
      </div>`
    }
    if(order.sizeL !== 0) {
      listItem += `<div>
      <div>
        You order product: <b>${order.name}</b> with ${order.sizeL} size L and price: <b>${order.price * order.sizeL} VND</b>
      </div> 
      </div>`
    }
    if(order.sizeXL !== 0) {
      listItem += `<div>
      <div>
        You order product: <b>${order.name}</b> with ${order.sizeXL} size XL and price: <b>${order.price * order.sizeXL} VND</b>
      </div> 
      </div>`
    }
    if(order.sizeXXL !== 0) {
      listItem += `<div>
      <div>
        You order product: <b>${order.name}</b> with ${order.sizeXXL} size XXL and price: <b>${order.price * order.sizeXXL} VND</b>
      </div> 
      </div>`
    }
    
    attachImage.push({path: order.image})
  })
  let priceInfo = ` <div> Your shipping fee is: <b>${shippingPrice}</b> and total price is: <b>${totalPrice}</b></div>`;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Football Shop Order", // Subject line
    text: "Thank for orders our product", // plain text body
    html: `<div><b>Order Successfully!!!</b></div> ${listItem} <div> ${priceInfo} </div>`,
    attachments: attachImage,
  });
}

module.exports = {
  sendEmailCreateOrder
}