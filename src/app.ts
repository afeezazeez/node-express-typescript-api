import express, {Application, Request, Response} from 'express';
import bodyParser from 'body-parser';


const app:Application = express();

// Middleware
app.use(bodyParser.json());

app.get('/', (req:Request, res:Response) => {
    res.send('Server is running I am here I am don solo cio!');
});

export default app;
