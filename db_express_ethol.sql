-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 11, 2024 at 07:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_express_ethol`
--

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `id_dosen` int(11) NOT NULL,
  `nama_dosen` varchar(255) DEFAULT NULL,
  `nip` varchar(255) DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `id_users` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id_dosen`, `nama_dosen`, `nip`, `jenis_kelamin`, `id_users`) VALUES
(1, 'Ibram Maulana Ahsanul Qasasi', '98765432', 'L', 9),
(2, 'Danang Susetyo Pranawa', '17924629', 'L', 13);

-- --------------------------------------------------------

--
-- Table structure for table `history_presensi`
--

CREATE TABLE `history_presensi` (
  `id_history_presensi` int(11) NOT NULL,
  `waktu_presensi` time DEFAULT NULL,
  `id_mahasiswa` int(11) DEFAULT NULL,
  `id_presensi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `history_presensi`
--

INSERT INTO `history_presensi` (`id_history_presensi`, `waktu_presensi`, `id_mahasiswa`, `id_presensi`) VALUES
(6, '22:12:56', 1, 16);

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id_jadwal` int(11) NOT NULL,
  `hari` enum('senin','selasa','rabu','kamis','jumat') DEFAULT NULL,
  `id_kelas` int(11) DEFAULT NULL,
  `id_matakuliah` int(11) DEFAULT NULL,
  `id_jurusan` int(11) DEFAULT NULL,
  `id_ruangan` int(11) DEFAULT NULL,
  `id_dosen` int(11) DEFAULT NULL,
  `waktu` varchar(255) DEFAULT NULL,
  `id_semester` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id_jadwal`, `hari`, `id_kelas`, `id_matakuliah`, `id_jurusan`, `id_ruangan`, `id_dosen`, `waktu`, `id_semester`) VALUES
(1, 'kamis', 1, 1, 1, 1, 1, '12:50 - 14:40', 1),
(2, 'selasa', 2, 3, 3, 3, 2, '08:30 - 10:30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `jurusan`
--

CREATE TABLE `jurusan` (
  `id_jurusan` int(11) NOT NULL,
  `nama_jurusan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jurusan`
--

INSERT INTO `jurusan` (`id_jurusan`, `nama_jurusan`) VALUES
(1, 'D3 Teknik Informatika PSDKU Sumenep'),
(2, 'D3 Teknik Multimedia Broadcasting PSDKU Sumenep'),
(3, 'D3 Teknik Informatika');

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id_kelas` int(11) NOT NULL,
  `nama_kelas` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id_kelas`, `nama_kelas`) VALUES
(1, 'A'),
(2, 'B');

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `id_mahasiswa` int(11) NOT NULL,
  `nama_mahasiswa` varchar(255) DEFAULT NULL,
  `nrp` varchar(255) DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `id_kelas` int(11) DEFAULT NULL,
  `id_jurusan` int(11) DEFAULT NULL,
  `id_users` int(11) DEFAULT NULL,
  `id_semester` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`id_mahasiswa`, `nama_mahasiswa`, `nrp`, `jenis_kelamin`, `id_kelas`, `id_jurusan`, `id_users`, `id_semester`) VALUES
(1, 'Ahmad Ari Fauzi', '3123522008', 'L', 1, 1, 8, 1),
(2, 'Dafa Ahmad Fahrisi', '3123522007', 'L', 2, 3, 11, NULL),
(3, 'Vernanda Mulia Hamonangan Manurung', '3123522005', 'L', 1, 1, 12, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `matakuliah`
--

CREATE TABLE `matakuliah` (
  `id_matakuliah` int(11) NOT NULL,
  `nama_matakuliah` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matakuliah`
--

INSERT INTO `matakuliah` (`id_matakuliah`, `nama_matakuliah`) VALUES
(1, 'Pemrograman Berbasis Objek'),
(2, 'Workshop Aplikasi Berbasis Web'),
(3, 'Algoritma Pemrograman');

-- --------------------------------------------------------

--
-- Table structure for table `materi`
--

CREATE TABLE `materi` (
  `id_materi` int(11) NOT NULL,
  `judul_materi` varchar(255) DEFAULT NULL,
  `file_materi` varchar(255) DEFAULT NULL,
  `id_jadwal` int(11) DEFAULT NULL,
  `tanggal_upload` date DEFAULT NULL,
  `hari` enum('senin','selasa','rabu','kamis','jumat','sabtu','minggu') DEFAULT NULL,
  `waktu_upload` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materi`
--

INSERT INTO `materi` (`id_materi`, `judul_materi`, `file_materi`, `id_jadwal`, `tanggal_upload`, `hari`, `waktu_upload`) VALUES
(9, 'M1 Pengenalan PBO', '/materi/1728487790302 - MIND MAP_Ahmad Ari Fauzi.png', 1, '2024-10-09', 'rabu', '22:29:02');

-- --------------------------------------------------------

--
-- Table structure for table `pengumpulan`
--

CREATE TABLE `pengumpulan` (
  `id_pengumpulan` int(11) NOT NULL,
  `file_pengumpulan` varchar(255) DEFAULT NULL,
  `id_tugas` int(11) DEFAULT NULL,
  `id_mahasiswa` int(11) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `hari_pengumpulan` enum('senin','selasa','rabu','kamis','jumat','sabtu','minggu') DEFAULT NULL,
  `tanggal_pengumpulan` date DEFAULT NULL,
  `waktu_pengumpulan` time DEFAULT NULL,
  `status_pengumpulan` enum('terlambat','tepat waktu') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengumpulan`
--

INSERT INTO `pengumpulan` (`id_pengumpulan`, `file_pengumpulan`, `id_tugas`, `id_mahasiswa`, `deskripsi`, `hari_pengumpulan`, `tanggal_pengumpulan`, `waktu_pengumpulan`, `status_pengumpulan`) VALUES
(3, '/pengumpulan/1728480917083 - Ahmad Ari Fauzi(Laporan Praktikum Java PBO).pdf', 9, 1, ' Nama: Ahmad Ari Fauzi\r\nNRP: 3123522008', 'jumat', '2024-10-11', '11:31:16', 'terlambat'),
(4, '/pengumpulan/1728619703406 - P2 Ahmad Ari Fauzi_3123522008.pdf', 10, 1, ' ', 'jumat', '2024-10-11', '10:39:25', 'tepat waktu'),
(5, '/pengumpulan/1728620095973 - Ahmad Ari Fauzi(Laporan Praktikum Java PBO).docx', 9, 3, ' Vernanda/3123522005', 'jumat', '2024-10-11', '11:33:24', 'terlambat'),
(6, '/pengumpulan/1728621580821 - P2 Ahmad Ari Fauzi_3123522008.docx', 10, 3, '', 'jumat', '2024-10-11', '11:34:48', 'tepat waktu');

-- --------------------------------------------------------

--
-- Table structure for table `presensi`
--

CREATE TABLE `presensi` (
  `id_presensi` int(11) NOT NULL,
  `pertemuan` varchar(255) DEFAULT NULL,
  `waktu_buka` time DEFAULT NULL,
  `waktu_tutup` time DEFAULT NULL,
  `status_presensi` enum('terbuka','tertutup') DEFAULT NULL,
  `id_jadwal` int(11) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `hari` enum('senin','selasa','rabu','kamis','jumat') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `presensi`
--

INSERT INTO `presensi` (`id_presensi`, `pertemuan`, `waktu_buka`, `waktu_tutup`, `status_presensi`, `id_jadwal`, `tanggal`, `hari`) VALUES
(16, 'pertemuan 1', '20:25:12', '22:15:12', 'tertutup', 1, '2024-10-09', 'rabu');

-- --------------------------------------------------------

--
-- Table structure for table `ruangan`
--

CREATE TABLE `ruangan` (
  `id_ruangan` int(11) NOT NULL,
  `nama_ruangan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ruangan`
--

INSERT INTO `ruangan` (`id_ruangan`, `nama_ruangan`) VALUES
(1, 'A-001'),
(2, 'A-002'),
(3, 'A-003');

-- --------------------------------------------------------

--
-- Table structure for table `semester`
--

CREATE TABLE `semester` (
  `id_semester` int(11) NOT NULL,
  `semester` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semester`
--

INSERT INTO `semester` (`id_semester`, `semester`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tugas`
--

CREATE TABLE `tugas` (
  `id_tugas` int(11) NOT NULL,
  `judul_tugas` varchar(255) DEFAULT NULL,
  `file_tugas` varchar(255) DEFAULT NULL,
  `id_jadwal` int(11) DEFAULT NULL,
  `tanggal_deadline` date DEFAULT NULL,
  `waktu_deadline` time DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `hari_deadline` enum('senin','selasa','rabu','kamis','jumat','sabtu','minggu') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tugas`
--

INSERT INTO `tugas` (`id_tugas`, `judul_tugas`, `file_tugas`, `id_jadwal`, `tanggal_deadline`, `waktu_deadline`, `deskripsi`, `hari_deadline`) VALUES
(9, 'Tugas 1 PBO', '/tugas/1728479876376 - Bab 1. Pengenalan Lingkunan Java.docx', 1, '2024-10-10', '23:59:00', 'Kerjakan Tugas dan Buat Laporan', 'kamis'),
(10, 'Tugas 2 PBO', '/tugas/1728486950116 - Bab 2. Pengenalan Pemrograman Berbasis Obyek OK.pdf', 1, '2024-10-11', '23:59:00', 'Buat Laporan seperti biasa, format pengumpulan pertemuan-nrp-nama', 'jumat');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `level_users` enum('mahasiswa','dosen','admin') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_users`, `email`, `password`, `level_users`) VALUES
(1, 'admin@gmail.com', 'rahasia', 'admin'),
(8, 'arifauzi441@gmail.com', 'aribjirr', 'mahasiswa'),
(9, 'ibrammaul@gmail.com', 'ibram', 'dosen'),
(11, 'dafamangku@gmail.com', 'dafa', 'mahasiswa'),
(12, 'vernandav@gmail.com', 'veri', 'mahasiswa'),
(13, 'danang@gmail.com', 'danang', 'dosen');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id_dosen`);

--
-- Indexes for table `history_presensi`
--
ALTER TABLE `history_presensi`
  ADD PRIMARY KEY (`id_history_presensi`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id_jadwal`);

--
-- Indexes for table `jurusan`
--
ALTER TABLE `jurusan`
  ADD PRIMARY KEY (`id_jurusan`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id_kelas`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`id_mahasiswa`);

--
-- Indexes for table `matakuliah`
--
ALTER TABLE `matakuliah`
  ADD PRIMARY KEY (`id_matakuliah`);

--
-- Indexes for table `materi`
--
ALTER TABLE `materi`
  ADD PRIMARY KEY (`id_materi`);

--
-- Indexes for table `pengumpulan`
--
ALTER TABLE `pengumpulan`
  ADD PRIMARY KEY (`id_pengumpulan`);

--
-- Indexes for table `presensi`
--
ALTER TABLE `presensi`
  ADD PRIMARY KEY (`id_presensi`);

--
-- Indexes for table `ruangan`
--
ALTER TABLE `ruangan`
  ADD PRIMARY KEY (`id_ruangan`);

--
-- Indexes for table `semester`
--
ALTER TABLE `semester`
  ADD PRIMARY KEY (`id_semester`);

--
-- Indexes for table `tugas`
--
ALTER TABLE `tugas`
  ADD PRIMARY KEY (`id_tugas`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id_dosen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `history_presensi`
--
ALTER TABLE `history_presensi`
  MODIFY `id_history_presensi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `jadwal`
--
ALTER TABLE `jadwal`
  MODIFY `id_jadwal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jurusan`
--
ALTER TABLE `jurusan`
  MODIFY `id_jurusan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id_kelas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  MODIFY `id_mahasiswa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `matakuliah`
--
ALTER TABLE `matakuliah`
  MODIFY `id_matakuliah` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `materi`
--
ALTER TABLE `materi`
  MODIFY `id_materi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pengumpulan`
--
ALTER TABLE `pengumpulan`
  MODIFY `id_pengumpulan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `presensi`
--
ALTER TABLE `presensi`
  MODIFY `id_presensi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `ruangan`
--
ALTER TABLE `ruangan`
  MODIFY `id_ruangan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `semester`
--
ALTER TABLE `semester`
  MODIFY `id_semester` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tugas`
--
ALTER TABLE `tugas`
  MODIFY `id_tugas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
