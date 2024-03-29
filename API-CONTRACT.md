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
- Jika register sebagai PanitiaOKK, perlu melampirkan `[username, password, role, nama, fakultas, jurusan, angkatan, tipePengurus, bidangTerkait, jabatan]`. Maksimal 1 PJ dan 2 WaPJ
- Jika register sebagai PesertaOKK, perlu melampirkan `[username, password, role, nama, fakultas, jurusan, angkatan, noKelompok, jalurMasuk]`
- Jika register sebagai MentorOKK, perlu melampirkan  `[username, password, role, nama, fakultas, jurusan, angkatan, noKelompok]`
- Jika register sebagai SponsorOKK, perlu melampirkan `[username, password, role, namaSponsor]`
- Jika register sebagai PembicaraOKK, perlu melampirkan `[username, password, role, namaPembicara]`

## /auth 
| Route                   | Method | Need to Login as | JSON Request Body    | Explanation                             |
| ----------------------- | ------ | ---------------- | -------------------- | --------------------------------------- |
| /auth/get-all-peserta    | GET    | \-               | \-                   | \-                                      |
| /auth/get-all-mentor     | GET    | \-               | \-                   | \-                                      |
| /auth/get-all-panitia    | GET    | \-               | \-                   | \-                                      |
| /auth/get-all-sponsor    | GET    | \-               | \-                   | \-                                      |
| /auth/get-all-pembicara  | GET    | \-               | \-                   | \-                                      |
| /auth/register           | POST   | \-               | Sudah dijelaskan.    | \-                                      |
| /auth/login              | POST   | \-               | {username, password} | \-                                      |
| /auth/change-password    | PATCH  | User             |                      |                                         |
| /auth/logout             | DELETE | User             | \-                   | \-                                      |
| /auth/delete-all-token   | DELETE | \-               | \-                   | Gunakan ini jika autentikasi bermasalah |
| /auth/delete-all-meeting | DELETE | \-               | \-                   | Delete semua rapat dan mentoring        |
| /auth/delete-all         | DELETE | \-               | \-                   | Delete semua model                      |

## /mentoring 
| Route                        | Method | Need to Login as | JSON Request Body                            | Explanation                                              |
| ---------------------------- | ------ | ---------------- | -------------------------------------------- | -------------------------------------------------------- |
| /mentoring/get-all-mentoring-by-mentor | GET    | Mentor           | \-                                           | Return semua mentoring yang diadakan mentor tersebut     |
| /mentoring/get-all-mentoring           | GET    | Panitia          | \-                                           | Return semua mentoring                                   |
| /mentoring/create-mentoring            | POST   | Mentor           | {lokasiMentoring, materi, passphraseAbsensi} | Membuat sesi mentoring                                   |
| /mentoring/isi-absensi-mentoring       | PATCH  | Peserta          | {mentoringId, passphraseAbsensi}             | Mengisi absensi untuk mentoring, noKelompok harus sesuai |
| /mentoring/delete-mentoring-by-id/{id} | DELETE | Mentor           | \-                                           | \-                                                       |

    1. Mentor membuat rapat dengan `POST /mentoring/create-mentoring` (beserta JSON Request Body).
    2. Mentor memberitahu passphraseAbsensi kepada Peserta mentoring.
    3. Peserta mentoring mengisi absensi dengan `PATCH /mentoring/isi-absensi-mentoring` (beserta JSON Request Body).

## /rapat 
| Route                    | Method | Need to Login as | JSON Request Body                                 | Explanation                     |
| ------------------------ | ------ | ---------------- | ------------------------------------------------- | ------------------------------- |
| /mentoring/get-all-rapat           | GET    | Panitia          | \-                                                | \-                              |
| /mentoring/create-rapat            | POST   | Panitia          | {lokasiRapat, kesimpulanRapat, passphraseAbsensi} | Hanya dapat dibuat PJ/WaPJ              |
| /mentoring/isi-absensi-rapat       | PATCH  | Panitia          | {rapatId, passphraseAbsensi}                      | Hanya dapat diisi panitia dengan bidang sama |
| /mentoring/delete-rapat-by-id/{id} | DELETE | Panitia          | \-                                                | \-                              |

    1. Panitia membuat rapat dengan `POST /rapat/create-rapat` (beserta JSON Request Body).
    2. Panitia memberitahu passphraseAbsensi kepada Panitia lainnya.
    3. Panitia lainnya mengisi absensi dengan `PATCH /rapat/isi-absensi-rapat` (beserta JSON Request Body).

## /acara
| Route                    | Method | Need to Login as | JSON Request Body        | Explanation        |
| ------------------------ | ------ | ---------------- | ------------------------ | ------------------ |
| /acara/get-all-acara           | GET    | Panitia          | {namaAcara, jadwalAcara} | Membuat sesi acara |
| /acara/create-acara            | POST   | Panitia          | \-                       | \-                 |
| /acara/delete-acara-by-id/{id} | DELETE | Panitia          | \-                       | \-                 |

