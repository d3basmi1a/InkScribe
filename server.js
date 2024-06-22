const express = require('express');
const articleRouter = require("./routes/articles");
const Article = require('./models/article');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

//Loading environment variables from .env file
dotenv.config();

const app = express();

// Connecting to MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Atlas Connected');
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

app.set("views", "./view");
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.get('/', async(req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles: articles });
    } catch (err) {
        console.error('Error retrieving articles:', err.message);
        res.status(500).send('Server Error');
    }
});

app.use('/articles', articleRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
