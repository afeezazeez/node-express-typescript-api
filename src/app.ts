import express, {Application,Request,Response,NextFunction} from 'express';
import cors from 'cors';
import ErrorHandler from "./middlewares/error.handler";
import IndexRouter from './routes/index';
import {ClientErrorException} from "./exceptions/client.error.exception";
import {ResponseStatus} from "./enums/http-status-codes";
import databaseService from "./utils/database/database.service";



const app:Application = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to database
databaseService.authenticate();

app.use('/api', IndexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ClientErrorException("Route not found", ResponseStatus.NOT_FOUND));
});


app.use(ErrorHandler)

export default app;
