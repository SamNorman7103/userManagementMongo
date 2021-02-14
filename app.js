const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
//connect to db
mongoose.connect("mongodb://localhost:27017/user-management", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false); // We get warnings without this for some reason.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected");
});

//schema
let Schema = mongoose.Schema;
//define the layout
let userDataSchema = new Schema(
  {
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    age: String,
  },
  { collection: "user-data" }
);
//create model of layout to write data to db
let UserData = mongoose.model("UserData", userDataSchema);
let app = express();

//app setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// GET home page
app.get("/", (req, res) => {
  UserData.find().then(function (doc) {
    res.render("index", { users: doc });
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/createUser", (req, res) => {
  let user = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    age: req.body.age,
  };
  let data = new UserData(user);
  console.log(data);
  data.save((err, data) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post('/search', (req, res) => { // This post request filters out our documents based on the input and renders the results
  let search = req.body.search.toLowerCase()
  UserData.find({}, (err, data) => {
      let filteredList = data.filter(user => {
          let first = user.firstName.toLowerCase()
          let last = user.lastName.toLowerCase()
          return first == search || last == search
      })
      res.render('index', { users: filteredList })
  })
})


let sort = false;
app.get("/sort", (req, res) => {
  function ascend(a, b) {
    // This function sorts the users alphabetically in descending order
    const userA = a.age;
    const userB = b.age;

    let comparison = 0;
    if (userA > userB) {
      comparison = 1;
    } else if (userA < userB) {
      comparison = 1;
    }
    return comparison;
  }
  function descend(a, b) {
    // This function sorts the users alphabetically in descending order
    const userA = a.age;
    const userB = b.age;

    let comparison = 0;
    if (userA > userB) {
      comparison = -1;
    } else if (userA < userB) {
      comparison = -1;
    }
    return comparison;
  }
  if (!sort) {
    UserData.find({}, (err, data) => {
      let sorted = data.sort(ascend);
      res.render("index", { users: sorted });
    });
    sort = true;
  } else {
    UserData.find({}, (err, data) => {
      let sorted = data.sort(descend);
      res.render("index", { users: sorted });
    });
    sort = false;
  }
});

app.get("/edit/:id", (req, res) => {
  console.log("THIS IS WAT PARAMS ARE BEING PASSED" + req.params.id.substr(3));
  UserData.findOne({ username: req.params.id.substr(3) }, (err, data) => {
    console.log("THIS IS THE FRIKIN DATA" + data);
    res.render("edit", { user: data });
  });
});

app.post("/edit/:id", (req, res) => {
  console.log(req.body);
  let user = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    age: req.body.age,
  };
  UserData.findOne({ username: user.username }, (err, doc) => {
    if (err) {
      console.log("error, no entry found");
      throw err;
    }
    doc.username = user.username;
    doc.firstName = user.firstName;
    doc.lastName = user.lastName;
    doc.email = user.email;
    doc.age = user.age;
    doc.save((err, data) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
});

app.post("/delete/:id", (req, res) => {
  let username = req.params.id;
  console.log(username);
  UserData.findOneAndDelete({ username: username }, (err, data) => {
    if (err) throw err;
    console.log(`User removed: ${data}`);
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
