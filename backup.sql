-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: web_ban_hang
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('02b3378e-f0c8-4365-96a9-4688bd57cbf9','95ab27497c8a43bbf67977e73daa13f7fc460e18e245abfb24309a8dba3ea111','2026-04-15 03:09:41.337','20260415030941_address',NULL,NULL,'2026-04-15 03:09:41.218',1),('08515f4d-79cc-4a2b-a25a-2bf5c5e7541d','bc3d5e0bc5f4fb2218dbf8ee983468f10194f0ec64b94f5c0bbd7be33a2c99f9','2026-05-09 10:08:04.683','20260509100804_modify_coupon',NULL,NULL,'2026-05-09 10:08:04.388',1),('24fa9578-ca74-4fdf-a91c-7fde9d87a043','17a1ac1e445dca2a5179c205a8daf3eee72ceee0bc326ba62b0eb58565a3832e','2026-04-08 04:10:59.537','20260408041059_addtoken',NULL,NULL,'2026-04-08 04:10:59.457',1),('2864d844-6d76-446a-9600-ded61b311012','69ffcbb8f18f48e0a27686b0d1c679f7a6a1e9559aa7d8f05510ee3f4b1ba299','2026-04-08 03:49:31.189','20260408034930_addpassword',NULL,NULL,'2026-04-08 03:49:30.852',1),('343a8b92-6650-4db5-8e31-6ad95c2841de','499ada85352fd262e136a3e89d5727b7152ab1f7f199ee6e4d1f76ccbb8d1a31','2026-05-09 10:12:19.884','20260509101219_modify_coupon',NULL,NULL,'2026-05-09 10:12:19.762',1),('4a844c2f-c462-4ba8-8630-8b18842b53c1','ff87ee20c2a224b62996c09197eeead0c25b3872ac803401f64d6dbc697af9cb','2026-04-27 14:14:59.448','20260427120000_align_existing_schema_drift','',NULL,'2026-04-27 14:14:59.448',0),('6ddf3639-6a72-4a66-a82f-ba2e67b110fd','10e4e008c6d226e805eee41f5b10de5bc6557d5ea6763c6d670b989f486953e9','2026-04-14 09:52:24.911','20260414095224_addavataurl',NULL,NULL,'2026-04-14 09:52:24.709',1),('864befac-957c-4e5e-84b7-79f27b0a8b41','48a393a2ee5b6f199fa52a926cf733f1845baa8d353fb7804a10c26f8aa5a98a','2026-04-08 04:03:18.034','20260408040317_addtoken',NULL,NULL,'2026-04-08 04:03:17.914',1),('8ea1b438-1175-422f-a432-fd6d92a2dc0e','43254b43675af29086caa2056e1933610b711555fe2127364512ba8ee38e347f','2026-04-18 16:15:53.201','20260418161552_addkeyimg',NULL,NULL,'2026-04-18 16:15:52.999',1),('9890cdf6-e85e-4ac6-8bf5-65feff3a56f6','f103a11b90df348ef0ac7b3c5d32845d3aaa8234a17037c3f7191e0b2af1519c','2026-04-27 14:34:52.437','20260427143451_modifycreated',NULL,NULL,'2026-04-27 14:34:51.869',1),('98dfde6c-f293-4ba4-919c-8c70c59aef6e','60f6f340dbda015011545432e5b6200aae499060100b4efa6e45490e023908b9','2026-04-27 14:26:41.871','20260427142640_modify_cart',NULL,NULL,'2026-04-27 14:26:40.899',1),('fb226478-6b71-453c-a26b-5175eb354e37','b40d9f5e40322a5eaacf3bfd33339b96819f0c04673405cac897c0e23cb3c72c','2026-04-07 03:49:34.633','20260407034931_init',NULL,NULL,'2026-04-07 03:49:31.601',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isdefault` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `address_user_id_fkey` (`user_id`),
  CONSTRAINT `address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES ('cmnzshg8t0000nkvcpow4rzwj','cmnqwwyr50000bkvc22xabt9r','','lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội',0,'Quqn Nguyen','214',NULL,NULL,'2026-04-27 21:34:51.876'),('cmo018vgk0002r0vcjf8pix0w','cmnqwwyr50000bkvc22xabt9r','Phường Thanh Xuân','lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội',1,'Quân Nguyễn Đình','0989',NULL,NULL,'2026-04-27 21:34:51.876'),('cmo9vyq1c0003movc6bmp6ykf','cmnqwwyr50000bkvc22xabt9r','','23 342',0,'Quqn Nguyen','tjsd',NULL,NULL,'2026-04-27 21:34:51.876'),('cmoe4cyhj0000ygvckgirfdjw','cmo07gix70004r0vcehvo8lqo','Xã Sơn Động','lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội',1,'Quân Nguyễn Đình','32432','2','Bắc Ninh','2026-04-27 21:34:51.876'),('cmosuqf8t0000qsvc4oq8uoxi','cmo07gix70004r0vcehvo8lqo','Xã Khun Há','lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội',0,'Quân Nguyễn Đình','32432','14','Lai Châu','2026-05-05 16:37:40.398');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_user_id_product_id_key` (`user_id`,`product_id`),
  KEY `cart_items_product_id_fkey` (`product_id`),
  CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cart_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES ('cmor3rfg00002dwvc4zrosmrn','cmob8wkj700022wvcspqcstrw',3,'2026-05-04 11:14:51.504','2026-05-11 15:49:09.068','cmo07gix70004r0vcehvo8lqo'),('cmov2ba520003xovcgsgztsjw','cmo2ery300000bwvcn5df1tuu',2,'2026-05-07 05:45:23.222','2026-05-12 16:16:03.997','cmo07gix70004r0vcehvo8lqo'),('cmp1dn3ff0003i0vck8ld17nu','cmob8vd9p00012wvct3x4nleh',3,'2026-05-11 15:49:07.227','2026-05-11 15:49:19.982','cmo07gix70004r0vcehvo8lqo'),('cmp1dn4kw0004i0vc3me1d15t','cmofn95ez00007kvchpcg18ny',2,'2026-05-11 15:49:08.720','2026-05-11 15:49:16.777','cmo07gix70004r0vcehvo8lqo');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_parent_id_fkey` (`parent_id`),
  CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('clv100001','Điện tử','Các thiết bị công nghệ và điện tử gia dụng',NULL),('clv100002','Thời trang','Quần áo, giày dép và phụ kiện',NULL),('clv100003','Nhà cửa & Đời sống','Nội thất và đồ dùng gia đình',NULL),('clv200001','Điện thoại','Smartphone và điện thoại phổ thông','clv100001'),('clv200002','Laptop','Máy tính xách tay văn phòng và gaming','clv100001'),('clv200004','Thời trang nam','Quần áo dành cho nam giới','clv100002');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` int NOT NULL,
  `max_discount_amount` int DEFAULT NULL,
  `start_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `end_date` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `min_order_amount` int NOT NULL DEFAULT '0',
  `per_user_limit` int NOT NULL DEFAULT '1',
  `updated_at` datetime(3) NOT NULL,
  `usage_limit` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_key` (`code`),
  KEY `coupons_user_id_fkey` (`user_id`),
  CONSTRAINT `coupons_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES ('cmp1c28hw0000i0vce2yvtnzu','SALE10','cmo07gix70004r0vcehvo8lqo','percent',10,50000,'2026-05-11 22:37:26.934','2026-06-11 22:39:09.701','active','2026-05-11 15:04:54.404',100000,1,'2026-05-11 15:04:54.404',100),('cmp1c82y20001i0vcj6udcnfj','GIAM50K','cmo07gix70004r0vcehvo8lqo','fixed_amount',50000,NULL,'2026-05-11 22:37:54.711','2026-06-11 22:39:19.472','active','2026-05-11 15:09:27.146',200000,1,'2026-05-11 15:09:27.146',100);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_at_purchase` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_fkey` (`order_id`),
  KEY `order_items_product_id_fkey` (`product_id`),
  CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES ('cmosusd340001t0vcg7pejomw','cmosusd300000t0vcod9lklbc','cmo13uikz0000n8vc6in89r0f',2198678,2),('cmosusd340002t0vculk6s6hv','cmosusd300000t0vcod9lklbc','cmo101shg0000csvccvn0tfhh',100000,1),('cmosvl0g20001zwvc3upb73e1','cmosvl0670000zwvckrski6wp','cmo2ery300000bwvcn5df1tuu',132,2),('cmosvl0g20002zwvctkh3bbmq','cmosvl0670000zwvckrski6wp','cmob8vd9p00012wvct3x4nleh',1200,3),('cmou5ukoa00022gvcw2u108xp','cmou5uklv00012gvcs4qxj29u','cmo101shg0000csvccvn0tfhh',100000,2),('cmov25r2l0002s4vcty0j9bkf','cmov25r0k0001s4vc6umlakro','cmo13uikz0000n8vc6in89r0f',2198678,1),('cmov25r2l0003s4vcwqehhj9n','cmov25r0k0001s4vc6umlakro','cmofn95ez00007kvchpcg18ny',12333111,2),('cmov2bux40005xovchs3stnnb','cmov2bux10004xovc8zvhxdd9','cmov24pz00000s4vchqewwpyq',23123,4),('cmovnh7q90001xsvczydkhpns','cmovnh7op0000xsvc3d0040pn','cmo101shg0000csvccvn0tfhh',100000,1),('cmovnh7q90002xsvc70gli3si','cmovnh7op0000xsvc3d0040pn','cmo13uikz0000n8vc6in89r0f',2198678,1),('cmovnm0bb0001iwvc21r8tniv','cmovnm0as0000iwvcraykrtl6','cmob8vd9p00012wvct3x4nleh',1200,1),('cmovnnqj00003rsvchylrvklf','cmovnnqix0002rsvcvha4p1g5','cmo13uikz0000n8vc6in89r0f',2198678,1),('cmp2pnhp00001gsvcp423pll7','cmp2pnhno0000gsvcxsbk7xhc','cmo101shg0000csvccvn0tfhh',100000,3),('cmp2u2k0b0003gsvcg42d15ab','cmp2u2k080002gsvcrix7x9g7','cmo13uikz0000n8vc6in89r0f',2198678,1),('cmp2uqv6v0003jcvc0o120mzp','cmp2uqv6s0002jcvcrl1cs69e','cmo101shg0000csvccvn0tfhh',100000,2),('cmp2uuzlh0005jcvc4m88jbbv','cmp2uuzlf0004jcvcd8jmmwsp','cmo13uikz0000n8vc6in89r0f',2198678,1),('cmp2uwq600008jcvcaw9rzjvi','cmp2uwq5x0007jcvcx18qbhzx','cmo101shg0000csvccvn0tfhh',100000,2);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coupon_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_before_discount` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `total_amount` int NOT NULL,
  `shipping_address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `discount_amount` int NOT NULL DEFAULT '0',
  `shipping_fee` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `orders_user_id_fkey` (`user_id`),
  KEY `orders_coupon_id_fkey` (`coupon_id`),
  CONSTRAINT `orders_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('cmosusd300000t0vcod9lklbc','cmo07gix70004r0vcehvo8lqo',NULL,4497356,'pending','unpaid',4497356,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-05 16:39:10.908',0,0),('cmosvl0670000zwvckrski6wp','cmo07gix70004r0vcehvo8lqo',NULL,3864,'pending','unpaid',3864,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-05 17:01:27.199',0,0),('cmou5uklv00012gvcs4qxj29u','cmo07gix70004r0vcehvo8lqo',NULL,200000,'pending','unpaid',200000,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-06 14:36:35.923',0,0),('cmov25r0k0001s4vc6umlakro','cmo07gix70004r0vcehvo8lqo',NULL,26864900,'pending','unpaid',26864900,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-07 05:41:05.156',0,0),('cmov2bux10004xovc8zvhxdd9','cmo07gix70004r0vcehvo8lqo',NULL,92492,'pending','unpaid',92492,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-07 05:45:50.149',0,0),('cmovnh7op0000xsvc3d0040pn','cmo07gix70004r0vcehvo8lqo',NULL,2298678,'pending','unpaid',2298678,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-07 15:37:51.913',0,0),('cmovnm0as0000iwvcraykrtl6','cmo07gix70004r0vcehvo8lqo',NULL,1200,'pending','unpaid',1200,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-07 15:41:35.620',0,0),('cmovnnqix0002rsvcvha4p1g5','cmo07gix70004r0vcehvo8lqo',NULL,2198678,'paid','unpaid',2198678,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-07 15:42:56.265',0,0),('cmp2pnhno0000gsvcxsbk7xhc','cmo07gix70004r0vcehvo8lqo',NULL,300000,'pending','unpaid',322000,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-12 14:13:07.236',0,0),('cmp2u2k080002gsvcrix7x9g7','cmo07gix70004r0vcehvo8lqo',NULL,2198678,'pending','unpaid',2220678,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-12 16:16:48.584',0,0),('cmp2uqv6s0002jcvcrl1cs69e','cmo07gix70004r0vcehvo8lqo',NULL,200000,'pending','unpaid',222000,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-12 16:35:42.820',0,0),('cmp2uuzlf0004jcvcd8jmmwsp','cmo07gix70004r0vcehvo8lqo','cmp1c28hw0000i0vce2yvtnzu',2198678,'pending','unpaid',2170678,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-12 16:38:55.155',0,0),('cmp2uwq5x0007jcvcx18qbhzx','cmo07gix70004r0vcehvo8lqo','cmp1c82y20001i0vcj6udcnfj',200000,'pending','unpaid',172000,'{\"name\":\"Quân Nguyễn Đình\",\"phone_number\":\"32432\",\"address\":\"lk15 ngõ 6,Phan Đình Giót ,Phường La Khê,Quận Hà Đông ,Hà Nội, Xã Sơn Động, Bắc Ninh\"}','2026-05-12 16:40:16.245',0,0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `payments_order_id_fkey` (`order_id`),
  CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_fkey` (`product_id`),
  CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_price` int NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `image_key` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cloudflare_r2',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `products_user_id_fkey` (`user_id`),
  KEY `products_category_id_fkey` (`category_id`),
  CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('cmo101shg0000csvccvn0tfhh','cmo07gix70004r0vcehvo8lqo','clv200001','ip12','đt','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776869087734-ulmqk.jpg',100000,12,'active','products/1776869087734-ulmqk.jpg','cloudflare_r2','2026-04-27 21:34:52.271'),('cmo13uikz0000n8vc6in89r0f','cmo07gix70004r0vcehvo8lqo','clv200002','2','w34eewr','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776766110867-5hafwq.jpg',2198678,49,'active','products/1776766110867-5hafwq.jpg','cloudflare_r2','2026-04-27 21:34:52.271'),('cmo2ery300000bwvcn5df1tuu','cmo07gix70004r0vcehvo8lqo','clv200004','Quân Nguyễn Đình','sdrs','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776713052382-hgzu3h.jpg',132,21,'inactive','products/1776713052382-hgzu3h.jpg','cloudflare_r2','2026-04-27 21:34:52.271'),('cmob8vd9p00012wvct3x4nleh','cmob8u0o000002wvcf231qd90','clv200001','3','test','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776934403666-jh19pm.jfif',1200,19,'active','products/1776934403666-jh19pm.jfif','cloudflare_r2','2026-04-27 21:34:52.271'),('cmob8wkj700022wvcspqcstrw','cmob8u0o000002wvcf231qd90','clv200002','Quqn Nguyen','tessy','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776934464131-fp041.jpg',2321,12,'active','products/1776934464131-fp041.jpg','cloudflare_r2','2026-04-27 21:34:52.271'),('cmofn95ez00007kvchpcg18ny','cmo07gix70004r0vcehvo8lqo','clv200001','ip12','tessfd','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1777200428638-oww71b.jpg',12333111,52,'active','products/1777200428638-oww71b.jpg','cloudflare_r2','2026-04-27 21:34:52.271'),('cmov24pz00000s4vchqewwpyq','cmo07gix70004r0vcehvo8lqo','clv200004','swefrsd','sdfs','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1778132397353-wd3498.png',23123,0,'active','products/1778132397353-wd3498.png','cloudflare_r2','2026-05-07 05:40:17.149'),('cmp2uz1m20009jcvce223s3hl','cmo07gix70004r0vcehvo8lqo','clv200001','Quqn Nguyen','wqewrwe','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1778604115480-nurpy.jpg',100000,34,'active','products/1778604115480-nurpy.jpg','cloudflare_r2','2026-05-12 16:42:04.394'),('cmp2uzgbx000ajcvc4b5iokld','cmo07gix70004r0vcehvo8lqo','clv200002','werew','ewrwe','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776869087734-ulmqk.jpg',1000000,23,'active','','cloudflare_r2','2026-05-12 16:42:23.469'),('cmp2v01qs000bjcvckw4bfaku','cmo07gix70004r0vcehvo8lqo','clv200002','ẻwter','ểtrt','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1778604160759-tcdrre.jpg',200000,56,'active','products/1778604160759-tcdrre.jpg','cloudflare_r2','2026-05-12 16:42:51.220');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refresh_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_key` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmnqa2egu00004cvc16t4ya6c','quan','nano01@gmail.com',NULL,'customer','2026-04-08 16:43:52.638','$2b$10$ctx1oro/MrpGMAyFEM2s6.TL.wi14wzMDg8CiZV.gt0YL3j6QXc4e',NULL,NULL,NULL,NULL,NULL),('cmnqa38me00007svcm2tiawgl','quan1','nano0765@gmail.com',NULL,'customer','2026-04-08 16:44:31.718','$2b$10$C/DooO1MmgsaZcVgbYErOe7A7M5QufY0mXEwmnLI0z0Q0vE6.SlAe',NULL,NULL,NULL,NULL,NULL),('cmnqwwyr50000bkvc22xabt9r','quan123','oanhlonbo@gmail.com','123','USER','2026-04-09 03:23:30.161','$2b$10$7WdK1vjyn5zuIWtxZuJfPeYhqgmm1.pssKUhORMB0C/MhpdV2Ex3W',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbW5xd3d5cjUwMDAwYmt2YzIyeGFidDlyIiwiaWF0IjoxNzc2OTU4MjQxLCJleHAiOjE3Nzc1NjMwNDF9.vBBACyyLD3ugYdbdO-YQ5yJIkz1sj4Pf7pSMDj78DZs','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776791731143-03r6p9.jpg','abc','products/1776791731143-03r6p9.jpg'),('cmo07gbez0003r0vcg8511q2g','quan1231','oanhlonbo1@gmail.com',NULL,'USER','2026-04-15 15:28:24.779','$2b$10$Kx46G5QYkQqPoJkIWcHaU.lt2lFmzLPUwiMuSyPTUPCvsq9vSZ/pS',NULL,NULL,NULL,NULL,NULL),('cmo07gix70004r0vcehvo8lqo','quan12312','oanhlonbo11@gmail.com','123','Shop','2026-04-15 15:28:34.507','$2b$10$lMYXvjPyC6Zfdg6gyNgW3uR/3Vp1MzHy1jcL5f9SXXXbCqavJk8wC',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbW8wN2dpeDcwMDA0cjB2Y2Vodm84bHFvIiwiaWF0IjoxNzc4NjA1NDgxLCJleHAiOjE3NzkyMTAyODF9.AKivPE0j1nQJedR8dhUSWHqNHpxhoH72mdCeIHFVFHo','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1777049273713-zpwg.jfif','shop1','products/1777049273713-zpwg.jfif'),('cmo07gv170005r0vcypcqw821','quan123121','oanhlonbo112@gmail.com',NULL,'Customer','2026-04-15 15:28:50.203','$2b$10$8PqX7iIO/xVZZvtmAkCELuZ7shZC98CjKUOYhOe9/jxap6kphw8D2',NULL,NULL,NULL,NULL,NULL),('cmo6pip7k00002wvcgmjhycd4','123456','oanhlonbo87@gmail.com',NULL,'USER','2026-04-20 04:40:46.112','$2b$10$slECYvs4LfuVV.LoOGxo2eHTgpEPJnBoQgmF9tmykqUdKGKHlRML2',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbW82cGlwN2swMDAwMnd2Y2dtamh5Y2Q0IiwiaWF0IjoxNzc2NjYwMDU0LCJleHAiOjE3NzcyNjQ4NTR9.OTCkEVpeJ4fa8xpKJduzQHbIZvXBQmQnWq0hQoYorco','https://pub-5953de56a03d4237990efcd434fcfbf0.r2.dev/products/1776660060678-lxxblc.jpg',NULL,'products/1776660060678-lxxblc.jpg'),('cmob8u0o000002wvcf231qd90','quan123123','oanhlonbo43@gmail.com',NULL,'Shop','2026-04-23 08:52:31.585','$2b$10$w9YjN1sERePJRMy/uIHWP.V1WoAKVdh2/RhNvpAcC.0Ekx0bcZ/CC',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbW9iOHUwbzAwMDAwMnd2Y2YyMzFxZDkwIiwiaWF0IjoxNzc2OTM0MzY5LCJleHAiOjE3Nzc1MzkxNjl9.B00F1gHc0LvOHZRdE6kQ061C7ezhgEXJG9ybDzoX1VM',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-17 15:06:58
