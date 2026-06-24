-- MySQL dump 10.13  Distrib 8.4.9, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_rentas
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_clientes_id` (`id`),
  KEY `ix_clientes_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `cantidad_total` int DEFAULT NULL,
  `precio_renta` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_items_cantidad_total` (`cantidad_total`),
  KEY `ix_items_price` (`precio_renta`),
  KEY `ix_items_name` (`nombre`),
  KEY `ix_items_categoria` (`categoria`),
  KEY `ix_items_color` (`color`),
  KEY `ix_items_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Mesa Rectangular','Mesas','Blanco',30,30),(2,'Mesa Redonda','Mesas','Blanco',40,30),(3,'Silla Plegable','Sillas','Negro',700,6),(4,'Mantel Base','Manteles','Blanco',100,30),(5,'Cubresilla','Cubresillas','Blanco',700,10),(6,'Pared de Carpa','Accesorios Carpa','Blanco',9,100),(7,'Brincolin','Inflables','Multicolor',1,500),(8,'Carpa 6x6','Carpas','Blanco',5,600),(9,'Carpa 3x6','Carpas','Blanco',5,300),(10,'Cubremantel','Cubremanteles','Rojo',50,20),(11,'Cubremantel','Cubremanteles','Azul Rey',50,20),(12,'Cubremantel','Cubremanteles','Azul Marino',50,20),(13,'Cubremantel','Cubremanteles','Azul Cielo',50,20),(14,'Cubremantel','Cubremanteles','Dorado',50,20),(15,'Cubremantel','Cubremanteles','Plateado',50,20),(16,'Cubremantel','Cubremanteles','Verde Esmeralda',50,20),(17,'Cubremantel','Cubremanteles','Verde Menta',50,20),(18,'Cubremantel','Cubremanteles','Verde Bandera',50,20),(19,'Cubremantel','Cubremanteles','Amarillo',50,20),(20,'Cubremantel','Cubremanteles','Naranja',50,20),(21,'Cubremantel','Cubremanteles','Fucsia',50,20),(22,'Cubremantel','Cubremanteles','Rosa Palo',50,20),(23,'Cubremantel','Cubremanteles','Rosa Pastel',50,20),(24,'Cubremantel','Cubremanteles','Morado',50,20),(25,'Cubremantel','Cubremanteles','Lila',50,20),(26,'Cubremantel','Cubremanteles','Vino (Burgundy)',50,20),(27,'Cubremantel','Cubremanteles','Turquesa',50,20),(28,'Cubremantel','Cubremanteles','Coral',50,20),(29,'Cubremantel','Cubremanteles','Durazno (Peach)',50,20),(30,'Cubremantel','Cubremanteles','Negro',50,20),(31,'Cubremantel','Cubremanteles','Blanco',50,20),(32,'Mo├▒o','Mo├▒os','Rojo',150,5),(33,'Mo├▒o','Mo├▒os','Azul Rey',150,5),(34,'Mo├▒o','Mo├▒os','Azul Marino',150,5),(35,'Mo├▒o','Mo├▒os','Azul Cielo',150,5),(36,'Mo├▒o','Mo├▒os','Dorado',150,5),(37,'Mo├▒o','Mo├▒os','Plateado',150,5),(38,'Mo├▒o','Mo├▒os','Verde Esmeralda',150,5),(39,'Mo├▒o','Mo├▒os','Verde Menta',150,5),(40,'Mo├▒o','Mo├▒os','Verde Bandera',150,5),(41,'Mo├▒o','Mo├▒os','Amarillo',150,5),(42,'Mo├▒o','Mo├▒os','Naranja',150,5),(43,'Mo├▒o','Mo├▒os','Fucsia',150,5),(44,'Mo├▒o','Mo├▒os','Rosa Palo',150,5),(45,'Mo├▒o','Mo├▒os','Rosa Pastel',150,5),(46,'Mo├▒o','Mo├▒os','Morado',150,5),(47,'Mo├▒o','Mo├▒os','Lila',150,5),(48,'Mo├▒o','Mo├▒os','Vino (Burgundy)',150,5),(49,'Mo├▒o','Mo├▒os','Turquesa',150,5),(50,'Mo├▒o','Mo├▒os','Coral',150,5),(51,'Mo├▒o','Mo├▒os','Durazno (Peach)',150,5),(52,'Mo├▒o','Mo├▒os','Negro',150,5),(53,'Mo├▒o','Mo├▒os','Blanco',150,5);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `renta_detalles`
--

DROP TABLE IF EXISTS `renta_detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `renta_detalles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `renta_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `renta_id` (`renta_id`),
  KEY `item_id` (`item_id`),
  KEY `ix_renta_detalles_id` (`id`),
  CONSTRAINT `renta_detalles_ibfk_1` FOREIGN KEY (`renta_id`) REFERENCES `rentas` (`id`),
  CONSTRAINT `renta_detalles_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `renta_detalles`
--

LOCK TABLES `renta_detalles` WRITE;
/*!40000 ALTER TABLE `renta_detalles` DISABLE KEYS */;
/*!40000 ALTER TABLE `renta_detalles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rentas`
--

DROP TABLE IF EXISTS `rentas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rentas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `fecha_evento` date DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `fecha_recoleccion` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `total` float DEFAULT NULL,
  `lugar_evento` varchar(300) DEFAULT NULL,
  `nombre_cliente` varchar(200) DEFAULT NULL,
  `telefono_cliente` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `ix_rentas_id` (`id`),
  CONSTRAINT `rentas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rentas`
--

LOCK TABLES `rentas` WRITE;
/*!40000 ALTER TABLE `rentas` DISABLE KEYS */;
/*!40000 ALTER TABLE `rentas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-23 22:13:17
