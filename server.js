require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')

const app = express();

const port = process.env.PORT;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// const mongoURI = process.env.MONGOOSE;

// if (!mongoURI) {
//   console.error('Error: MONGOOSE environment variable is not set.');
//   process.exit(1);  // Exit the process with an error code
// }

mongoose.connect(process.env.MONGOOSE)
  .then(() => {
    console.log('Punam makeover Database connected successfully');
  })
  .catch((err) => {
    console.log('Error:', err);
  });

// ----- Register Page Schema Start -------- //
const schemaRegister = mongoose.Schema;

const dataSchemaRegister = new schemaRegister({
  userName: String,
  email: String,
  password: String,
  confirm_password: String,
});

const registerData = mongoose.model('registerData', dataSchemaRegister);

app.post('/registerpage', async (req, res) => {
  const { userName, email, password, confirm_password } = req.body;

  try {
    const user = await registerData.findOne({ email });

    if (!user) {
      if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const newdata = new registerData({
        userName,
        email,
        password,
        confirm_password,
      });
      await newdata.save();
      res.redirect('/login');
    } else {
      res.status(400).json({ message: 'User already exists, please log in' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ----- Register Page Schema End here -------- //

// ----- Login Page Schema Start -------- //
const schemaLogin = mongoose.Schema;

const dataSchemaLogin = new schemaLogin({
  email: String,
  password: String,
});

const dataLogin = mongoose.model('dataLogin', dataSchemaLogin);

app.post('/loginpage', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerData.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User Not found' });
    }

    // Add your password comparison logic here
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    else{
      alert("Your have login Successfully");
      res.redirect('/');
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Login Page Schema End -------- //


// ----- Book your Date Page Schema End -------- //

const schemaBookDate = mongoose.Schema

const bookDateSchema = new schemaBookDate({
  email : String,
  fullName : String,
  tel : Number,
  date : String,
  state : String,
  district : String,
  subDistrict : String,
  village : String,
  onStrict : String,
  homeNo : String,
})

const dataBookDate = mongoose.model('dataBookDate', bookDateSchema)

app.post('/bookDateData', async(req,res)=>{
  const { email, fullName,tel, 
    date,state, district, subDistrict,village, onStrict,homeNo} = req.body

    const newdata = new dataBookDate({
      email : req.body.email,
      fullName : req.body.fullName,
      tel : req.body.tel,
      date : req.body.date,
      state : req.body.state,
      district : req.body.district,
      subDistrict : req.body.subDistrict,
      village : req.body.village,
      onStrict : req.body.onStrict,
      homeNo : req.body.homeNo,
    })
    newdata.save();
    res.redirect("/bookNow")
})



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/service', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'portfolio.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'LoginPage.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Register.html'));
});

app.get('/bookNow', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'bookNow.html'));
});

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
