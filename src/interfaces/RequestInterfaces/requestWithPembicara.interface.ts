import PembicaraOKK from '../PembicaraOKK.interface';
import { SponsorOKK } from '../sponsorOKK.interface';
import RequestWithUser from './requestWithUser.interface';

interface RequestWithPembicara extends RequestWithUser {
    pembicara: PembicaraOKK
};

declare module 'express-serve-static-core' {
    interface Request {
        pembicara: PembicaraOKK
    }
}

export default RequestWithPembicara;