import express, {Application} from 'express';
import cors from 'cors';
import ErrorHandler from "./middlewares/error.handler";
import IndexRouter from './routes/index';
import './config/database/connection';



const app:Application = express();

app.use(cors())


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api', IndexRouter);



app.use(ErrorHandler)
export default app;
