import Mahasiswa from '../mahasiswa.interface';
import MentorOKK from '../mentorOKK.interface';
import RequestWithUser from './requestWithUser.interface';

interface RequestWithMahasiswa extends RequestWithUser {
    mahasiswa: Mahasiswa
};

declare module 'express-serve-static-core' {
    interface Request {
        mahasiswa: Mahasiswa
    }
}

export default RequestWithMahasiswa