const express = require('express');
const app = express();
const DB = require("./config/db")
const cors = require('cors');
const userRoutes = require("./routes/userRoutes")

DB()

app.use(cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    
app.use(express.json());
app.use("/user",userRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));