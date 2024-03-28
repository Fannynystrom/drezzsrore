
import express, { query } from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import dotenv from 'dotenv';


const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));


//koppling till index.ejs
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', {  products: products });
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});

dotenv.config();

//koppling till databasen
const mongoDBURI = process.env.MONGODB_URI; // Använd MONGODB_URI från .env-filen
                                  //databas:lösen                                   kluster

mongoose.connect(mongoDBURI);
//också koppling till databasen - meddelanden hur anslutingen går
async function main() {
 
    const db = await mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
    console.log;
    console.log("Allt gick bra");
  } catch (err) {
    console.log(err);
    console.error("Det gick åt skogen");
  }

}
//schema för hur de ska köras i moongos och de attribut som jag vill ha
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
});



//  Mongoose-modellen baserad på schemat
const Product = mongoose.model('Products', productSchema);


//API-router börjar här
// Skapa en ny produkt
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
   res.json({ message: 'Produkten har nu skapats!', product: newProduct });
  } catch (error) {
    console.error('problem vid POST-förfrågan:', error); //console.error för att logga error
    //säger om något gick fel i try-blocket
    res.status(500).json({ error: 'Någonting gick fel tyvärr' });
  }
});

 

// GET - Hämta alla produkter, eller en produkt by name
app.get("/api/products", async (req, res) => {
  try {
      const hej = await Product.find()
      const searchParam = req.query;
      console.log("den går in i get")
      if (searchParam && searchParam.name) {
          const keyword = searchParam.name;
          const prodFilter = await Product.find({ name: { $regex: keyword }})
          res.json(prodFilter);
      } else {
          console.log("den fattar att vi inte söker nått")
          res.json(hej);
      }
  } catch (err) { 
      console.log("catch")
      res.status(500).json({ message: " den går till catch" })
  }
});

//GET
// Hämta en specifik produkt med id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produkten hittades inte' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});


//PUT
// Uppdatera/ändra en produkt
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedProduct) {
      res.json({ message: 'Produkten uppdaterades', product: updatedProduct });
    } else {
      res.status(404).json({ error: 'Produkten hittades inte' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});

//DELETE
// Ta bort en produkt by id
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.json({ message: 'Produkten togs bort', product: deletedProduct });
    } else {
      res.status(404).json({ error: 'Produkten hittades inte' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});
//DELETE
// Ta bort alla produkter
app.delete('/api/products', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: 'Alla produkter togs bort' });
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});

// kör main funktionen när sidan laddas
main();


//const apiKey = "Fannosa97";  -  lösen till clustret, om jag behöver någon gång