-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: carmanagementsystem
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `tripId` int NOT NULL,
  `bookingDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `numberOfSeats` int NOT NULL,
  `totalAmount` double NOT NULL,
  `paymentStatus` varchar(20) DEFAULT 'Pending',
  `bookingStatus` varchar(20) DEFAULT 'Confirmed',
  `seatNumbers` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `tripId` (`tripId`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`tripId`) REFERENCES `trip` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (105,24,19,'2025-09-13 20:42:54',1,20000,'paid','confirmed','A1'),(106,24,19,'2025-09-13 20:45:04',1,20000,'paid','confirmed','A2');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus`
--

DROP TABLE IF EXISTS `bus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `licensePlate` varchar(20) NOT NULL,
  `model` varchar(50) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `yearManufacture` int DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `description` text,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `licensePlate` (`licensePlate`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus`
--

LOCK TABLES `bus` WRITE;
/*!40000 ALTER TABLE `bus` DISABLE KEYS */;
INSERT INTO `bus` VALUES (1,'51A-12345','Hyundai Universe',34,2020,'Active','Xe giường nằm 2 tầng , thoải mái và linh hoạt trong việc đi đường xa ',1),(2,'51B-12345','Thaco Universe',16,2018,'Maintenance','Xe 16 chỗ Di chuyển linh hoạt cho việc du lịch gần ',1),(3,'51C-12345','Samco Isuzu',24,2019,'Active','Xe giường nằm cao cấp , Luxury , Limousion , Sang trọng trong việc di chuyển đường dài ',1),(4,'43B-000.11','Ford Transit',16,2022,'Active','Xe chuyên tuyến ngắn.',0),(17,'51B-123.45','B',40,2025,'Active','xe sang trọng đẹp và mới giúp dễ dàng trong việ di chuyển ',1);
/*!40000 ALTER TABLE `bus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_location`
--

DROP TABLE IF EXISTS `bus_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `busId` int NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `busId` (`busId`),
  CONSTRAINT `bus_location_ibfk_1` FOREIGN KEY (`busId`) REFERENCES `bus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_location`
--

LOCK TABLES `bus_location` WRITE;
/*!40000 ALTER TABLE `bus_location` DISABLE KEYS */;
INSERT INTO `bus_location` VALUES (1,1,10.76262200,106.66017200,'2025-08-22 00:12:36'),(2,1,10.76262200,106.66017200,'2025-08-22 23:37:26'),(3,1,10.76262200,106.66017200,'2025-08-23 01:51:35'),(4,1,10.76262200,106.66017200,'2025-08-23 01:51:49'),(5,2,10.76262200,106.66017200,'2025-08-23 01:53:50');
/*!40000 ALTER TABLE `bus_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_station`
--

DROP TABLE IF EXISTS `bus_station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_station` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_station`
--

LOCK TABLES `bus_station` WRITE;
/*!40000 ALTER TABLE `bus_station` DISABLE KEYS */;
INSERT INTO `bus_station` VALUES (1,'Bến xe Miền Đông mới','293 Đinh Bộ Lĩnh, P.26, Bình Thạnh','Hồ Chí Minh',10.81417600,106.72181500),(2,'Bến xe An Sương','QL22, Bà Điểm, Hóc Môn','Hồ Chí Minh',10.85222200,106.59305600),(3,'Bến xe Miền Tây','395 Kinh Dương Vương, An Lạc, Bình Tân','Hồ Chí Minh',10.73294400,106.60361100),(4,'Bến xe Giáp Bát','Giải Phóng, Giáp Bát, Hoàng Mai','Hà Nội',20.97833300,105.84138900),(6,'Bến xe Nước Ngầm','Ngọc Hồi, Hoàng Liệt, Hoàng Mai','Hà Nội',20.95416700,105.83750000),(7,'Bến xe Trung tâm Đà Nẵng','201 Tôn Đức Thắng, Hòa Minh, Liên Chiểu','Đà Nẵng',16.07416700,108.19638900),(8,'Bến xe Trung tâm Cần Thơ','QL1A, Hưng Thạnh, Cái Răng','Cần Thơ',10.04516200,105.74685700),(9,'Bến xe phía Nam Huế','97 An Dương Vương, An Cựu, TP. Huế','Huế',16.45361100,107.59361100),(13,'Bến Xe Sư Vạn','Đường Sư Vạn Hạnh, Chung cư Ngô Gia Tự, Phường Vườn Lài, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, 72712, Việt Nam','Thành phố Thủ Đức',10.76271243,106.67279622);
/*!40000 ALTER TABLE `bus_station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver`
--

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `licenseNumber` varchar(50) NOT NULL,
  `licenseType` varchar(10) DEFAULT NULL,
  `dateOfIssue` date DEFAULT NULL,
  `dateOfExpiry` date DEFAULT NULL,
  `contactNumber` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `licenseNumber` (`licenseNumber`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `driver_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver`
--

LOCK TABLES `driver` WRITE;
/*!40000 ALTER TABLE `driver` DISABLE KEYS */;
INSERT INTO `driver` VALUES (1,2,'DL00123457','A','2010-01-05','2026-01-02','0901234567','123 Đường A, Quận B, Thủ Dô Hà Nội',1),(7,6,'DL00123458','A','2019-01-25','2025-07-01','0842491235','Bùi Hữu Nghĩa , quận bình thạnh , Hồ Chí Minh',1);
/*!40000 ALTER TABLE `driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_schedule`
--

DROP TABLE IF EXISTS `driver_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `driverId` int NOT NULL,
  `busId` int DEFAULT NULL,
  `routeId` int DEFAULT NULL,
  `tripId` int DEFAULT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `shiftType` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Scheduled',
  `note` text,
  PRIMARY KEY (`id`),
  KEY `driverId` (`driverId`),
  KEY `busId` (`busId`),
  KEY `routeId` (`routeId`),
  KEY `tripId` (`tripId`),
  CONSTRAINT `driver_schedule_ibfk_1` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`),
  CONSTRAINT `driver_schedule_ibfk_2` FOREIGN KEY (`busId`) REFERENCES `bus` (`id`),
  CONSTRAINT `driver_schedule_ibfk_3` FOREIGN KEY (`routeId`) REFERENCES `route` (`id`),
  CONSTRAINT `driver_schedule_ibfk_4` FOREIGN KEY (`tripId`) REFERENCES `trip` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_schedule`
--

LOCK TABLES `driver_schedule` WRITE;
/*!40000 ALTER TABLE `driver_schedule` DISABLE KEYS */;
INSERT INTO `driver_schedule` VALUES (4,1,1,1,1,'2025-08-08 06:00:00','2025-08-08 14:00:00','Morning','In Progress','Bắt đầu chuyến đi sáng'),(5,1,1,1,1,'2025-08-10 15:00:00','2025-08-10 19:00:00','Morning','Scheduled','Chạy thử nghiệm'),(13,1,1,1,18,'2025-08-14 06:03:00','2025-08-14 12:59:00','Morning','Scheduled',''),(14,1,1,1,18,'2025-08-16 03:00:00','2025-08-16 13:00:00','Morning','Scheduled',''),(16,1,1,1,20,'2025-08-21 08:00:00','2025-08-21 16:00:00','Morning','Scheduled','sdsdas'),(17,1,1,1,19,'2025-09-04 09:00:00','2025-09-04 13:00:00','Morning','Scheduled','chú ý '),(18,1,1,1,19,'2025-09-05 13:00:00','2025-09-05 19:00:00','Morning','Scheduled','chú ý '),(19,1,1,1,19,'2025-09-05 12:00:00','2025-09-05 18:00:00','Morning','Scheduled','chú ý '),(20,1,1,1,19,'2025-09-03 07:00:00','2025-09-03 09:00:00','Morning','Scheduled',''),(21,1,1,1,19,'2025-09-06 08:00:00','2025-09-06 13:00:00','Morning','Scheduled','sdfsdjh'),(22,1,1,25,19,'2025-09-02 09:00:00','2025-09-02 13:00:00','Morning','Scheduled',''),(23,1,1,25,19,'2025-09-04 12:00:00','2025-09-04 16:00:00','Morning','Scheduled',''),(24,1,1,1,19,'2025-09-08 15:00:00','2025-09-08 20:00:00','Morning','Scheduled',''),(25,1,1,1,19,'2025-09-09 08:00:00','2025-09-09 15:00:00','Morning','Scheduled',''),(26,1,1,1,19,'2025-09-10 08:00:00','2025-09-10 14:00:00','Morning','Scheduled','không'),(27,1,1,1,19,'2025-09-11 12:00:00','2025-09-11 19:00:00','Morning','Scheduled','không'),(28,1,1,1,19,'2025-09-11 08:00:00','2025-09-11 14:00:00','Morning','Scheduled','không'),(29,1,1,1,19,'2025-09-23 15:00:00','2025-09-23 22:00:00','Morning','Scheduled','không'),(30,1,1,1,19,'2025-09-12 14:00:00','2025-09-12 19:00:00','Morning','Scheduled',''),(31,1,1,1,19,'2025-09-16 09:00:00','2025-09-16 15:00:00','Morning','Scheduled',''),(32,1,1,3,19,'2025-09-17 08:00:00','2025-09-17 13:00:00','Morning','Scheduled',''),(33,1,1,3,19,'2025-09-18 10:00:00','2025-09-18 14:00:00','Morning','Scheduled',''),(34,1,1,1,17,'2025-09-19 10:00:00','2025-09-19 17:00:00','Morning','Scheduled','');
/*!40000 ALTER TABLE `driver_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `isRead` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passenger_info`
--

DROP TABLE IF EXISTS `passenger_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passenger_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `nationalId` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  UNIQUE KEY `nationalId` (`nationalId`),
  CONSTRAINT `passenger_info_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passenger_info`
--

LOCK TABLES `passenger_info` WRITE;
/*!40000 ALTER TABLE `passenger_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `passenger_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `paymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `amount` double NOT NULL,
  `method` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Completed',
  `receiptUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `booking` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (115,105,'2025-09-13 20:43:19',20000,'PayPal','paid','https://www.paypal.com/myaccount/transactions/PAYID-NDCXJZI2HB14740VF8487607'),(116,105,'2025-09-13 20:43:21',20000,'PayPal','paid','https://www.paypal.com/myaccount/transactions/PAYID-NDCXJZI2HB14740VF8487607'),(117,106,'2025-09-13 20:45:21',20000,'PayPal','paid','https://www.paypal.com/myaccount/transactions/PAYID-NDCXKZY3DC93197KG665022F'),(118,106,'2025-09-13 20:45:23',20000,'PayPal','paid','https://www.paypal.com/myaccount/transactions/PAYID-NDCXKZY3DC93197KG665022F');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tripId` int NOT NULL,
  `userId` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tripId` (`tripId`),
  KEY `userId` (`userId`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`tripId`) REFERENCES `trip` (`id`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `review_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (13,19,24,2,'chuyến đi thoải mái','2025-09-13 20:47:12'),(14,19,24,3,'chuyến đi thoải mái','2025-09-13 20:47:28');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route` (
  `id` int NOT NULL AUTO_INCREMENT,
  `routeName` varchar(100) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `distanceKm` double DEFAULT NULL,
  `estimatedTravelTime` varchar(50) DEFAULT NULL,
  `pricePerKm` double DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `originStationId` int DEFAULT NULL,
  `destinationStationId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `routeName` (`routeName`),
  KEY `fk_route_originStation` (`originStationId`),
  KEY `fk_route_destinationStation` (`destinationStationId`),
  CONSTRAINT `fk_route_destinationStation` FOREIGN KEY (`destinationStationId`) REFERENCES `bus_station` (`id`),
  CONSTRAINT `fk_route_originStation` FOREIGN KEY (`originStationId`) REFERENCES `bus_station` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES (1,'Hà Nội - Sapa','Hà Nội','Sapa',100,'6 hours',1500,1,NULL,NULL),(2,'TP.HCM - Đà Lạt','TP.HCM','Đà Lạt',100,'7 hours',1600,1,NULL,NULL),(3,'Đà Nẵng - Huế','Đà Nẵng','Huế',100,'3 hours',2000,1,NULL,NULL),(4,'Hồ Chí Minh - Bình Định','Hồ Chí Minh','Bình Định',600,'12 hours',1200,1,NULL,NULL),(6,'Hồ Chí Minh - Hà Nội','Hồ Chí Minh','Hà Nội',1000,'12 hours',1500,1,NULL,NULL),(7,'Bình Định - Hồ Chí Minh','Bình Định','Hồ Chí Minh',500,'12 hours ',1600,1,NULL,NULL),(10,'Hồ Chí Minh - Nha Trang','Hồ Chí Minh','Nha Trang',200,'7 hours',10000,1,NULL,NULL),(25,'Hồ Chí Minh - Huế','Hồ Chí Minh','Huế',600,'14 hours',800,1,NULL,NULL),(27,'Hồ Chí Minh - Bến Tre','Hồ Chí Minh','Bến Tre',100,'5 hours',5000,1,NULL,NULL),(28,'Hà Nội - Trà Vinh','Hà Nội ','Trà Vinh',100,'5 hours',1000,1,NULL,NULL),(29,'Hà Nội - Đà nẵng','Hà Nội ','Đà Nẵng',500,'6 hours',10000,1,1,1);
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transfer_point`
--

DROP TABLE IF EXISTS `transfer_point`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfer_point` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stationId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stationId` (`stationId`),
  CONSTRAINT `transfer_point_ibfk_1` FOREIGN KEY (`stationId`) REFERENCES `bus_station` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfer_point`
--

LOCK TABLES `transfer_point` WRITE;
/*!40000 ALTER TABLE `transfer_point` DISABLE KEYS */;
INSERT INTO `transfer_point` VALUES (1,1,'Văn phòng Quận 1','123 Nguyễn Huệ, Quận 1','Hồ Chí Minh',10.77653000,106.70098100),(2,1,'Ngã tư Hàng Xanh','Ngã tư Hàng Xanh, Bình Thạnh','Hồ Chí Minh',10.80121400,106.71460900),(3,1,'Bến xe Miền Đông','292 Đinh Bộ Lĩnh, Bình Thạnh','Hồ Chí Minh',10.80185300,106.71452700),(5,13,'a','Ðiện Biên Phủ, Cư xá Đô Thành, Phường Vườn Lài, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, 70001, Việt Nam','Thành phố Thủ Đức',10.77492184,106.68176116),(6,1,'B','Hẻm 267 Lê Đình Cẩn, Phường Tân Tạo, Thành phố Hồ Chí Minh, 73118, Việt Nam','Thành phố Hồ Chí Minh',10.75843733,106.59341746),(7,7,'A-B','Hẻm 156 Đường Ba Đình, Phường Chánh Hưng, Thành phố Hồ Chí Minh, 73009, Việt Nam','Thành phố Hồ Chí Minh',10.74771138,106.66680691),(10,NULL,'Custom Pickup','nguyễn hữu cảnh ','Unknown',NULL,NULL);
/*!40000 ALTER TABLE `transfer_point` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip`
--

DROP TABLE IF EXISTS `trip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `busId` int NOT NULL,
  `driverId` int NOT NULL,
  `routeId` int NOT NULL,
  `departureTime` datetime NOT NULL,
  `arrivalTime` datetime DEFAULT NULL,
  `actualArrivalTime` datetime DEFAULT NULL,
  `fare` double NOT NULL,
  `status` varchar(20) DEFAULT 'Scheduled',
  `availableSeats` int DEFAULT NULL,
  `totalBookedSeats` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `busId` (`busId`),
  KEY `driverId` (`driverId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `trip_ibfk_1` FOREIGN KEY (`busId`) REFERENCES `bus` (`id`),
  CONSTRAINT `trip_ibfk_2` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`),
  CONSTRAINT `trip_ibfk_3` FOREIGN KEY (`routeId`) REFERENCES `route` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip`
--

LOCK TABLES `trip` WRITE;
/*!40000 ALTER TABLE `trip` DISABLE KEYS */;
INSERT INTO `trip` VALUES (1,2,1,2,'2025-07-31 08:00:00','2025-08-01 14:00:00','2025-08-01 13:27:00',360000,'Scheduled',42,3),(4,1,1,2,'2025-07-31 16:38:00','2025-08-01 16:38:00','2025-08-01 16:39:00',20000,'Scheduled',45,0),(17,1,1,1,'2025-11-16 09:00:00','2025-11-16 12:00:00',NULL,400000,'Scheduled',33,12),(18,2,7,2,'2025-11-16 09:00:00','2025-11-16 14:00:00',NULL,50000,'Scheduled',42,3),(19,3,1,4,'2025-12-09 13:18:00','2025-12-09 23:18:00',NULL,20000,'Scheduled',4,41),(20,2,7,3,'2025-09-10 19:18:00','2025-11-10 19:21:00',NULL,1000,'Scheduled',3,37),(33,1,1,1,'2025-09-16 14:00:00','2025-09-16 15:00:00',NULL,100000,'Scheduled',34,0),(34,2,1,10,'2025-09-21 15:00:00','2025-09-21 20:00:00',NULL,100000,'Scheduled',16,0),(35,3,1,2,'2025-09-21 00:00:00','2025-09-21 17:00:00',NULL,1000000,'Scheduled',24,0),(36,3,1,4,'2025-09-21 13:00:00','2025-09-21 23:20:00',NULL,200000,'Scheduled',24,0),(37,1,1,4,'2025-09-21 10:00:00','2025-09-21 23:00:00',NULL,300000,'Scheduled',34,0),(38,1,1,6,'2025-10-21 15:00:00','2025-10-22 15:00:00',NULL,10000,'Scheduled',34,0),(39,2,1,7,'2025-09-21 15:00:00','2025-09-22 23:00:00',NULL,4526300,'Scheduled',16,0),(40,2,1,25,'2025-09-21 15:02:00','2025-09-22 03:02:00',NULL,100000,'Scheduled',16,0),(41,17,1,29,'2025-09-13 12:20:00','2025-09-14 22:20:00',NULL,10000,'Scheduled',40,0),(42,1,1,29,'2025-09-13 23:22:00','2025-09-15 05:52:00',NULL,10000,'Scheduled',34,0),(43,1,1,29,'2025-09-21 00:00:00','2025-09-22 01:50:00',NULL,10000,'Scheduled',34,0),(44,1,1,29,'2025-09-19 05:00:00','2025-09-20 07:00:00',NULL,1000,'Scheduled',34,0),(45,1,1,29,'2025-09-22 15:00:00','2025-09-23 13:00:00',NULL,1000,'Scheduled',34,0),(46,1,1,29,'2025-09-21 01:00:00','2025-09-21 09:00:00',NULL,10000,'Scheduled',34,0),(47,1,1,29,'2025-09-21 01:00:00','2025-09-22 02:10:00',NULL,10000,'Scheduled',34,0),(48,1,1,29,'2025-09-25 10:01:00','2025-09-26 10:00:00',NULL,1000,'Scheduled',34,0),(49,1,1,29,'2025-09-21 09:05:00','2025-09-22 09:05:00',NULL,100000,'Scheduled',34,0),(50,1,1,1,'2025-10-09 11:05:00','2025-10-10 23:05:00',NULL,1000,'Scheduled',34,0),(51,1,1,2,'2025-09-28 01:20:00','2025-09-29 14:20:00',NULL,100000,'Scheduled',34,0);
/*!40000 ALTER TABLE `trip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_transfer`
--

DROP TABLE IF EXISTS `trip_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_transfer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tripId` int NOT NULL,
  `transferPointId` int NOT NULL,
  `arrivalTime` datetime DEFAULT NULL,
  `departureTime` datetime DEFAULT NULL,
  `stopOrder` int DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tripId` (`tripId`),
  KEY `transferPointId` (`transferPointId`),
  CONSTRAINT `trip_transfer_ibfk_1` FOREIGN KEY (`tripId`) REFERENCES `trip` (`id`),
  CONSTRAINT `trip_transfer_ibfk_2` FOREIGN KEY (`transferPointId`) REFERENCES `transfer_point` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_transfer`
--

LOCK TABLES `trip_transfer` WRITE;
/*!40000 ALTER TABLE `trip_transfer` DISABLE KEYS */;
INSERT INTO `trip_transfer` VALUES (5,1,2,'2025-09-06 08:30:00','2025-09-06 08:35:00',2,'Đón khách'),(6,1,3,'2025-09-06 09:00:00','2025-09-06 09:10:00',3,'Đón khách'),(7,1,1,'2025-09-06 08:00:00','2025-09-06 08:15:00',1,'Đón khách'),(8,1,2,'2025-09-06 08:30:00','2025-09-06 08:35:00',2,'Đón khách'),(9,1,3,'2025-09-06 09:00:00','2025-09-06 09:10:00',3,'Đón khách'),(10,1,1,'2025-09-05 17:00:00','2025-09-05 17:15:00',2,'A quick stop for passengs.'),(12,1,1,'2025-09-05 17:00:00','2025-09-05 17:15:00',2,'A quick stop for passengers.'),(13,19,1,NULL,NULL,1,''),(14,17,2,NULL,NULL,1,'Đón khách');
/*!40000 ALTER TABLE `trip_transfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `user_role` varchar(15) NOT NULL DEFAULT 'passenger',
  `isActive` tinyint(1) DEFAULT '1',
  `avatar` varchar(255) DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','admin.bus@example.com','1990-01-01','ROLE_ADMIN',1,NULL,NULL),(2,'driver','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','driver.long@example.com','1985-03-20','ROLE_DRIVER',1,'https://res.cloudinary.com/dwgm5sh35/image/upload/v1757774291/avatars/driver.png',NULL),(6,'driver1','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','driver1.long@example.com','1985-03-20','ROLE_DRIVER',1,NULL,NULL),(24,'passenger','$2a$10$6ZpuOugTlcpnbS7vA1kuAOeYKNkoIpGk.DSgNrqxE6L8m1SlG4EpS','passenger@example.com','2004-01-21','ROLE_PASSENGER',1,'https://res.cloudinary.com/dwgm5sh35/image/upload/v1756825298/avatars/passenger.png',NULL),(25,'manager','$2a$10$IqO1Tl1EHFlA7EwKa2kPle7WyMjX1J5aMehdtfdQFyQA6owQlLJYu','manager.dat@example.com','2004-01-22','ROLE_MANAGER',1,'https://res.cloudinary.com/dwgm5sh35/image/upload/v1757774155/avatars/manager.png',NULL),(26,'staff','$2a$10$IdDO2SZdje5aWgu79oJTKusKSLFU3Evvf6yGfBa8Ge9Ds99Euay76','staff@gmail.com','2004-01-23','ROLE_STAFF',1,NULL,NULL),(27,'driver2','$2a$10$5Psh5qb8oKI845m0oMp1mucRplberGn.GE3yBfUuT7F1vl/ykThJ2','driver.nam@gmail.com','2004-01-24','ROLE_DRIVER',1,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-13 23:37:19