## /sponsor
| Route                               | Method | Need to Login as | JSON Request Body                          | Explanation                       |
| ----------------------------------- | ------ | ---------------- | ------------------------------------------ | --------------------------------- |
| /sponsor/get-all-proposal-sponsor           | GET    | Panitia          | \-                                         | \-                                |
| /sponsor/create-proposal-sponsor            | POST   | Panitia          | {acaraId, sponsorId}                       | Membuat proposal sponsor          |
| /sponsor/respon-proposal                    | PATCH  | Sponsor          | {proposalSponsorId, statusProposal, paket} | Menerima/menolak proposal sponsor |
| /sponsor/delete-proposal-sponsor-by-id/{id} | DELETE | Panitia          | \-                                         | \-                                |

    1. Ketika panitia membuat proposal kepada pembicara, awalnya paket = null (karena paket dari sponsor), statusProposal = "Menunggu Konfirmasi Sponsor"
    2. Sponsor yang mendapatkan proposal memiliki 2 pilihan:
        a. Sponsor menolak proposal, maka statusProposal = "Ditolak". Selesai.
        b. Sponsor menerima proposal, maka sponsor akan memilih paket, statusProposal = "Diterima: <paket>"
            , dari sini Sponsor beserta Paket akan dimasukkan kedalam listSponsorBesertaPaket didalam AcaraOKKModel
            , acara juga akan dimasukan kedalam listAcaraDisponsori pada Sponsor. Selesai.

    Note: Untuk membuat proposalSponsor; Panitia perlu untuk membuat acara, kemudian `GET /acara/get-all-acara` untuk mendapatkan acaraId (pada `_id`), perlu juga untuk `GET /auth/get-all-sponsor` untuk mendapatkan sponsorId (pada `_id`)

## /pembicara 
| Route                                 | Method | Need to Login as | JSON Request Body                             | Explanation                            |
| ------------------------------------- | ------ | ---------------- | --------------------------------------------- | -------------------------------------- |
| /pembicara /get-all-proposal-pembicara           | GET    | Panitia          | \-                                            | \-                                     |
| /pembicara/create-proposal-pembicara            | POST   | Panitia          | {acaraId, pembicaraId}                        | Membuat proposal pembicara             |
| /pembicara/respon-proposal-pembicara            | PATCH  | Pembicara        | {proposalPembicaraId, statusProposal, materi} | Menerima/menolak proposal pembicara    |
| /pembicara/accept-or-decline-materi             | PATCH  | Panitia          | {proposalPembicaraId, statusProposal}         | Menerima/menolak materi dari pembicara |
| /pembicara/respond-to-declined-materi           | PATCH  | Pembicara        | {proposalPembicaraId, statusProposal, materi} | Membuat materi baru/menolak proposal   |
| /pembicara/delete-proposal-pembicara-by-id/{id} | DELETE | Panitia          | \-                                            | \-                                     |

    1. Ketika panitia membuat proposal kepada pembicara, awalnya materiProposal = null (karena materi dari pembicara), status proposal = "Menunggu Konfirmasi Pembicara"
    2. Pembicara yang mendapatkan proposal memiliki 2 pilihan:
        a. Pembicara menolak proposal, maka statusProposal = "Ditolak Pembicara". Selesai.
        b. Pembicara menerima proposal, maka statusProposal = "Diterima Pembicara (Menunggu konfirmasi Panitia)" dan pembicara menuliskan materiProposal
    3. Ketika pembicara telah menerima proposal (2a), maka panitia akan membaca materi dan memiliki 2 pilihan:
        a. Panitia menolak materiProposal, maka statusProposal = "Ditolak Panitia". Sehingga Pembicara dapat mengusulkan materiProposal yang baru
        b. Panitia menerima materiProposal, maka statusProposal = "Diterima Panitia"
            ,dari sini pembicara beserta materi akan dimasukan kedalam listPembicaraBesertaMateri pada model acaraOKK
            ,acara juga akan dimasukan kedalam listAcaraDiisi dalam Pembicara. Selesai.
    4. Ketika materi ditolak oleh pembicara (3a), maka pembicara memiliki 2 pilihan:
        a. Pembicara menolak proposal (bisa jadi karena ide yang ditawarkan ditolak, ataupun sudah tidak ada ide lain), maka statusProposal = "Ditolak Pembicara". Selesai.
        b. Pembicara mengirimkan materiProposal baru kepada panitia. Sehingga statusProposal = "Diterima Pembicara (Menunggu konfirmasi Panitia)"
    
    ulang step 3-4 SELAMA statusProposal !== "Diterima Panitia" dan statusProposal !== "Ditolak Pembicara"

    Note: Untuk membuat proposalPembicara; Panitia perlu untuk membuat acara, kemudian `GET /acara/get-all-acara` untuk mendapatkan acaraId (pada `_id`), perlu juga untuk `GET /auth/get-all-pembicara` untuk mendapatkan pembicaraId (pada `_id`)