const mongoose = require("mongoose");


const { Schema } = mongoose;

const userSchema = new Schema ({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  cart: { 
    items: [
      {
        productId:{type: Schema.Types.ObjectId, ref: 'Product', required: true}, 
        quantity: {type:Number, required: true}
      }
    ]
  },
});

userSchema.methods.addToCart = function (product) {
      if (!this.cart || !this.cart.items) {
        this.cart = { items: [] }; 
    }

    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ 
        productId:product._id,
         quantity: newQuantity 
        });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteCart = function (prodId) {
  this.cart.items = this.cart.items.filter(cp => {
    return cp.productId.toString() !== prodId.toString(); 
    });
    return this.save();
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
}

userSchema.methods.getOrders = function () {
  return this.orders;
}

module.exports = mongoose.model("User",userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this)
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     const db = getDb();
    
//     if (!this.cart || !this.cart.items) {
//         this.cart = { items: [] }; 
//     }

//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity });
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     };
//     return db.collection('users').updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       { $set: { cart: updatedCart } }
//     );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db.collection('products').find({ _id: { $in: productIds } }).toArray()
//       .then(products => {
//         return products.map(p => {
//           return { ...p, quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity };
//         });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart().then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.name
//         }
//       };
//       return db.collection('orders').insertOne(order)
//     })
//       .then(result => {
//         this.cart = { items: [] };
//         return db.collection('users').updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         );
//       });
//     }
    
//   getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray();
//   }


//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
