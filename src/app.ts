import express, {Application, Request, Response} from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database';


const app:Application = express();

// Middleware
app.use(bodyParser.json());

app.get('/', (req:Request, res:Response) => {
    res.send('Server is running I am here I am don solo cio!');
});

// Database connection
sequelize.sync({ alter: true }).then(() => {
    console.log('Database connected successfully');
}).catch((err) => console.log('Error connecting to the database', err));


export default app;
