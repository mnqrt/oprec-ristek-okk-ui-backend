# Penjelasan Role
- User: membutuhkan password, username, dan role
- Mahasiswa: Memiliki userId, membutuhkan nama. Sedangkan Fakultas, Jurusan, Angkatan Opsional
- PanitiaOKK: Memiliki userId dan mahasiswaId, membutuhkan tipePengurus, bidangTerkait serta Jabatan.
- PesertaOKK: Memiliki userId dan mahasiswaId, membutuhkan jalurMasuk serta noKelompok
- MentorOKK: Memiliki userId dan mahasiswaId, membutuhkan noKelompok
- SponsorOKK: Memiliki userId. Membutuhkan namaSponsor serta listAcaraDisponsori (awalnya kosong)
- PembicaraOKK: Memiliki userId. Membutuhkan namaPembicara serta listAcaraDiisi (awalnya kosong)
Pada semua request, kita akan login sebagai poin 3-7 saja. Kegunaan adanya poin 1 dan 2 adalah untuk meminimalisir pengulangan atribut/properti yang sama pada role berbeda



# All Routes
## Register
- Dilakukan melalui /auth/register
- Jika register sebagai PanitiaOKK, perlu melampirkan `[username, password, role, nama, fakultas, jurusan, angkatan, tipePengurus, bidangTerkait, jabatan]`
- Jika register sebagai PesertaOKK, perlu melampirkan `[username, password, role, nama, fakultas, jurusan, angkatan, noKelompok, jalurMasuk]`
- Jika register sebagai MentorOKK, perlu melampirkan  `[username, password, role, nama, fakultas, jurusan, angkatan, noKelompok]`
- Jika register sebagai SponsorOKK, perlu melampirkan `[username, password, role, namaSponsor]`
- Jika register sebagai PembicaraOKK, perlu melampirkan `[username, password, role, namaPembicara]`

## /auth 
| Route               | Method | Need to Login as | JSON Request Body    | Explanation                             |
| ------------------- | ------ | ---------------- | -------------------- | --------------------------------------- |
| /get-all-peserta    | GET    | \-               | \-                   | \-                                      |
| /get-all-mentor     | GET    | \-               | \-                   | \-                                      |
| /get-all-panitia    | GET    | \-               | \-                   | \-                                      |
| /get-all-sponsor    | GET    | \-               | \-                   | \-                                      |
| /get-all-pembicara  | GET    | \-               | \-                   | \-                                      |
| /register           | POST   | \-               | Sudah dijelaskan.    | \-                                      |
| /login              | POST   | \-               | {username, password} | \-                                      |
| /logout             | DELETE | User             | \-                   | \-                                      |
| /delete-all-token   | DELETE | \-               | \-                   | Gunakan ini jika autentikasi bermasalah |
| /delete-all-meeting | DELETE | \-               | \-                   | Delete semua rapat dan mentoring        |
| /delete-all         | DELETE | \-               | \-                   | Delete semua model                      |

## /mentoring 
| Route                  | Method | Need to Login as | JSON Request Body                            | Explanation                     |
| ---------------------- | ------ | ---------------- | -------------------------------------------- | ------------------------------- |
| /get-all-mentoring     | GET    | Mentor           | \-                                           | \-                              |
| /create-mentoring      | POST   | Mentor           | {lokasiMentoring, materi, passphraseAbsensi} | Membuat sesi mentoring          |
| /isi-absensi-mentoring | PATCH  | Peserta          | {mentoringId, passphraseAbsensi}             | Mengisi absensi untuk mentoring |

## /rapat 
| Route          | Method | Need to Login as | JSON Request Body                                 | Explanation        |
| -------------- | ------ | ---------------- | ------------------------------------------------- | ------------------ |
| /get-all-rapat | GET    | Panitia          | \-                                                | \-                 |
| /create-rapat  | POST   | Panitia          | {lokasiRapat, kesimpulanRapat, passphraseAbsensi} | Membuat sesi rapat |

