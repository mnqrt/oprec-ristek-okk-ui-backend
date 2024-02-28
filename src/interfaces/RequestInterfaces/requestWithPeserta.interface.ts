import PesertaOKK from '../pesertaOKK.interface';
import RequestWithMahasiswa from './requestWithMahasiswa.interface';

interface RequestWithPeserta extends RequestWithMahasiswa {
    peserta: PesertaOKK
};

declare module 'express-serve-static-core' {
    interface Request {
        peserta: PesertaOKK
    }
}

export default RequestWithPeserta;