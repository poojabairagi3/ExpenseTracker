// const path = require('path');

// const express = require('express');
// const bodyParser = require('body-parser');

// const errorController = require('./controllers/error');


// const app = express();

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const sequelize = require('./util/database');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// app.use(errorController.get404);

// sequelize
// .sync()
// .then((result)=>{
//   console.log(result);
//   app.listen(3000);
// })
// .catch((err)=>{
//   console.log(err);
// })


const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
var cors = require("cors");

const app = express();

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

const productRoutes = require("./routes/product");
const todosRoutes=require("./routes/todos");
const userRoutes=require("./routes/user");

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/product", productRoutes);
app.use("/todos",todosRoutes);

app.use("/user",userRoutes);
app.use(errorController.get404);

app.use(cors({
  origin:'*',
  methods:['GET','POST']
}))

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => console.log(err));

