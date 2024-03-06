# Getting started
Setelah melakukan `git clone`, run 
```
npm i
npm run dev
```

# API CONTRACT
Anda dapat mengakses penjelasan secara detail pada setiap routes melalui [link ini (format .md)](https://github.com/mnqrt/oprec-ristek-okk-ui-backend/blob/main/API-CONTRACT.md) atau melalui [link ini (spreadsheet)](https://docs.google.com/spreadsheets/d/1dSt9DxhGdvFsfb93bzoGp0Pga_qVYCh6EaKdeNRrtUQ/edit#gid=1315661199).

# Penjelasan Singkat
- Pada bidang BPH di kepanitiaan OKK, hanya boleh terdapat maksimal 1 PJ dan 2 WaPJ. 

- Untuk melakukan rapat/mentoring, panitia/mentoring pembuat rapat akan membuat suatu objek RapatOKK/MentoringOKK, mereka dapat membuat suatu passphrase yang nantinya akan diberitahukan kepada peserta rapat. Jika peserta rapat ingin melakukan absensi, mereka perlu mengikutsertakan passphrase absensi yang diberitahukan oleh sang pembuat rapat

- Untuk memasukkan sponsor ke acara, panitia dapat mengirimkan proposal sponsor kepada sang sponsor. Kemudian, sponsor dapat menerima proposal (kemudian sponsor akan dimasukan kedalam listSponsor pada acara) beserta paket yang dipilih. Jika sponsor menolak, maka proposal akan berakhir. (Proposal tidak otomatis dihapus agar panitia dapat melihat riwayat proposal)

- Untuk memasukkan Pembicara ke acara, panitia dapat mengirimkan proposal pembicara kepada sang pembicara. Kemudian, pembicara dapat menerima proposal sekaligus mengajukan materi yang akan disampaikan (Jika pembicara menolak, proposal akan berakhir). Setelahnya, apabila materi diterima oleh panitia, maka pembicara akan dimasukan kedalam listPembicara pada acara. Namun jika tidak, pembicara dapat mengajukan materi lagi atau dapat menolak proposal. (Proposal tidak otomatis dihapus agar panitia dapat melihat riwayat proposal)