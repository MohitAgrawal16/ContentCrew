import {connectDB} from "./db/db.js";
import dotenv from 'dotenv';
import {app} from './app.js';
import http from 'http';
import {setupSocketServer} from './socket.js';

dotenv.config({
    path:'./.env'
});

// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);

connectDB()
.then(() => {
   
    console.log("DB connected");
    const server = http.createServer(app);
    const io = setupSocketServer(server);
    
    app.on("error", (error) => {
        console.log("Express server error", error);
    });
    
    server.listen(process.env.PORT || 7000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    
   // console.log(process.env.CLOUDINARY_API_SECRET);
}).catch((error) => {
    console.log("DB connection error", error);
}); 