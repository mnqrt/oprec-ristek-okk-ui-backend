import mongoose from "mongoose";

interface ProposalPembicaraOKK {
    _id: mongoose.Schema.Types.ObjectId,
    pembicaraId: mongoose.Schema.Types.ObjectId,
    acaraId: mongoose.Schema.Types.ObjectId,
    materiProposal: string,
    statusProposal: string

    /*
    materiProposal: string, //materi diberikan oleh pembicara, sehingga awalnya bernilai null
    statusProposal: "Diterima Panitia" | "Diterima Pembicara (Menunggu Konfirmasi Panitia)" | "Menunggu Konfirmasi Pembicara" | "Ditolak Panitia " | "Ditolak Pembicara",
    
    Penjelasan:
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
    */

}

export default ProposalPembicaraOKK