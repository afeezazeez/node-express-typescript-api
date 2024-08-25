import express, {Application, Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ErrorHandler from "./middlewares/error.handler";


const app:Application = express();

// Middleware
app.use(bodyParser.json());

app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running I am here I am don solo cio!');
});


app.use(ErrorHandler)
export default app;
