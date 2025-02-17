const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

 const adminRoutes = require('./routes/admin');
 const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('67a251c992d384795f1b70f2')
    .then(user => {
      req.user = user;
      console.log("user = ",req.user._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://arjunachyuth422:arjun422@arjuncluster.fom5d.mongodb.net/shop?retryWrites=true&w=majority&appName=ArjunCluster')
.then(result => {
  console.log('Connected to database');
  User.findOne().then(
    user => {
      if(!user){
          const user = new User ({
          name:'arjun',
          email:'arjun@gmail.com',
          cart:{items:[]}
        })
        user.save();
      }
    })

  app.listen(3000);
})
.catch(err => {
  console.log(err);
});


