import express, {Application,Request,Response,NextFunction} from 'express';
import cors from 'cors';
import ErrorHandler from "./middlewares/error.handler";
import IndexRouter from './routes/index';
import {ClientErrorException} from "./exceptions/client.error.exception";
import {ResponseStatus} from "./enums/http-status-codes";
import databaseService from "./utils/database/database.service";
import {RateLimiter} from "./utils/rate-limiter/rate-limiter";
import configService from "./utils/config/config.service";
import swaggerSpec from "./utils/swagger/swagger";
import swaggerUi from 'swagger-ui-express';


const app:Application = express();
const throttle = new RateLimiter(configService.get('RATE_LIMIT_MAX_TIME') || 1, configService.get('RATE_LIMIT_MAX_REQUEST') || 60).getLimiter();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// apply rate limiting
app.use(throttle);

app.get('/user', (req, res) => {
    res.json({ message: 'Hello, User!' });
});


app.use('/api', IndexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ClientErrorException("Route not found", ResponseStatus.NOT_FOUND));
});


app.use(ErrorHandler)

export default app;
