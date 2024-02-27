import PanitiaOKK from '../panitiaOKK.interface';
import RequestWithMahasiswa from './requestWithMahasiswa.interface';

interface RequestWithPanitia extends RequestWithMahasiswa {
    panitia: PanitiaOKK
};

declare module 'express-serve-static-core' {
    interface Request {
        panitia: PanitiaOKK
    }
}

export default RequestWithPanitia;