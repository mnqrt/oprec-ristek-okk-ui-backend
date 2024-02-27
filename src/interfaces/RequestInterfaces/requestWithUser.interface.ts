import User from '../user.interface';
import { Request } from 'express';

interface RequestWithUser extends Request {
    user: User
};

declare module 'express-serve-static-core' {
    interface Request {
        user: User
    }
}


export default RequestWithUser;