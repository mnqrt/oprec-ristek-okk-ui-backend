import MentorOKK from '../mentorOKK.interface';
import RequestWithMahasiswa from './requestWithMahasiswa.interface';

interface RequestWithMentor extends RequestWithMahasiswa {
    mentor: MentorOKK
};

declare module 'express-serve-static-core' {
    interface Request {
        mentor: MentorOKK;
    }
}

export default RequestWithMentor