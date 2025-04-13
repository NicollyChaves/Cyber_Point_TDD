-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 07-Abr-2025 às 03:47
-- Versão do servidor: 10.1.38-MariaDB
-- versão do PHP: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bd_agenda_contatos`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_contatos`
--

CREATE TABLE `tb_contatos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `tb_contatos`
--

INSERT INTO `tb_contatos` (`id`, `usuario_id`, `nome`, `telefone`, `email`, `atualizado_em`) VALUES
(1, 1, 'Luke', '999999999', 'luke@gmail.com', NULL),
(2, 2, 'Livia', '888888888', 'liv@gmail.com', NULL),
(3, 3, 'Vinicius', '777777777', 'Vini@gmail.com', NULL),
(4, 1, 'Anthony', '666666666', 'thony@gmail.com', NULL),
(5, 1, 'Yolanda', '555555555', 'landa@gmail.com', NULL),
(6, 1, 'Kennedy', '444444444', 'kg@gmail.com', NULL),
(7, 8, 'Karina', '333333333', 'kaka@gmail.com', NULL),
(8, 8, 'Daniel', '222222222', 'dan@gmail.com', NULL),
(10, 8, 'Julia', '111111111', 'juh@gmail.com', NULL),
(14, 1, 'Teste', '000000000', 'test@gmail.com', '2025-04-06 21:55:48'),
(15, 1, 'Teste_A', '101010101', 'test@gmail.com', NULL),
(17, 1, 'Gabriel', '123456789', 'gab@gmail.com', NULL),
(18, 9, 'anna', '01199999954', 'anna@hotmail.com', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_contatos_excluidos`
--

CREATE TABLE `tb_contatos_excluidos` (
  `id` int(11) NOT NULL,
  `contato_id` int(11) DEFAULT NULL,
  `data_exclusao` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `tb_contatos_excluidos`
--

INSERT INTO `tb_contatos_excluidos` (`id`, `contato_id`, `data_exclusao`) VALUES
(1, 12, '2025-04-06 21:52:29'),
(2, 13, '2025-04-06 21:52:33'),
(3, 16, '2025-04-06 21:56:04');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_usuarios`
--

CREATE TABLE `tb_usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `imagem` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `tb_usuarios`
--

INSERT INTO `tb_usuarios` (`id`, `nome`, `email`, `senha`, `imagem`) VALUES
(1, 'Nicolly', 'Nick@gmail.com', 'nick', '1743979209324.png'),
(2, 'Eliane', 'eliane@gmail.com', 'eli', '1743875224786.png'),
(3, 'Erick', 'erick@gmail.com', 'eri', '1743875257040.png'),
(4, 'Matheus', 'math@gmail.com', 'math', '1743893296864.png'),
(5, 'Joana', 'joh@gmail.com', 'joh', '1743896327955.png'),
(6, 'Eduardo', 'dudu@gmail.com', 'dudu', '1743902416523.png'),
(7, 'Luana', 'Lu@gmail.com', 'lu', '1743902494844.png'),
(8, 'Luke', 'luke@gmail.com', 'luk', '1743949897480.png'),
(9, 'jurandir', 'annn@hotmail', '1000', '1743988439515.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_contatos`
--
ALTER TABLE `tb_contatos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `tb_contatos_excluidos`
--
ALTER TABLE `tb_contatos_excluidos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_usuarios`
--
ALTER TABLE `tb_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_contatos`
--
ALTER TABLE `tb_contatos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tb_contatos_excluidos`
--
ALTER TABLE `tb_contatos_excluidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_usuarios`
--
ALTER TABLE `tb_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `tb_contatos`
--
ALTER TABLE `tb_contatos`
  ADD CONSTRAINT `tb_contatos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
