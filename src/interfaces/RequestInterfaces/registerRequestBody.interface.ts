interface RegisterRequestBody {
    username: string,
    password: string,
    loginAs: "Peserta" | "Mentor" | "Panitia" | "Sponsor" | "Pembicara",
    nama?: string,
    fakultas?: string,
    jurusan?: string,
    angkatan?: number,
    noKelompok?: number,
    jalurMasuk?: "SNBP " | "SNBT" | "SIMAK" | "PPKB" | "JAPRES",
    tipePengurus: string,
    bidangTerkait?: string, 
    jabatan?: string,
    namaSponsor?: string,
    namaPembicara?: string
}

export default RegisterRequestBody