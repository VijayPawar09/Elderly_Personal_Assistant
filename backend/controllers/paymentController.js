// // import Razorpay from 'razorpay';

// // const instance = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_KEY_SECRET
// // });

// // console.log('KEY_ID:', process.env.RAZORPAY_KEY_ID);
// // console.log('KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);


// //  const createOrder = async (req, res) => {
// //   const { amount, currency = 'INR', receipt } = req.body;


// //   try {
// //     const options = {
// //       amount: amount * 100, // Razorpay uses paisa
// //       currency,
// //       receipt: receipt || `receipt_order_${Date.now()}`,
// //     };

// //     const order = await instance.orders.create(options);
// //     res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Failed to create Razorpay order' });
// //   }
// // };
// // export default {createOrder};


// const Razorpay = require('razorpay'); 
// const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

// const razorpayInstance = new Razorpay({
//     key_id: RAZORPAY_ID_KEY,
//     key_secret: RAZORPAY_SECRET_KEY
// });

// const renderProductPage = async(req,res)=>{

//     try {
        
//         res.render('product');

//     } catch (error) {
//         console.log(error.message);
//     }

// }

// const createOrder = async(req,res)=>{
//     try {
//         const amount = req.body.amount*100
//         const options = {
//             amount: amount,
//             currency: 'INR',
//             receipt: 'razorUser@gmail.com'
//         }

//         razorpayInstance.orders.create(options, 
//             (err, order)=>{
//                 if(!err){
//                     res.status(200).send({
//                         success:true,
//                         msg:'Order Created',
//                         order_id:order.id,
//                         amount:amount,
//                         key_id:RAZORPAY_ID_KEY,
//                         product_name:req.body.name,
//                         description:req.body.description,
//                         contact:"8459935504",
//                         name: "Vijay Pawar",
//                         email: "vijayp8477@gmail.com"
//                     });
//                 }
//                 else{
//                     res.status(400).send({success:false,msg:'Something went wrong!'});
//                 }
//             }
//         );

//     } catch (error) {
//         console.log(error.message);
//     }
// }


// module.exports = {
//     renderProductPage,
//     createOrder
// }