## /acara
| Route          | Method | Need to Login as | JSON Request Body        | Explanation        |
| -------------- | ------ | ---------------- | ------------------------ | ------------------ |
| /get-all-acara | GET    | Panitia          | - | - |
| /create-acara  | POST   | Panitia          | {namaAcara, jadwalAcara}                      | Membuat sesi acara                 |

## /sponsor
| Route                     | Method | Need to Login as | JSON Request Body                          | Explanation                       |
| ------------------------- | ------ | ---------------- | ------------------------------------------ | --------------------------------- |
| /get-all-proposal-sponsor | GET    | Panitia          | \-                                         | \-                                |
| /create-proposal-sponsor  | POST   | Panitia          | {acaraId, sponsorId}                       | Membuat proposal sponsor          |
| /respon-proposal          | PATCH  | Sponsor          | {proposalSponsorId, statusProposal, paket} | Menerima/menolak proposal sponsor |

    1. Ketika panitia membuat proposal kepada pembicara, awalnya paket = null (karena paket dari sponsor), statusProposal = "Menunggu Konfirmasi Sponsor"
    2. Sponsor yang mendapatkan proposal memiliki 2 pilihan:
        a. Sponsor menolak proposal, maka statusProposal = "Ditolak". Selesai.
        b. Sponsor menerima proposal, maka sponsor akan memilih paket, statusProposal = "Diterima: <paket>"
            , dari sini Sponsor beserta Paket akan dimasukkan kedalam listSponsorBesertaPaket didalam AcaraOKKModel

## /pembicara 
| Route                       | Method | Need to Login as | JSON Request Body                             | Explanation                            |
| --------------------------- | ------ | ---------------- | --------------------------------------------- | -------------------------------------- |
| /get-all-proposal-pembicara | GET    | Panitia          | \-                                            | \-                                     |
| /create-proposal-pembicara  | POST   | Panitia          | {acaraId, pembicaraId}                        | Membuat proposal pembicara             |
| /respon-proposal-pembicara  | PATCH  | Pembicara        | {proposalPembicaraId, statusProposal, materi} | Menerima/menolak proposal pembicara    |
| /accept-or-decline-materi   | PATCH  | Panitia          | {proposalPembicaraId, statusProposal}         | Menerima/menolak materi dari pembicara |
| /respond-to-declined-materi | PATCH  | Pembicara        | {proposalPembicaraId, statusProposal, materi} | Membuat materi baru/menolak proposal   |

    1. Ketika panitia membuat proposal kepada pembicara, awalnya materiProposal = null (karena materi dari pembicara), status proposal = "Menunggu Konfirmasi Pembicara"
    2. Pembicara yang mendapatkan proposal memiliki 2 pilihan:
        a. Pembicara menolak proposal, maka statusProposal = "Ditolak Pembicara". Selesai.
        b. Pembicara menerima proposal, maka statusProposal = "Diterima Pembicara (Menunggu konfirmasi Panitia)" dan pembicara menuliskan materiProposal
    3. Ketika pembicara telah menerima proposal (2a), maka panitia akan membaca materi dan memiliki 2 pilihan:
        a. Panitia menolak materiProposal, maka statusProposal = "Ditolak Panitia". Sehingga Pembicara dapat mengusulkan materiProposal yang baru
        b. Panitia menerima materiProposal, maka statusProposal = "Diterima Panitia" dan pembicara beserta materi akan dimasukan kedalam listPembicaraBesertaMateri pada model acaraOKK. Selesai.
    4. Ketika materi ditolak oleh pembicara (3a), maka pembicara memiliki 2 pilihan:
        a. Pembicara menolak proposal (bisa jadi karena ide yang ditawarkan ditolak, ataupun sudah tidak ada ide lain), maka statusProposal = "Ditolak Pembicara". Selesai.
        b. Pembicara mengirimkan materiProposal baru kepada panitia. Sehingga statusProposal = "Diterima Pembicara (Menunggu konfirmasi Panitia)"
    
    ulang step 3-4 SELAMA statusProposal !== "Diterima Panitia" dan statusProposal !== "Ditolak Pembicara"