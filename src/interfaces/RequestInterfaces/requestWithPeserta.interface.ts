import PesertaOKK from '../pesertaOKK.interface';
import RequestWithMahasiswa from './requestWithMahasiswa.interface';
import RequestWithUser from './requestWithUser.interface';

interface RequestWithPeserta extends RequestWithMahasiswa {
    peserta: PesertaOKK
};

declare module 'express-serve-static-core' {
    interface Request {
        peserta: PesertaOKK
    }
}

export default RequestWithPeserta;