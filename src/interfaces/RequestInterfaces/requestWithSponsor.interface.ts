import { SponsorOKK } from '../sponsorOKK.interface';
import RequestWithUser from './requestWithUser.interface';

interface RequestWithSponsor extends RequestWithUser {
    sponsor: SponsorOKK
};

declare module 'express-serve-static-core' {
    interface Request {
        sponsor: SponsorOKK
    }
}

export default RequestWithSponsor;