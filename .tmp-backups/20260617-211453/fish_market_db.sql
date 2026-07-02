-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: fish_market_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `action` longtext,
  `module` longtext,
  `description` longtext,
  `ip_address` longtext,
  `user_agent` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_activity_logs_deleted_at` (`deleted_at`),
  KEY `fk_activity_logs_user` (`user_id`),
  CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,28,'DELETE','INVENTORY','Practice woman drills regularly.','188.187.222.232','Mozilla/5.0 (X11; Linux x86_64; rv:5.0) Gecko/1953-06-18 Firefox/37.0'),(2,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,39,'DELETE','HARVEST','According to the hand, align expectations.','156.91.136.115','Mozilla/5.0 (Windows 95) AppleWebKit/5362 (KHTML, like Gecko) Chrome/38.0.871.0 Mobile Safari/5362'),(3,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,33,'UPDATE','ORDER','Practice world drills regularly.','177.177.20.166','Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_5) AppleWebKit/5362 (KHTML, like Gecko) Chrome/39.0.826.0 Mobile Safari/5362'),(4,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,48,'CREATE','PRODUCT','That person being crowded; I recognise it next.','58.219.69.212','Mozilla/5.0 (Windows NT 6.0) AppleWebKit/5342 (KHTML, like Gecko) Chrome/36.0.855.0 Mobile Safari/5342'),(5,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,26,'DELETE','PRODUCT','Clarify ownership of the company still.','21.150.95.195','Mozilla/5.0 (Windows NT 5.0) AppleWebKit/5331 (KHTML, like Gecko) Chrome/37.0.823.0 Mobile Safari/5331'),(6,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,32,'CREATE','ORDER','Surface risks around the government badly.','248.103.36.6','Opera/9.36 (X11; Linux x86_64; en-US) Presto/2.8.219 Version/12.00'),(7,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,31,'CREATE','POND','Invite review for the point in Arlington.','125.54.39.114','Mozilla/5.0 (Windows NT 5.2; en-US; rv:1.9.1.20) Gecko/2013-07-06 Firefox/35.0'),(8,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,36,'DELETE','INVENTORY','Onward to better number!','96.196.112.54','Opera/8.10 (Windows NT 6.0; en-US) Presto/2.13.325 Version/12.00'),(9,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,32,'CREATE','PRODUCT','Surface risks around the thing far.','250.135.12.234','Mozilla/5.0 (Macintosh; PPC Mac OS X 10_6_9) AppleWebKit/5310 (KHTML, like Gecko) Chrome/36.0.822.0 Mobile Safari/5310'),(10,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,28,'UPDATE','PRODUCT','Systematically improve the way yearly.','167.150.10.42','Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_4 rv:5.0; en-US) AppleWebKit/536.46.4 (KHTML, like Gecko) Version/4.2 Safari/536.46.4'),(11,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,45,'LOGIN','POND','Create a fallback for world.','64.208.184.125','Mozilla/5.0 (Windows NT 5.01; en-US; rv:1.9.2.20) Gecko/1934-05-01 Firefox/36.0'),(12,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,31,'LOGIN','PRODUCT','In spite of this the prior approach, this part have clearer.','179.150.8.34','Opera/9.57 (Windows 95; en-US) Presto/2.9.297 Version/11.00'),(13,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,35,'LOGIN','POND','Defer eye during peak load.','113.54.66.13','Opera/9.55 (Macintosh; PPC Mac OS X 10_6_0; en-US) Presto/2.11.180 Version/12.00'),(14,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,29,'DELETE','HARVEST','Short feedback loops close year inquisitively.','57.97.59.192','Opera/9.97 (X11; Linux x86_64; en-US) Presto/2.12.354 Version/10.00'),(15,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,35,'CREATE','ORDER','Huh! Great progress on year!','114.229.113.63','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8 rv:6.0) Gecko/1904-02-25 Firefox/37.0'),(16,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,32,'LOGIN','PRODUCT','Steady filthy progress in Laredo be visible.','69.122.133.121','Opera/10.19 (Windows NT 6.2; en-US) Presto/2.11.332 Version/10.00'),(17,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,35,'LOGIN','HARVEST','Automate way recovery neatly.','205.181.119.176','Mozilla/5.0 (iPad; CPU OS 8_1_1 like Mac OS X; en-US) AppleWebKit/531.18.4 (KHTML, like Gecko) Version/5.0.5 Mobile/8B120 Safari/6531.18.4'),(18,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,32,'UPDATE','ORDER','Write the one-sentence summary for the part.','251.70.151.215','Opera/8.51 (X11; Linux x86_64; en-US) Presto/2.11.237 Version/13.00'),(19,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,31,'LOGIN','INVENTORY','After 5 iterations, you acknowledge the fact elegantly.','89.47.127.190','Mozilla/5.0 (X11; Linux i686) AppleWebKit/5311 (KHTML, like Gecko) Chrome/36.0.822.0 Mobile Safari/5311'),(20,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,28,'CREATE','ORDER','Systematically improve the thing annually.','246.173.77.201','Mozilla/5.0 (X11; Linux i686) AppleWebKit/5360 (KHTML, like Gecko) Chrome/39.0.805.0 Mobile Safari/5360'),(21,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,30,'DELETE','INVENTORY','Archive stale world responsibly.','169.123.153.13','Opera/10.16 (Macintosh; Intel Mac OS X 10_8_5; en-US) Presto/2.12.316 Version/13.00'),(22,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,35,'LOGIN','HARVEST','Sometimes the hand fly sometimes.','49.72.147.137','Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/532.19.1 (KHTML, like Gecko) Version/4.2 Safari/532.19.1'),(23,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,34,'LOGIN','PRODUCT','Design for failure and graceful number.','133.81.38.81','Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_7_10) AppleWebKit/5362 (KHTML, like Gecko) Chrome/40.0.823.0 Mobile Safari/5362'),(24,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,31,'LOGIN','PRODUCT','Publish a changelog entry for the child.','212.112.31.175','Mozilla/5.0 (iPad; CPU OS 9_2_2 like Mac OS X; en-US) AppleWebKit/535.49.4 (KHTML, like Gecko) Version/5.0.5 Mobile/8B112 Safari/6535.49.4'),(25,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,33,'CREATE','POND','Short feedback loops wait child correctly.','188.88.74.213','Mozilla/5.0 (Windows 98) AppleWebKit/5322 (KHTML, like Gecko) Chrome/38.0.818.0 Mobile Safari/5322'),(26,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,41,'UPDATE','INVENTORY','Optimize day for magnificent clarity.','226.190.44.9','Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_0 rv:4.0; en-US) AppleWebKit/532.43.4 (KHTML, like Gecko) Version/5.2 Safari/532.43.4'),(27,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,28,'LOGIN','HARVEST','Compose company from simple parts.','125.134.169.206','Mozilla/5.0 (Macintosh; PPC Mac OS X 10_9_9 rv:6.0; en-US) AppleWebKit/532.1.8 (KHTML, like Gecko) Version/6.0 Safari/532.1.8'),(28,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,48,'UPDATE','HARVEST','Who dive quickly deceive the woman.','239.10.160.51','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7 rv:7.0; en-US) AppleWebKit/535.27.4 (KHTML, like Gecko) Version/4.2 Safari/535.27.4'),(29,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,42,'CREATE','HARVEST','Guard case with sensible limits.','83.82.230.79','Mozilla/5.0 (Windows NT 5.1) AppleWebKit/5342 (KHTML, like Gecko) Chrome/39.0.834.0 Mobile Safari/5342'),(30,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,38,'LOGIN','PRODUCT','Defaults at ClearStory Data are shape part.','37.181.92.125','Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/534.9.3 (KHTML, like Gecko) Version/6.2 Safari/534.9.3'),(31,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,48,'DELETE','PRODUCT','Guide year with dangerous affordances.','143.173.99.135','Opera/8.12 (X11; Linux x86_64; en-US) Presto/2.9.173 Version/13.00'),(32,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,42,'DELETE','PRODUCT','Automate group recovery boldly.','7.153.176.150','Opera/10.85 (Windows 98; Win 9x 4.90; en-US) Presto/2.9.281 Version/12.00'),(33,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,25,'DELETE','POND','For one thing, document the thing and honour the rest.','160.80.66.69','Opera/10.44 (Windows NT 6.2; en-US) Presto/2.10.307 Version/13.00'),(34,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,43,'UPDATE','POND','Create a fallback for woman.','209.117.97.138','Mozilla/5.0 (Windows CE; en-US; rv:1.9.1.20) Gecko/2010-08-25 Firefox/35.0'),(35,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,42,'DELETE','PRODUCT','Remove first friction from the company.','253.17.199.228','Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_8_4) AppleWebKit/5310 (KHTML, like Gecko) Chrome/39.0.857.0 Mobile Safari/5310'),(36,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,43,'UPDATE','PRODUCT','Durable hand shall worth the mercy.','174.100.3.39','Mozilla/5.0 (Windows NT 6.0) AppleWebKit/5310 (KHTML, like Gecko) Chrome/36.0.881.0 Mobile Safari/5310'),(37,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,44,'DELETE','INVENTORY','Establish a baseline for thing.','135.126.140.251','Opera/10.13 (Macintosh; U; PPC Mac OS X 10_9_2; en-US) Presto/2.9.329 Version/13.00'),(38,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,34,'UPDATE','POND','Decompose week into smaller week.','94.190.24.169','Mozilla/5.0 (Windows 98; Win 9x 4.90; en-US; rv:1.9.2.20) Gecko/2017-03-01 Firefox/36.0'),(39,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,30,'LOGIN','ORDER','Guide number with lonely affordances.','52.20.48.86','Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_7_0 rv:7.0) Gecko/2007-06-16 Firefox/37.0'),(40,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,41,'DELETE','HARVEST','Reduce cognitive load in the time.','32.89.209.167','Mozilla/5.0 (Macintosh; PPC Mac OS X 10_6_10 rv:4.0; en-US) AppleWebKit/533.21.7 (KHTML, like Gecko) Version/6.0 Safari/533.21.7'),(41,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,38,'LOGIN','ORDER','Deliberately refill the thing.','50.133.44.138','Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_3 like Mac OS X; en-US) AppleWebKit/536.29.2 (KHTML, like Gecko) Version/3.0.5 Mobile/8B114 Safari/6536.29.2'),(42,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,47,'CREATE','POND','Accordingly, keep the week simple.','186.151.254.192','Mozilla/5.0 (Windows 98; Win 9x 4.90; en-US; rv:1.9.0.20) Gecko/1943-03-19 Firefox/37.0'),(43,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,32,'UPDATE','POND','Draw a diagram for the number carelessly.','102.163.110.35','Mozilla/5.0 (Windows 95; en-US; rv:1.9.3.20) Gecko/1992-01-16 Firefox/37.0'),(44,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,42,'LOGIN','INVENTORY','Alert on group thresholds yesterday.','218.56.56.166','Mozilla/5.0 (X11; Linux i686) AppleWebKit/5311 (KHTML, like Gecko) Chrome/37.0.847.0 Mobile Safari/5311'),(45,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,35,'LOGIN','PRODUCT','After a while the review, I switch the point.','125.53.40.247','Mozilla/5.0 (iPad; CPU OS 8_1_2 like Mac OS X; en-US) AppleWebKit/531.30.5 (KHTML, like Gecko) Version/3.0.5 Mobile/8B119 Safari/6531.30.5'),(46,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,41,'UPDATE','INVENTORY','As dance quickly weep the life.','83.32.89.255','Mozilla/5.0 (Windows; U; Windows NT 4.0) AppleWebKit/533.11.7 (KHTML, like Gecko) Version/6.2 Safari/533.11.7'),(47,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,36,'LOGIN','POND','Balanced government and group does essential.','92.219.216.118','Mozilla/5.0 (Macintosh; PPC Mac OS X 10_9_0 rv:5.0; en-US) AppleWebKit/534.5.5 (KHTML, like Gecko) Version/4.0 Safari/534.5.5'),(48,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,43,'DELETE','POND','Mind the point, then celebrate!','74.17.218.98','Mozilla/5.0 (Macintosh; PPC Mac OS X 10_8_2) AppleWebKit/5360 (KHTML, like Gecko) Chrome/36.0.883.0 Mobile Safari/5360'),(49,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,48,'CREATE','INVENTORY','Reduce cognitive load in the child.','61.140.158.209','Mozilla/5.0 (X11; Linux x86_64; rv:8.0) Gecko/1981-12-26 Firefox/37.0'),(50,'2026-06-10 00:01:07.086','2026-06-10 00:01:07.086',NULL,33,'DELETE','HARVEST','Alert on week thresholds now.','196.35.33.11','Mozilla/5.0 (Windows; U; Windows NT 5.01) AppleWebKit/534.44.2 (KHTML, like Gecko) Version/6.1 Safari/534.44.2'),(51,'2026-06-10 15:09:17.185','2026-06-10 15:09:17.185',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(52,'2026-06-10 15:10:57.497','2026-06-10 15:10:57.497',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(53,'2026-06-10 15:41:28.977','2026-06-10 15:41:28.977',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(54,'2026-06-10 16:00:02.560','2026-06-10 16:00:02.560',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(55,'2026-06-10 16:08:45.133','2026-06-10 16:08:45.133',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(56,'2026-06-10 16:13:48.809','2026-06-10 16:13:48.809',NULL,26,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(57,'2026-06-10 16:16:34.722','2026-06-10 16:16:34.722',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(58,'2026-06-10 16:17:40.207','2026-06-10 16:17:40.207',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(59,'2026-06-10 16:18:28.027','2026-06-10 16:18:28.027',NULL,26,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(60,'2026-06-10 16:18:56.346','2026-06-10 16:18:56.346',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(61,'2026-06-10 16:20:10.091','2026-06-10 16:20:10.091',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(62,'2026-06-10 16:21:08.628','2026-06-10 16:21:08.628',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(63,'2026-06-10 16:21:59.392','2026-06-10 16:21:59.392',NULL,26,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(64,'2026-06-10 16:25:06.381','2026-06-10 16:25:06.381',NULL,49,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(65,'2026-06-10 16:25:43.411','2026-06-10 16:25:43.411',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(66,'2026-06-10 17:46:07.829','2026-06-10 17:46:07.829',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(67,'2026-06-10 18:00:29.355','2026-06-10 18:00:29.355',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(68,'2026-06-10 18:03:50.025','2026-06-10 18:03:50.025',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(69,'2026-06-10 18:14:33.788','2026-06-10 18:14:33.788',NULL,25,'CREATE','PRODUCT','Membuat produk Ikan Nila Super','172.21.0.1','PostmanRuntime/7.54.0'),(70,'2026-06-10 18:18:05.941','2026-06-10 18:18:05.941',NULL,29,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(71,'2026-06-10 18:37:58.924','2026-06-10 18:37:58.924',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(72,'2026-06-10 18:38:11.712','2026-06-10 18:38:11.712',NULL,25,'DELETE','PRODUCT','Menghapus produk Nila Premium UF','172.21.0.1','PostmanRuntime/7.54.0'),(73,'2026-06-11 14:07:02.773','2026-06-11 14:07:02.773',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(74,'2026-06-11 14:21:10.176','2026-06-11 14:21:10.176',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(75,'2026-06-11 14:21:10.415','2026-06-11 14:21:10.415',NULL,26,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(76,'2026-06-11 14:21:10.618','2026-06-11 14:21:10.618',NULL,50,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(77,'2026-06-11 14:21:11.501','2026-06-11 14:21:11.501',NULL,25,'CREATE','PRODUCT','Membuat produk QA Product 1781187671','172.21.0.1','PostmanRuntime/7.39.1'),(78,'2026-06-11 14:21:11.842','2026-06-11 14:21:11.842',NULL,25,'UPDATE','PRODUCT','Memperbarui produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(79,'2026-06-11 14:21:12.022','2026-06-11 14:21:12.022',NULL,25,'DELETE','PRODUCT','Menghapus produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(80,'2026-06-11 14:21:12.126','2026-06-11 14:21:12.126',NULL,25,'CREATE','POND','Membuat kolam Kolam QA 1781187672','172.21.0.1','PostmanRuntime/7.39.1'),(81,'2026-06-11 14:21:12.705','2026-06-11 14:21:12.705',NULL,26,'CREATE','FISH_BATCH','Membuat batch BTCH-2026-0016','172.21.0.1','PostmanRuntime/7.39.1'),(82,'2026-06-11 14:21:13.108','2026-06-11 14:21:13.108',NULL,26,'CREATE','FEEDING_LOG','Membuat feeding log untuk batch BTCH-2026-0016','172.21.0.1','PostmanRuntime/7.39.1'),(83,'2026-06-11 14:21:13.687','2026-06-11 14:21:13.687',NULL,25,'CREATE','HARVEST','Membuat harvest untuk batch BTCH-2026-0001','172.21.0.1','PostmanRuntime/7.39.1'),(84,'2026-06-11 14:21:15.692','2026-06-11 14:21:15.692',NULL,25,'UPDATE','ORDER','Order INV-2026-000015 completed','172.21.0.1','PostmanRuntime/7.39.1'),(85,'2026-06-11 14:45:50.287','2026-06-11 14:45:50.287',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(86,'2026-06-11 14:45:50.480','2026-06-11 14:45:50.480',NULL,26,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(87,'2026-06-11 14:45:50.702','2026-06-11 14:45:50.702',NULL,51,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(88,'2026-06-11 14:45:51.408','2026-06-11 14:45:51.408',NULL,25,'CREATE','PRODUCT','Membuat produk QA Product 1781189152','172.21.0.1','PostmanRuntime/7.39.1'),(89,'2026-06-11 14:45:51.776','2026-06-11 14:45:51.776',NULL,25,'UPDATE','PRODUCT','Memperbarui produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(90,'2026-06-11 14:45:51.912','2026-06-11 14:45:51.912',NULL,25,'DELETE','PRODUCT','Menghapus produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(91,'2026-06-11 14:45:52.021','2026-06-11 14:45:52.021',NULL,25,'CREATE','POND','Membuat kolam Kolam QA 1781189153','172.21.0.1','PostmanRuntime/7.39.1'),(92,'2026-06-11 14:45:53.327','2026-06-11 14:45:53.327',NULL,25,'CREATE','HARVEST','Membuat harvest untuk batch BTCH-2026-0002','172.21.0.1','PostmanRuntime/7.39.1'),(93,'2026-06-11 14:45:55.230','2026-06-11 14:45:55.230',NULL,25,'UPDATE','ORDER','Order INV-2026-000015 completed','172.21.0.1','PostmanRuntime/7.39.1'),(94,'2026-06-11 15:06:42.569','2026-06-11 15:06:42.569',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(95,'2026-06-11 15:06:42.760','2026-06-11 15:06:42.760',NULL,26,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(96,'2026-06-11 15:06:42.958','2026-06-11 15:06:42.958',NULL,52,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(97,'2026-06-11 15:06:43.718','2026-06-11 15:06:43.718',NULL,25,'CREATE','PRODUCT','Membuat produk QA Product 1781190403','172.21.0.1','PostmanRuntime/7.39.1'),(98,'2026-06-11 15:06:44.066','2026-06-11 15:06:44.066',NULL,25,'UPDATE','PRODUCT','Memperbarui produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(99,'2026-06-11 15:06:44.209','2026-06-11 15:06:44.209',NULL,25,'DELETE','PRODUCT','Menghapus produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(100,'2026-06-11 15:06:44.339','2026-06-11 15:06:44.339',NULL,25,'CREATE','POND','Membuat kolam Kolam QA 1781190404','172.21.0.1','PostmanRuntime/7.39.1'),(101,'2026-06-11 15:06:44.898','2026-06-11 15:06:44.898',NULL,26,'CREATE','FISH_BATCH','Membuat batch BTCH-2026-0017','172.21.0.1','PostmanRuntime/7.39.1'),(102,'2026-06-11 15:06:44.637','2026-06-11 15:06:44.637',NULL,26,'CREATE','FEEDING_LOG','Membuat feeding log untuk batch BTCH-2026-0017','172.21.0.1','PostmanRuntime/7.39.1'),(103,'2026-06-11 15:06:44.245','2026-06-11 15:06:44.245',NULL,25,'CREATE','HARVEST','Membuat harvest untuk batch BTCH-2026-0003','172.21.0.1','PostmanRuntime/7.39.1'),(104,'2026-06-11 15:06:46.172','2026-06-11 15:06:46.172',NULL,25,'UPDATE','ORDER','Order INV-2026-000015 completed','172.21.0.1','PostmanRuntime/7.39.1'),(105,'2026-06-11 15:12:09.563','2026-06-11 15:12:09.563',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(106,'2026-06-11 15:12:09.754','2026-06-11 15:12:09.754',NULL,26,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(107,'2026-06-11 15:12:09.951','2026-06-11 15:12:09.951',NULL,53,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.39.1'),(108,'2026-06-11 15:12:10.715','2026-06-11 15:12:10.715',NULL,25,'CREATE','PRODUCT','Membuat produk QA Product 1781190731','172.21.0.1','PostmanRuntime/7.39.1'),(109,'2026-06-11 15:12:11.033','2026-06-11 15:12:11.033',NULL,25,'UPDATE','PRODUCT','Memperbarui produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(110,'2026-06-11 15:12:11.169','2026-06-11 15:12:11.169',NULL,25,'DELETE','PRODUCT','Menghapus produk QA Product Updated','172.21.0.1','PostmanRuntime/7.39.1'),(111,'2026-06-11 15:12:11.328','2026-06-11 15:12:11.328',NULL,25,'CREATE','POND','Membuat kolam Kolam QA 1781190731','172.21.0.1','PostmanRuntime/7.39.1'),(112,'2026-06-11 15:12:11.898','2026-06-11 15:12:11.898',NULL,26,'CREATE','FISH_BATCH','Membuat batch BTCH-2026-0018','172.21.0.1','PostmanRuntime/7.39.1'),(113,'2026-06-11 15:12:12.282','2026-06-11 15:12:12.282',NULL,26,'CREATE','FEEDING_LOG','Membuat feeding log untuk batch BTCH-2026-0018','172.21.0.1','PostmanRuntime/7.39.1'),(114,'2026-06-11 15:12:12.818','2026-06-11 15:12:12.818',NULL,25,'CREATE','HARVEST','Membuat harvest untuk batch BTCH-2026-0005','172.21.0.1','PostmanRuntime/7.39.1'),(115,'2026-06-11 15:12:14.137','2026-06-11 15:12:14.137',NULL,53,'CREATE','ORDER','Checkout order INV-2026-000016','172.21.0.1','PostmanRuntime/7.39.1'),(116,'2026-06-11 15:12:14.810','2026-06-11 15:12:14.810',NULL,25,'UPDATE','ORDER','Order INV-2026-000016 completed','172.21.0.1','PostmanRuntime/7.39.1'),(117,'2026-06-11 16:49:59.484','2026-06-11 16:49:59.484',NULL,29,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(118,'2026-06-11 16:51:51.760','2026-06-11 16:51:51.760',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','PostmanRuntime/7.54.0'),(119,'2026-06-15 14:05:41.454','2026-06-15 14:05:41.454',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(120,'2026-06-15 21:48:30.530','2026-06-15 21:48:30.530',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(121,'2026-06-15 21:51:37.715','2026-06-15 21:51:37.715',NULL,29,'CREATE','ORDER','Checkout order INV-2026-000017','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(122,'2026-06-15 23:25:55.078','2026-06-15 23:25:55.078',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(123,'2026-06-16 13:13:07.805','2026-06-16 13:13:07.805',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(124,'2026-06-16 16:15:33.192','2026-06-16 16:15:33.192',NULL,29,'UPDATE','PROFILE','Memperbarui data profil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(125,'2026-06-16 16:19:12.634','2026-06-16 16:19:12.634',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(126,'2026-06-16 16:33:13.395','2026-06-16 16:33:13.395',NULL,29,'UPDATE','PROFILE','Memperbarui foto profil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(127,'2026-06-17 00:00:39.596','2026-06-17 00:00:39.596',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(128,'2026-06-17 00:02:47.768','2026-06-17 00:02:47.768',NULL,29,'UPDATE','PROFILE','Memperbarui data profil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(129,'2026-06-17 00:22:55.263','2026-06-17 00:22:55.263',NULL,29,'UPDATE','PROFILE','Memperbarui data profil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(130,'2026-06-17 01:13:53.749','2026-06-17 01:13:53.749',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(131,'2026-06-17 01:14:48.753','2026-06-17 01:14:48.753',NULL,29,'UPDATE','PROFILE','Mengubah kata sandi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(132,'2026-06-17 01:15:07.598','2026-06-17 01:15:07.598',NULL,29,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(133,'2026-06-17 02:25:50.355','2026-06-17 02:25:50.355',NULL,25,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(134,'2026-06-17 14:10:33.017','2026-06-17 14:10:33.017',NULL,25,'LOGIN','AUTH','User login berhasil','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8655'),(135,'2026-06-17 15:39:01.363','2026-06-17 15:39:01.363',NULL,25,'CREATE','PRODUCT','Membuat produk Nila Premium FA','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(136,'2026-06-17 13:41:02.708','2026-06-17 13:41:02.708',NULL,25,'LOGIN','AUTH','User login berhasil','172.21.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),(137,'2026-06-17 13:42:05.279','2026-06-17 13:42:05.279',NULL,29,'LOGIN','AUTH','User login berhasil','172.21.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_carts_deleted_at` (`deleted_at`),
  KEY `fk_carts_product` (`product_id`),
  KEY `fk_carts_user` (`user_id`),
  CONSTRAINT `fk_carts_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'2026-06-11 15:12:13.745','2026-06-11 15:12:13.979','2026-06-11 15:12:14.121',53,40,1),(2,'2026-06-15 16:05:28.291','2026-06-15 16:05:28.291','2026-06-15 21:51:37.694',29,32,1),(3,'2026-06-15 16:06:07.832','2026-06-15 16:06:07.832','2026-06-15 16:24:59.842',29,40,1),(4,'2026-06-15 16:16:58.131','2026-06-15 16:16:58.131','2026-06-15 16:24:54.438',29,39,1),(5,'2026-06-15 16:25:53.465','2026-06-15 16:25:53.465','2026-06-15 21:51:37.694',29,37,1),(6,'2026-06-16 13:48:55.165','2026-06-16 13:58:21.307','2026-06-17 01:42:19.478',29,37,6),(7,'2026-06-17 01:40:57.541','2026-06-17 01:41:03.677','2026-06-17 01:42:19.478',29,40,3),(8,'2026-06-17 01:45:19.207','2026-06-17 01:45:41.808','2026-06-17 01:45:59.307',29,37,2),(9,'2026-06-17 01:45:35.815','2026-06-17 01:45:40.750','2026-06-17 01:45:59.307',29,35,2);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feeding_logs`
--

DROP TABLE IF EXISTS `feeding_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feeding_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `fish_batch_id` bigint unsigned DEFAULT NULL,
  `feed_type` longtext,
  `feed_amount` double DEFAULT NULL,
  `feed_time` datetime(3) DEFAULT NULL,
  `notes` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_feeding_logs_deleted_at` (`deleted_at`),
  KEY `fk_fish_batches_feeding_logs` (`fish_batch_id`),
  CONSTRAINT `fk_fish_batches_feeding_logs` FOREIGN KEY (`fish_batch_id`) REFERENCES `fish_batches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeding_logs`
--

LOCK TABLES `feeding_logs` WRITE;
/*!40000 ALTER TABLE `feeding_logs` DISABLE KEYS */;
INSERT INTO `feeding_logs` VALUES (1,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pelet PF-1000',37,'2026-05-19 06:32:20.639','Finally, they paint justly.'),(2,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pelet PF-1000',37,'2026-04-09 16:07:46.216','Alert on case thresholds tonight.'),(3,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet Apung',43,'2026-08-26 12:27:33.109','Consistent child does the foundation of coldness.'),(4,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet PF-1000',46,'2026-08-03 16:34:06.048','This hand must terrible; he distinguish it next.'),(5,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet PF-1000',21,'2026-08-26 21:19:53.867','Compare week before and after you wash.'),(6,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,11,'Pakan Organik',50,'2026-07-13 21:10:01.784','Before launch, I smell yesterday.'),(7,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,7,'Pelet PF-800',43,'2026-05-26 16:28:22.937','Defer part during peak load.'),(8,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet PF-1000',49,'2026-07-27 19:16:56.955','Weekly, you wake the man with work.'),(9,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pakan Organik',21,'2026-02-13 22:25:37.498','Establish a baseline for work.'),(10,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,8,'Pelet Apung',40,'2026-05-27 07:03:34.426','Few wait when the world spikes.'),(11,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet Apung',39,'2026-05-23 16:08:26.489','Compose week from simple parts.'),(12,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet Apung',21,'2026-07-20 18:01:29.730','Visualize life for faster decisions.'),(13,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet PF-1000',17,'2026-01-27 22:01:19.829','Invite review for the life in Miami.'),(14,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pelet Apung',43,'2026-04-12 20:21:20.570','Whoa! Great progress on eye!'),(15,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pelet PF-800',30,'2026-05-21 03:30:37.840','Outside of the child, align expectations.'),(16,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet Apung',25,'2026-06-15 19:13:09.685','Balance foldable with work.'),(17,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,11,'Pelet Tenggelam',14,'2026-10-29 07:39:45.294','Ruthlessly remove dead woman.'),(18,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pakan Organik',27,'2026-02-05 00:18:20.886','Consistent day do the foundation of company.'),(19,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,6,'Pelet Tenggelam',43,'2026-06-23 01:42:01.603','Most relax when the part spikes.'),(20,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,6,'Pelet PF-800',47,'2026-08-04 01:12:14.562','Guard man with sensible limits.'),(21,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet Tenggelam',26,'2026-09-30 09:00:33.287','After 9 iterations, they refill the government stealthily.'),(22,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,2,'Pelet Tenggelam',33,'2026-04-12 13:25:01.173','Rate-limit thing by default.'),(23,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet Tenggelam',7,'2026-08-25 03:54:22.365','At the blazer, I cut tightly.'),(24,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pakan Organik',37,'2026-06-23 05:26:24.856','Create a fallback for child.'),(25,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,6,'Pelet PF-1000',11,'2026-08-20 22:45:22.375','Compare case before and after you widen.'),(26,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pelet Tenggelam',50,'2026-12-13 11:46:37.285','Budget latency for day.'),(27,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet PF-800',21,'2026-08-04 14:28:05.930','Instrument the work for observability.'),(28,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet PF-800',33,'2026-04-21 19:49:26.728','Defer year during peak load.'),(29,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pakan Organik',8,'2026-07-16 17:27:23.728','Close the loop on the day.'),(30,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pelet Apung',28,'2026-06-03 09:45:48.772','Balanced government and fact are essential.'),(31,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,7,'Pelet PF-1000',33,'2026-06-02 07:52:01.529','Close the loop on the day.'),(32,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,4,'Pelet PF-800',48,'2026-02-17 22:17:17.023','Mind the case, then celebrate!'),(33,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,7,'Pelet Tenggelam',9,'2026-08-29 20:48:54.032','Ruthlessly remove dead way.'),(34,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet Tenggelam',39,'2026-08-23 10:22:25.347','Publish a changelog entry for the day.'),(35,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pelet PF-800',47,'2026-08-22 20:04:21.797','Launch the problem midweek for clarity.'),(36,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pakan Organik',39,'2026-12-18 19:34:40.583','Accordingly, keep the number simple.'),(37,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pelet Tenggelam',49,'2026-08-15 19:52:10.362','Not only, we catch the child.'),(38,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,2,'Pelet PF-800',18,'2026-04-06 09:07:25.232','Eventually, the fact slide eventually.'),(39,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet PF-1000',29,'2026-02-16 18:49:19.293','Budget latency for day.'),(40,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet PF-800',22,'2026-07-24 21:19:23.031','Ouch! Ship the week now!'),(41,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet Tenggelam',39,'2026-06-03 19:51:40.924','Mornings in Austin favor day.'),(42,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pakan Organik',49,'2026-04-27 14:03:13.832','These case does prickling; they persuade it next.'),(43,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet PF-800',40,'2026-07-09 20:45:47.082','Yay! Ship the number now!'),(44,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet Tenggelam',18,'2026-06-15 18:15:35.778','Short feedback loops wash eye wearily.'),(45,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,8,'Pelet PF-800',28,'2026-04-29 02:37:51.507','Sometimes the part shake ever.'),(46,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pakan Organik',28,'2026-08-07 08:04:04.576','Raise contrast where the man hides.'),(47,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,8,'Pelet Tenggelam',26,'2026-03-19 23:17:35.373','Whatever climb quickly warn the part.'),(48,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,11,'Pelet Apung',31,'2026-10-13 18:18:41.320','Surface risks around the part simply.'),(49,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,4,'Pelet PF-800',41,'2026-05-01 11:22:24.059','Hence, keep the hand simple.'),(50,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pelet PF-800',9,'2026-12-13 04:19:23.718','Systematically improve the thing weekly.'),(51,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet PF-800',13,'2026-05-12 20:04:58.142','Otherwise, keep the world simple.'),(52,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pelet PF-1000',24,'2026-05-29 18:03:52.904','Before launch, they play yesterday.'),(53,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pakan Organik',42,'2026-06-09 02:53:47.443','Practice eye drills regularly.'),(54,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pelet Apung',36,'2026-11-01 16:38:48.591','Eek! Ship the way now!'),(55,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet PF-1000',33,'2026-05-10 02:04:43.095','Balanced woman and person have essential.'),(56,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pelet Tenggelam',45,'2026-08-05 16:59:58.999','Decompose place into smaller man.'),(57,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet PF-1000',29,'2026-06-14 02:08:57.098','Rate-limit thing by default.'),(58,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,7,'Pelet PF-800',14,'2026-06-18 18:05:46.824','Quietly harden the person still.'),(59,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet PF-800',43,'2026-07-16 22:56:26.705','As a result of, keep the week simple.'),(60,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet Tenggelam',23,'2026-02-14 02:58:32.680','On the contrary the prior approach, this woman had clearer.'),(61,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,2,'Pelet Tenggelam',16,'2026-04-10 05:22:01.176','Mind the child, then celebrate!'),(62,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,8,'Pelet PF-1000',35,'2026-06-23 14:32:59.236','Mind the life, then celebrate!'),(63,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet PF-1000',19,'2026-08-24 13:18:03.864','Bravo! Great progress on group!'),(64,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pelet PF-1000',47,'2026-06-06 08:38:37.156','Carefully define the koala eventually.'),(65,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,4,'Pelet PF-1000',29,'2026-04-06 20:44:33.889','Throughout the year, align expectations.'),(66,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,8,'Pelet Apung',37,'2026-05-22 08:55:17.036','Visualize work for faster decisions.'),(67,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pakan Organik',9,'2026-05-07 16:38:14.019','Hers part has ready for brilliance.'),(68,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet PF-800',31,'2026-03-07 15:08:04.097','Archive stale point responsibly.'),(69,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet PF-800',6,'2026-08-15 05:28:57.521','Decompose thing into smaller work.'),(70,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet Tenggelam',42,'2026-07-14 22:46:09.646','Share the decision record for the world.'),(71,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,14,'Pelet Tenggelam',14,'2026-04-05 08:19:58.367','Short feedback loops close time rudely.'),(72,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pelet Tenggelam',38,'2026-03-31 22:30:25.767','Launch the company midweek for clarity.'),(73,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pakan Organik',11,'2026-08-23 11:30:47.630','Through, prefer part over fact.'),(74,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet PF-800',45,'2026-07-08 10:20:05.563','Explicitly name the fact before you weep it.'),(75,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet PF-1000',25,'2026-05-27 05:25:55.270','Design for failure and graceful eye.'),(76,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet PF-800',49,'2026-05-06 04:49:43.000','Invite review for the child in St. Louis.'),(77,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pakan Organik',44,'2026-10-07 04:16:24.435','Protect the thing under quizzical load.'),(78,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pelet Apung',13,'2026-03-31 14:50:13.533','Protect the world under itchy load.'),(79,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,10,'Pelet Tenggelam',6,'2026-10-23 09:05:22.595','Weekends reserve time for Fishing and woman.'),(80,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,6,'Pelet PF-800',21,'2026-06-11 06:53:00.070','Attribute gains to group where possible.'),(81,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet PF-1000',8,'2026-09-29 10:14:27.927','Choose nervous defaults.'),(82,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet Tenggelam',18,'2026-07-04 19:06:32.764','Defaults at Navico does shape way.'),(83,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet Tenggelam',7,'2026-03-05 08:40:46.849','Visualize hand for faster decisions.'),(84,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet Apung',37,'2026-06-05 03:05:04.834','Raise contrast where the group hides.'),(85,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet PF-800',49,'2026-04-22 18:23:03.538','Instrument the eye for observability.'),(86,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pelet Apung',24,'2026-04-12 02:15:09.937','Scope the company to fit the moment.'),(87,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pakan Organik',5,'2026-06-20 18:50:49.442','Warm starts beat cold eye.'),(88,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,4,'Pelet PF-800',26,'2026-03-18 14:13:22.306','Compose government from simple parts.'),(89,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,14,'Pelet Apung',34,'2026-06-21 19:32:09.803','Short feedback loops ski woman awkwardly.'),(90,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,5,'Pakan Organik',20,'2026-05-15 05:49:39.623','Close the loop on the company.'),(91,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet PF-1000',45,'2026-06-11 07:57:02.525','Prefer predictable place over surprising place.'),(92,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,8,'Pakan Organik',20,'2026-08-17 05:57:16.157','Weekly, I upgrade the group with year.'),(93,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,3,'Pelet Apung',43,'2026-05-26 01:04:03.999','Consistent life been the foundation of care.'),(94,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,1,'Pelet PF-800',40,'2026-03-09 23:54:20.551','Weekly, you break the point with point.'),(95,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,11,'Pelet PF-800',37,'2026-07-30 13:18:27.884','Quietly harden the man recently.'),(96,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,15,'Pelet PF-1000',24,'2026-04-22 07:35:29.800','Alert on woman thresholds tonight.'),(97,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pelet PF-800',36,'2026-04-19 02:56:41.498','Practice hand drills regularly.'),(98,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,6,'Pelet PF-800',39,'2026-06-14 12:23:47.926','Before launch, she hug yesterday.'),(99,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,9,'Pelet Apung',39,'2026-09-17 11:56:17.625','Alert on thing thresholds tomorrow.'),(100,'2026-06-10 00:01:06.852','2026-06-10 00:01:06.852',NULL,13,'Pelet Apung',46,'2026-05-18 10:03:27.588','Optimize eye for lingering clarity.'),(101,'2026-06-11 14:21:13.077','2026-06-11 14:21:13.456','2026-06-11 14:21:17.533',16,'Pelet PF-2000',30,'2026-08-15 16:00:00.000','Pemberian pakan sore'),(102,'2026-06-11 15:06:45.273','2026-06-11 15:06:44.066','2026-06-11 15:06:48.017',18,'Pelet PF-2000',30,'2026-08-15 16:00:00.000','Pemberian pakan sore'),(103,'2026-06-11 15:12:12.262','2026-06-11 15:12:12.608','2026-06-11 15:12:16.655',19,'Pelet PF-2000',30,'2026-08-15 16:00:00.000','Pemberian pakan sore');
/*!40000 ALTER TABLE `feeding_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fish_batches`
--

DROP TABLE IF EXISTS `fish_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fish_batches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `batch_code` varchar(191) DEFAULT NULL,
  `pond_id` bigint unsigned DEFAULT NULL,
  `fish_type` longtext,
  `seed_count` bigint DEFAULT NULL,
  `current_count` bigint DEFAULT NULL,
  `average_weight` double DEFAULT NULL,
  `start_date` datetime(3) DEFAULT NULL,
  `expected_harvest` datetime(3) DEFAULT NULL,
  `status` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_fish_batches_batch_code` (`batch_code`),
  KEY `idx_fish_batches_deleted_at` (`deleted_at`),
  KEY `fk_fish_batches_pond` (`pond_id`),
  CONSTRAINT `fk_fish_batches_pond` FOREIGN KEY (`pond_id`) REFERENCES `ponds` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fish_batches`
--

LOCK TABLES `fish_batches` WRITE;
/*!40000 ALTER TABLE `fish_batches` DISABLE KEYS */;
INSERT INTO `fish_batches` VALUES (1,'2026-06-10 00:01:05.889','2026-06-11 14:21:13.641',NULL,'BTCH-2026-0001',1,'Nila',2888,300,1.18,'2026-01-14 18:36:52.637','2026-06-28 18:36:52.637','harvested'),(2,'2026-06-10 00:01:05.889','2026-06-11 14:45:53.280',NULL,'BTCH-2026-0002',2,'Lele',2444,300,0.11,'2026-01-25 17:29:25.124','2026-05-28 17:29:25.124','harvested'),(3,'2026-06-10 00:01:05.889','2026-06-11 15:06:44.200',NULL,'BTCH-2026-0003',3,'Gurame',1173,300,0.93,'2026-05-18 07:37:27.045','2026-08-31 07:37:27.045','harvested'),(4,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0004',4,'Patin',772,551,0.86,'2026-02-02 21:20:55.931','2026-06-06 21:20:55.931','harvested'),(5,'2026-06-10 00:01:05.889','2026-06-11 15:12:12.759',NULL,'BTCH-2026-0005',5,'Bawal',2304,300,1.19,'2026-03-03 03:19:05.780','2026-06-16 03:19:05.780','harvested'),(6,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0006',1,'Mujair',1744,1744,0.26,'2026-05-16 04:03:05.317','2026-09-27 04:03:05.317','active'),(7,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0007',2,'Bandeng',1606,1219,0.57,'2026-04-17 23:02:28.004','2026-08-31 23:02:28.004','harvested'),(8,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0008',3,'Kakap',2728,2728,0.81,'2026-03-10 19:28:50.187','2026-08-25 19:28:50.187','active'),(9,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0009',4,'Kerapu',1955,1955,0.56,'2026-05-30 21:14:05.883','2026-10-03 21:14:05.883','active'),(10,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0010',5,'Tongkol',544,544,1.08,'2026-07-16 16:19:31.341','2026-12-21 16:19:31.341','active'),(11,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0011',1,'Nila',2461,2461,0.4,'2026-06-30 15:46:12.080','2026-10-30 15:46:12.080','active'),(12,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0012',2,'Lele',699,476,0.37,'2026-01-11 11:38:17.068','2026-06-22 11:38:17.068','harvested'),(13,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0013',3,'Gurame',1601,1084,0.88,'2026-03-21 17:47:31.886','2026-06-26 17:47:31.886','harvested'),(14,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0014',4,'Patin',2968,2923,0.52,'2026-03-18 13:46:19.313','2026-06-28 13:46:19.313','harvested'),(15,'2026-06-10 00:01:05.889','2026-06-10 00:01:05.889',NULL,'BTCH-2026-0015',5,'Bawal',1314,960,0.6,'2026-04-13 21:18:19.295','2026-07-21 21:18:19.295','harvested'),(16,'2026-06-11 14:21:12.651','2026-06-11 14:21:12.951','2026-06-11 14:21:17.777','BTCH-2026-0016',6,'Nila Premium',1000,980,0.08,'2026-08-01 00:00:00.000','2026-12-10 00:00:00.000','active'),(18,'2026-06-11 15:06:44.880','2026-06-11 15:06:45.133','2026-06-11 15:06:48.227','BTCH-2026-0017',8,'Nila Premium',1000,980,0.08,'2026-08-01 00:00:00.000','2026-12-10 00:00:00.000','active'),(19,'2026-06-11 15:12:11.868','2026-06-11 15:12:12.132','2026-06-11 15:12:16.878','BTCH-2026-0018',9,'Nila Premium',1000,980,0.08,'2026-08-01 00:00:00.000','2026-12-10 00:00:00.000','active');
/*!40000 ALTER TABLE `fish_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `harvests`
--

DROP TABLE IF EXISTS `harvests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `harvests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `fish_batch_id` bigint unsigned DEFAULT NULL,
  `harvest_date` datetime(3) DEFAULT NULL,
  `total_weight` double DEFAULT NULL,
  `fish_count` bigint DEFAULT NULL,
  `average_weight` double DEFAULT NULL,
  `notes` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_harvests_deleted_at` (`deleted_at`),
  KEY `fk_fish_batches_harvests` (`fish_batch_id`),
  CONSTRAINT `fk_fish_batches_harvests` FOREIGN KEY (`fish_batch_id`) REFERENCES `fish_batches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `harvests`
--

LOCK TABLES `harvests` WRITE;
/*!40000 ALTER TABLE `harvests` DISABLE KEYS */;
INSERT INTO `harvests` VALUES (1,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,4,'2026-06-15 01:26:52.629',927,433,2.140877598152425,'Panen batch BTCH-2026-0004'),(2,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,7,'2026-08-04 03:39:20.642',147,1005,0.14626865671641792,'Panen batch BTCH-2026-0007'),(3,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,12,'2026-05-05 06:18:08.635',1120,454,2.4669603524229076,'Panen batch BTCH-2026-0012'),(4,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,13,'2026-06-26 01:16:16.310',332,931,0.35660580021482274,'Panen batch BTCH-2026-0013'),(5,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,14,'2026-06-06 03:11:37.323',581,1722,0.33739837398373984,'Panen batch BTCH-2026-0014'),(6,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,15,'2026-08-02 09:17:27.443',567,785,0.7222929936305732,'Panen batch BTCH-2026-0015'),(7,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,4,'2026-04-28 18:24:43.494',628,662,0.9486404833836858,'Panen batch BTCH-2026-0004'),(8,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,7,'2026-08-14 23:34:34.730',998,1155,0.8640692640692641,'Panen batch BTCH-2026-0007'),(9,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,12,'2026-04-15 08:08:42.498',570,420,1.3571428571428572,'Panen batch BTCH-2026-0012'),(10,'2026-06-10 00:01:06.901','2026-06-10 00:01:06.901',NULL,13,'2026-06-16 03:28:44.276',672,1418,0.47390691114245415,'Panen batch BTCH-2026-0013'),(11,'2026-06-11 14:21:13.596','2026-06-11 14:21:13.596',NULL,1,'2026-12-01 00:00:00.000',120,300,0.4,'Regression harvest'),(12,'2026-06-11 14:45:53.258','2026-06-11 14:45:53.258',NULL,2,'2026-12-01 00:00:00.000',120,300,0.4,'Regression harvest'),(13,'2026-06-11 15:06:44.191','2026-06-11 15:06:44.191',NULL,3,'2026-12-01 00:00:00.000',120,300,0.4,'Regression harvest'),(14,'2026-06-11 15:12:12.734','2026-06-11 15:12:12.734',NULL,5,'2026-12-01 00:00:00.000',120,300,0.4,'Regression harvest');
/*!40000 ALTER TABLE `harvests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventories`
--

DROP TABLE IF EXISTS `inventories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `fish_batch_id` bigint unsigned DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `unit` longtext,
  `status` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_inventories_deleted_at` (`deleted_at`),
  KEY `fk_inventories_product` (`product_id`),
  KEY `fk_inventories_fish_batch` (`fish_batch_id`),
  CONSTRAINT `fk_inventories_fish_batch` FOREIGN KEY (`fish_batch_id`) REFERENCES `fish_batches` (`id`),
  CONSTRAINT `fk_inventories_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventories`
--

LOCK TABLES `inventories` WRITE;
/*!40000 ALTER TABLE `inventories` DISABLE KEYS */;
INSERT INTO `inventories` VALUES (1,'2026-06-10 00:01:06.993','2026-06-11 14:21:13.660',NULL,21,1,315,'kg','available'),(2,'2026-06-10 00:01:06.993','2026-06-11 14:45:53.298',NULL,22,2,354,'kg','available'),(3,'2026-06-10 00:01:06.993','2026-06-11 15:06:44.219',NULL,23,3,191,'kg','available'),(4,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,24,4,158,'kg','available'),(5,'2026-06-10 00:01:06.993','2026-06-11 15:12:12.786',NULL,25,5,500,'kg','available'),(6,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,26,6,166,'kg','available'),(7,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,27,7,158,'kg','available'),(8,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,28,8,339,'kg','available'),(9,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,29,9,419,'kg','available'),(10,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,30,10,127,'kg','available'),(11,'2026-06-10 00:01:06.993','2026-06-11 15:06:44.890',NULL,31,11,310,'kg','available'),(12,'2026-06-10 00:01:06.993','2026-06-15 21:51:37.642',NULL,32,12,214,'kg','available'),(13,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,33,13,384,'kg','available'),(14,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,34,14,232,'kg','available'),(15,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,35,15,473,'kg','available'),(16,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,36,1,490,'kg','available'),(17,'2026-06-10 00:01:06.993','2026-06-15 21:51:37.615',NULL,37,2,259,'kg','available'),(18,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,38,3,181,'kg','available'),(19,'2026-06-10 00:01:06.993','2026-06-10 00:01:06.993',NULL,39,4,133,'kg','available'),(20,'2026-06-10 00:01:06.993','2026-06-11 15:12:14.115',NULL,40,5,375,'kg','available');
/*!40000 ALTER TABLE `inventories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `inventory_id` bigint unsigned DEFAULT NULL,
  `type` longtext,
  `quantity` double DEFAULT NULL,
  `description` longtext,
  `reference` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_inventory_transactions_deleted_at` (`deleted_at`),
  KEY `fk_inventory_transactions_inventory` (`inventory_id`),
  CONSTRAINT `fk_inventory_transactions_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,'2026-06-11 14:21:13.676','2026-06-11 14:21:13.676',NULL,1,'IN',120,'Harvest Result','BTCH-2026-0001'),(2,'2026-06-11 14:21:14.370','2026-06-11 14:21:14.370',NULL,11,'ADJUSTMENT',10,'Regression top up','MANUAL-ADJUSTMENT'),(3,'2026-06-11 14:45:53.314','2026-06-11 14:45:53.314',NULL,2,'IN',120,'Harvest Result','BTCH-2026-0002'),(4,'2026-06-11 14:45:53.975','2026-06-11 14:45:53.975',NULL,11,'ADJUSTMENT',10,'Regression top up','MANUAL-ADJUSTMENT'),(5,'2026-06-11 15:06:44.234','2026-06-11 15:06:44.234',NULL,3,'IN',120,'Harvest Result','BTCH-2026-0003'),(6,'2026-06-11 15:06:44.909','2026-06-11 15:06:44.909',NULL,11,'ADJUSTMENT',10,'Regression top up','MANUAL-ADJUSTMENT'),(7,'2026-06-11 15:12:12.803','2026-06-11 15:12:12.803',NULL,5,'IN',120,'Harvest Result','BTCH-2026-0005'),(8,'2026-06-11 15:12:13.474','2026-06-11 15:12:13.474',NULL,20,'ADJUSTMENT',10,'Regression top up','MANUAL-ADJUSTMENT'),(9,'2026-06-11 15:12:14.117','2026-06-11 15:12:14.117',NULL,20,'OUT',1,'Checkout Order','INV-2026-000016'),(10,'2026-06-15 21:51:37.621','2026-06-15 21:51:37.621',NULL,17,'OUT',1,'Checkout Order','INV-2026-000017'),(11,'2026-06-15 21:51:37.647','2026-06-15 21:51:37.647',NULL,12,'OUT',1,'Checkout Order','INV-2026-000017');
/*!40000 ALTER TABLE `inventory_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `title` longtext,
  `message` longtext,
  `type` longtext,
  `reference_type` longtext,
  `reference_id` bigint unsigned DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_deleted_at` (`deleted_at`),
  KEY `fk_notifications_user` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,28,'Harvest','Guide company with dizzying affordances.','HARVEST','HARVEST',18,1),(2,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,31,'Order','Warm starts beat cold place.','ORDER','ORDER',13,0),(3,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,26,'Order','At the shrimp, you talk enthusiastically.','ORDER','ORDER',9,1),(4,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,43,'Batch','Evenings in New York City invite quieter year.','BATCH','BATCH',19,1),(5,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,40,'Inventory','Raise contrast where the world hides.','INVENTORY','INVENTORY',14,1),(6,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,34,'Batch','Design for failure and graceful group.','BATCH','BATCH',20,1),(7,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,38,'Order','Draw a diagram for the fact thoughtfully.','ORDER','ORDER',1,0),(8,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,40,'Order','Mind the number, then celebrate!','ORDER','ORDER',18,1),(9,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,36,'Inventory','The awareness had be impromptu somewhat.','INVENTORY','INVENTORY',18,1),(10,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,40,'Order','Clear world are better than clever person.','ORDER','ORDER',12,0),(11,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,43,'Inventory','Automate child recovery nervously.','INVENTORY','INVENTORY',9,1),(12,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,37,'Order','Anyway, we understimate the work.','ORDER','ORDER',2,0),(13,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,44,'Inventory','Eventually, the government pounce thoughtfully.','INVENTORY','INVENTORY',16,1),(14,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,46,'Inventory','Yours person did ready for patience.','INVENTORY','INVENTORY',14,0),(15,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,42,'Inventory','Sometimes the government whirl often.','INVENTORY','INVENTORY',13,0),(16,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,30,'Harvest','The hand had sleepy.','HARVEST','HARVEST',5,1),(17,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,43,'Harvest','They sleep noisily to stabilize the government.','HARVEST','HARVEST',11,1),(18,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,31,'Batch','Publish a changelog entry for the woman.','BATCH','BATCH',8,0),(19,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,46,'Batch','Publish a changelog entry for the government.','BATCH','BATCH',6,1),(20,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,39,'Harvest','Explicitly name the way before you mock it.','HARVEST','HARVEST',9,1),(21,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,37,'Harvest','Explicitly name the day before you pierce it.','HARVEST','HARVEST',4,0),(22,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,31,'Order','They sing irritably to stabilize the woman.','ORDER','ORDER',5,1),(23,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,36,'Inventory','Such gallop when the problem spikes.','INVENTORY','INVENTORY',7,1),(24,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,36,'Batch','Subtle SlateGray accents will effective hardly.','BATCH','BATCH',14,1),(25,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,30,'Harvest','Guard number with sensible limits.','HARVEST','HARVEST',4,0),(26,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,29,'Order','Draw a diagram for the point patiently.','ORDER','ORDER',3,0),(27,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,33,'Order','Share the decision record for the case.','ORDER','ORDER',20,1),(28,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,25,'Batch','Create a fallback for group.','BATCH','BATCH',20,0),(29,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,26,'Inventory','Whomever kiss quickly murder the work.','INVENTORY','INVENTORY',14,0),(30,'2026-06-10 00:01:07.041','2026-06-10 00:01:07.041',NULL,46,'Harvest','Establish a baseline for group.','HARVEST','HARVEST',7,1),(31,'2026-06-11 14:21:13.701','2026-06-11 14:21:13.701',NULL,25,'Harvest Completed','Batch BTCH-2026-0001 berhasil dipanen.','HARVEST','FISH_BATCH',1,0),(32,'2026-06-11 14:45:53.337','2026-06-11 14:45:53.337',NULL,25,'Harvest Completed','Batch BTCH-2026-0002 berhasil dipanen.','HARVEST','FISH_BATCH',2,0),(33,'2026-06-11 15:06:44.254','2026-06-11 15:06:44.254',NULL,25,'Harvest Completed','Batch BTCH-2026-0003 berhasil dipanen.','HARVEST','FISH_BATCH',3,0),(34,'2026-06-11 15:12:12.833','2026-06-11 15:12:12.833',NULL,25,'Harvest Completed','Batch BTCH-2026-0005 berhasil dipanen.','HARVEST','FISH_BATCH',5,0),(35,'2026-06-11 15:12:14.155','2026-06-11 15:12:15.194','2026-06-11 15:12:16.784',53,'Order Created','Order INV-2026-000016 berhasil dibuat.','ORDER','ORDER',0,1),(36,'2026-06-15 21:51:37.738','2026-06-15 21:51:37.738',NULL,29,'Order Created','Order INV-2026-000017 berhasil dibuat.','ORDER','ORDER',0,0);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  `price` double DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_deleted_at` (`deleted_at`),
  KEY `fk_order_items_product` (`product_id`),
  KEY `fk_orders_order_items` (`order_id`),
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_orders_order_items` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,1,39,1,67433,67433),(2,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,2,29,3,33380,100140),(3,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,2,24,3,104585,313755),(4,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,3,23,1,109503,109503),(5,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,3,40,2,72677,145354),(6,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,4,32,5,61986,309930),(7,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,4,24,2,104585,209170),(8,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,5,22,4,101996,407984),(9,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,5,40,2,72677,145354),(10,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,6,23,4,109503,438012),(11,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,7,27,5,88633,443165),(12,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,7,21,4,56508,226032),(13,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,7,32,4,61986,247944),(14,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,8,31,5,36527,182635),(15,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,9,22,2,101996,203992),(16,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,9,32,2,61986,123972),(17,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,10,30,1,66167,66167),(18,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,10,26,1,90999,90999),(19,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,10,31,4,36527,146108),(20,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,11,36,4,49155,196620),(21,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,12,38,2,101799,203598),(22,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,12,21,4,56508,226032),(23,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,12,29,1,33380,33380),(24,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,13,30,1,66167,66167),(25,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,13,38,5,101799,508995),(26,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,13,32,5,61986,309930),(27,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,14,31,5,36527,182635),(28,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,14,35,1,48854,48854),(29,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,14,29,3,33380,100140),(30,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,15,21,3,56508,169524),(31,'2026-06-10 00:01:08.505','2026-06-10 00:01:08.505',NULL,15,22,5,101996,509980),(32,'2026-06-11 15:12:14.120','2026-06-11 15:12:14.120',NULL,16,40,1,72677,72677),(33,'2026-06-15 21:51:37.689','2026-06-15 21:51:37.689',NULL,17,37,1,68387,68387),(34,'2026-06-15 21:51:37.689','2026-06-15 21:51:37.689',NULL,17,32,1,61986,61986);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `invoice_number` longtext,
  `total_price` double DEFAULT NULL,
  `status` longtext,
  `payment_status` longtext,
  `shipping_address` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_orders_deleted_at` (`deleted_at`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-06-10 00:01:07.180','2026-06-10 00:01:07.182',NULL,29,'INV-2026-000001',67433,'completed','paid','23697 Keyborough, Tampa, South Carolina 41612'),(2,'2026-06-10 00:01:07.231','2026-06-10 00:01:07.276',NULL,30,'INV-2026-000002',413895,'completed','unpaid','40421 South Drivemouth, San Bernardino, Massachusetts 64696'),(3,'2026-06-10 00:01:07.321','2026-06-10 00:01:07.366',NULL,31,'INV-2026-000003',254857,'completed','paid','18385 Drivebury, Madison, Alaska 34680'),(4,'2026-06-10 00:01:07.412','2026-06-10 00:01:07.457',NULL,32,'INV-2026-000004',519100,'processing','unpaid','288 Lake Villageport, Stockton, Utah 98227'),(5,'2026-06-10 00:01:07.503','2026-06-10 00:01:07.549',NULL,33,'INV-2026-000005',553338,'pending','paid','4113 Parkmouth, Chula Vista, Ohio 16709'),(6,'2026-06-10 00:01:07.594','2026-06-10 00:01:07.640',NULL,34,'INV-2026-000006',438012,'cancelled','unpaid','115 West Knollhaven, Ph 690, St. Paul, Maine 24726'),(7,'2026-06-10 00:01:07.685','2026-06-10 00:01:07.730',NULL,35,'INV-2026-000007',917141,'completed','paid','4115 Forgesbury, Office 583, Las Vegas, New Mexico 12904'),(8,'2026-06-10 00:01:07.776','2026-06-10 00:01:07.821',NULL,36,'INV-2026-000008',182635,'cancelled','unpaid','56115 Keysmouth, Chula Vista, Wisconsin 32951'),(9,'2026-06-10 00:01:07.867','2026-06-10 00:01:07.915',NULL,37,'INV-2026-000009',327964,'completed','paid','4302 Shoreburgh, Fort Wayne, Connecticut 28375'),(10,'2026-06-10 00:01:07.959','2026-06-10 00:01:08.004',NULL,38,'INV-2026-000010',303274,'completed','unpaid','8336 Plazaville, Oklahoma, Oregon 60806'),(11,'2026-06-10 00:01:08.050','2026-06-10 00:01:08.097',NULL,39,'INV-2026-000011',196620,'completed','paid','66448 Hollowside, Buffalo, Kansas 41662'),(12,'2026-06-10 00:01:08.142','2026-06-10 00:01:08.186',NULL,40,'INV-2026-000012',463010,'completed','unpaid','40402 West Squaresshire, Chesapeake, Indiana 45681'),(13,'2026-06-10 00:01:08.233','2026-06-10 00:01:08.278',NULL,41,'INV-2026-000013',885092,'completed','unpaid','29926 East Prairieburgh, Ste 605, Charlotte, Montana 97571'),(14,'2026-06-10 00:01:08.324','2026-06-10 00:01:08.368',NULL,42,'INV-2026-000014',331629,'completed','unpaid','8400 North Gardenville, Long Beach, Nebraska 35381'),(15,'2026-06-10 00:01:08.412','2026-06-11 15:06:46.151',NULL,43,'INV-2026-000015',679504,'completed','paid','2616 North Riverstad, Seattle, Alaska 11178'),(16,'2026-06-11 15:12:14.119','2026-06-11 15:12:14.793',NULL,53,'INV-2026-000016',72677,'completed','paid','Jl. QA Regression No. 1'),(17,'2026-06-15 21:51:37.654','2026-06-15 21:51:37.654',NULL,29,'INV-2026-000017',130373,'pending','unpaid','Leann Johnston, 085723702957, margalaksana indramayu, Indramayu 425211, Metode pembayaran: cod');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ponds`
--

DROP TABLE IF EXISTS `ponds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ponds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext NOT NULL,
  `location` longtext,
  `capacity` bigint DEFAULT NULL,
  `area` double DEFAULT NULL,
  `water_type` longtext,
  `status` varchar(191) DEFAULT 'active',
  `description` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_ponds_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ponds`
--

LOCK TABLES `ponds` WRITE;
/*!40000 ALTER TABLE `ponds` DISABLE KEYS */;
INSERT INTO `ponds` VALUES (1,'2026-06-10 00:01:05.840','2026-06-10 00:01:05.840',NULL,'Kolam A','Blok A',1943,194,'freshwater','active','Kolam budidaya untuk pembesaran ikan.'),(2,'2026-06-10 00:01:05.840','2026-06-10 00:01:05.840',NULL,'Kolam B','Blok B',5734,50,'brackish','active','Kolam budidaya untuk pembesaran ikan.'),(3,'2026-06-10 00:01:05.840','2026-06-10 00:01:05.840',NULL,'Kolam C','Blok C',1530,240,'freshwater','active','Kolam budidaya untuk pembesaran ikan.'),(4,'2026-06-10 00:01:05.840','2026-06-10 00:01:05.840',NULL,'Kolam D','Blok D',7127,205,'brackish','active','Kolam budidaya untuk pembesaran ikan.'),(5,'2026-06-10 00:01:05.840','2026-06-10 00:01:05.840',NULL,'Kolam E','Blok E',7832,56,'freshwater','active','Kolam budidaya untuk pembesaran ikan.'),(6,'2026-06-11 14:21:12.112','2026-06-11 14:21:12.380','2026-06-11 14:21:17.915','Kolam QA Update','Zona Tes Barat',3200,85,'freshwater','active','Kolam update regression'),(7,'2026-06-11 14:45:52.014','2026-06-11 14:45:52.313','2026-06-11 14:45:57.332','Kolam QA Update','Zona Tes Barat',3200,85,'freshwater','active','Kolam update regression'),(8,'2026-06-11 15:06:44.321','2026-06-11 15:06:44.649','2026-06-11 15:06:48.340','Kolam QA Update','Zona Tes Barat',3200,85,'freshwater','active','Kolam update regression'),(9,'2026-06-11 15:12:11.308','2026-06-11 15:12:11.653','2026-06-11 15:12:16.978','Kolam QA Update','Zona Tes Barat',3200,85,'freshwater','active','Kolam update regression');
/*!40000 ALTER TABLE `ponds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext NOT NULL,
  `description` text,
  `price` double NOT NULL,
  `stock` bigint DEFAULT '0',
  `category` longtext,
  `image_url` longtext,
  `status` varchar(191) DEFAULT 'available',
  `fish_batch_id` bigint unsigned DEFAULT NULL,
  `weight` double DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_products_deleted_at` (`deleted_at`),
  KEY `fk_products_fish_batch` (`fish_batch_id`),
  CONSTRAINT `fk_products_fish_batch` FOREIGN KEY (`fish_batch_id`) REFERENCES `fish_batches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (21,'2026-06-10 00:01:05.790','2026-06-10 00:01:05.935',NULL,'Nila Premium CC','Produk ikan segar Nila berkualitas tinggi.',56508,57,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Nila','active',1,0),(22,'2026-06-10 00:01:05.790','2026-06-10 00:01:05.943',NULL,'Lele Premium TY','Produk ikan segar Lele berkualitas tinggi.',101996,24,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Lele','active',2,0),(23,'2026-06-10 00:01:05.790','2026-06-10 00:01:05.989',NULL,'Gurame Premium JB','Produk ikan segar Gurame berkualitas tinggi.',109503,173,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Gurame','active',3,0),(24,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.034',NULL,'Patin Premium CB','Produk ikan segar Patin berkualitas tinggi.',104585,46,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Patin','active',4,0),(25,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.079',NULL,'Bawal Premium TX','Produk ikan segar Bawal berkualitas tinggi.',69597,82,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Bawal','active',5,0),(26,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.126',NULL,'Mujair Premium NU','Produk ikan segar Mujair berkualitas tinggi.',90999,188,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Mujair','active',6,0),(27,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.170',NULL,'Bandeng Premium RH','Produk ikan segar Bandeng berkualitas tinggi.',88633,73,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Bandeng','active',7,0),(28,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.215',NULL,'Kakap Premium XB','Produk ikan segar Kakap berkualitas tinggi.',51344,164,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Kakap','active',8,0),(29,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.260',NULL,'Kerapu Premium SZ','Produk ikan segar Kerapu berkualitas tinggi.',33380,48,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Kerapu','active',9,0),(30,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.308',NULL,'Tongkol Premium CM','Produk ikan segar Tongkol berkualitas tinggi.',66167,30,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Tongkol','active',10,0),(31,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.352','2026-06-10 18:38:11.705','Nila Premium UF','Produk ikan segar Nila berkualitas tinggi.',36527,73,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Nila','active',11,0),(32,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.397',NULL,'Lele Premium ZB','Produk ikan segar Lele berkualitas tinggi.',61986,91,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Lele','active',12,0),(33,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.443',NULL,'Gurame Premium KG','Produk ikan segar Gurame berkualitas tinggi.',29836,77,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Gurame','active',13,0),(34,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.488',NULL,'Patin Premium FK','Produk ikan segar Patin berkualitas tinggi.',92300,16,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Patin','active',14,0),(35,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.534',NULL,'Bawal Premium RB','Produk ikan segar Bawal berkualitas tinggi.',48854,110,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Bawal','active',15,0),(36,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.579',NULL,'Mujair Premium GY','Produk ikan segar Mujair berkualitas tinggi.',49155,96,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Mujair','active',1,0),(37,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.624',NULL,'Bandeng Premium CF','Produk ikan segar Bandeng berkualitas tinggi.',68387,142,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Bandeng','active',2,0),(38,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.669',NULL,'Kakap Premium SI','Produk ikan segar Kakap berkualitas tinggi.',101799,73,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Kakap','active',3,0),(39,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.715',NULL,'Kerapu Premium XI','Produk ikan segar Kerapu berkualitas tinggi.',67433,28,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Kerapu','active',4,0),(40,'2026-06-10 00:01:05.790','2026-06-10 00:01:06.760',NULL,'Tongkol Premium VA','Produk ikan segar Tongkol berkualitas tinggi.',72677,56,'ikan konsumsi','https://dummyimage.com/600x400/0ea5e9/ffffff&text=Tongkol','active',5,0),(48,'2026-06-10 18:14:33.779','2026-06-10 18:14:33.779',NULL,'Ikan Nila Super','Ikan segar',35000,10,'air_tawar','/uploads/products/870bf361-507b-4457-b6d3-8cf0a49c1d6c.jpg','active',NULL,0),(49,'2026-06-11 14:21:11.476','2026-06-11 14:21:11.816','2026-06-11 14:21:11.968','QA Product Updated','Updated regression product',47000,30,'Ikan Air Tawar','/uploads/products/586fd1f5-4aef-4c2c-a8b1-89a09b80afc4.svg','active',NULL,0),(50,'2026-06-11 14:45:51.389','2026-06-11 14:45:51.743','2026-06-11 14:45:51.903','QA Product Updated','Updated regression product',47000,30,'Ikan Air Tawar','/uploads/products/9d83c60b-eaa0-413e-8ebe-57ba0613b432.svg','active',NULL,0),(51,'2026-06-11 15:06:43.688','2026-06-11 15:06:44.046','2026-06-11 15:06:44.191','QA Product Updated','Updated regression product',47000,30,'Ikan Air Tawar','/uploads/products/e96d147e-8423-4435-bc38-a3fd8afe80cf.svg','active',NULL,0),(52,'2026-06-11 15:12:10.703','2026-06-11 15:12:11.011','2026-06-11 15:12:11.146','QA Product Updated','Updated regression product',47000,30,'Ikan Air Tawar','/uploads/products/7d873b08-85ae-42ab-8d7d-3e74259173dc.svg','active',NULL,0),(53,'2026-06-17 15:39:01.306','2026-06-17 15:39:01.306',NULL,'Nila Premium FA','Ikan Nila dengan kualitas terbaik',20000,300,'Nila','/uploads/products/876741e5-0186-45b3-be16-06633e1aeba9.jpg','active',NULL,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` longtext NOT NULL,
  `role` varchar(191) DEFAULT 'customer',
  `phone` longtext,
  `address` longtext,
  `photo_url` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_users_email` (`email`),
  KEY `idx_users_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (25,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Admin Fish Market','admin@fishmarket.com','$2a$10$BQZZB9zbueQG641gM7f0uuCdW8IDQkA5rQqELfajW.iuPIWrY1yIe','admin',NULL,NULL,NULL),(26,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Staff 1','staff1@fishmarket.com','$2a$10$EJpsi8XtugxaPNjsUufS8.XOsMY5q8iwb3rn8lybqeSANT3no7fU2','staff',NULL,NULL,NULL),(27,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Staff 2','staff2@fishmarket.com','$2a$10$crDpY.JR4jXh9Ob1FyEtq.bQJfVuI1UNaJxSs1/hPH0MAUGZ7UtNC','staff',NULL,NULL,NULL),(28,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Staff 3','staff3@fishmarket.com','$2a$10$ir0HJ2vy9g.vlmP2VZMRguPjo/X1K7kJpGuM1M/eBpt/KUDoGr/re','staff',NULL,NULL,NULL),(29,'2026-06-10 00:01:05.742','2026-06-17 01:14:48.693',NULL,'Joseph','customer1@fishmarket.com','$2a$10$LUPyDWYrluiLD8eLW087YuJiJSGQCCh7VqqFbgC9rN.BYQvcgGfEG','customer','085723702957','JL. Pegangsaan Dua, Kelapa Gading, Jakarta Utara','/uploads/profile/customer_29_1781602393.jpeg'),(30,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Luna James','customer2@fishmarket.com','$2a$10$vl3qIEeyn.958UXdrb4Fd.9i/GaANDNv.p9uoyzPtEvMSjvS4SDbO','customer',NULL,NULL,NULL),(31,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Hallie Ellis','customer3@fishmarket.com','$2a$10$mBrBvE.4ehoEEmeUs1s5k.vICY/CvRv3jthy5XO58McS/gWqAmwLq','customer',NULL,NULL,NULL),(32,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Gillian Gregory','customer4@fishmarket.com','$2a$10$DkR2Uu7ZOtC7paA4o582zeYJic5vks8gCbTMPhZu1uHjZnCd7ru66','customer',NULL,NULL,NULL),(33,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Aaliyah Bernhard','customer5@fishmarket.com','$2a$10$6sCy/yFqQ9SprEq0XDZjHeYaybCWjJCdGuamc/pg2MvYjO8k9JoUS','customer',NULL,NULL,NULL),(34,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Camille Nolan','customer6@fishmarket.com','$2a$10$UColswFDJTt0uG1RspS9eeBABKTmTOF9MoA.I2FTJFo5tqnwSaOBS','customer',NULL,NULL,NULL),(35,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Krystal Schmitt','customer7@fishmarket.com','$2a$10$kKyEkUnhMN0K7qREV9C1deQwEnmg2.WMyey0OonfBB2ZHP565IzEu','customer',NULL,NULL,NULL),(36,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Aniya Wolf','customer8@fishmarket.com','$2a$10$ejBUPJGXAXcFweUvxBx8.ey6q/CfIfR6yfxdbP9WrQR0K45yEoBBW','customer',NULL,NULL,NULL),(37,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Augustus Mitchell','customer9@fishmarket.com','$2a$10$/0ztDtToTPqatcDlsS2dSOl7x9sBdHSjgLZIobFVomoh2lonqnjrG','customer',NULL,NULL,NULL),(38,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Logan Crawford','customer10@fishmarket.com','$2a$10$JiZWJX9rzoqV.F6TvUxIYe1dtBfJDIPqTWoTBCRSleuxQqOz4Qm9q','customer',NULL,NULL,NULL),(39,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Brooks Ingram','customer11@fishmarket.com','$2a$10$8zTZI48l1A88qY1JU7fcF.k5pQRbx68ipxoG68q5adno8Xd6aiZB.','customer',NULL,NULL,NULL),(40,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Carmella Phillips','customer12@fishmarket.com','$2a$10$kSKk4ufqv2rGXaHqWjrBZeiyp.LHFKBP0o1fFj8P3n0.6apbLCR7i','customer',NULL,NULL,NULL),(41,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Clifton Tran','customer13@fishmarket.com','$2a$10$Ylm6zSfz2rTpbbOLH6muP.l7EScf6eofdtzPxgmMziI9YB7uVE2iK','customer',NULL,NULL,NULL),(42,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Will Boyer','customer14@fishmarket.com','$2a$10$ORI/.AoaRY..i7ukCX6MceN6ZTEt4PMe5MxYcYjp8ToUhB5.mzPAy','customer',NULL,NULL,NULL),(43,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Marty Henderson','customer15@fishmarket.com','$2a$10$/fYr1EGHkAxQnSNYuJZutOKGKQ8nbvkXXRawb4xlXNe2XvNwruLUy','customer',NULL,NULL,NULL),(44,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Leif Ortiz','customer16@fishmarket.com','$2a$10$Qkhb5SQwCRT83pmeBQcSbOuREbtq0b39RBlcZ5aNfDqqrz0UHLM9m','customer',NULL,NULL,NULL),(45,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Easton Lopez','customer17@fishmarket.com','$2a$10$aqtp89s4UYp84pwjaOVIW.7lcs.q8zmibSQkCAN9cngJsOt38dXJ6','customer',NULL,NULL,NULL),(46,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Pearl Jacobs','customer18@fishmarket.com','$2a$10$0BqbhAG/GQkMGULOoAFmAutwJhBe7fW2ZZsPWhTBwPnsi46Xn/Oda','customer',NULL,NULL,NULL),(47,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Guido Wilkins','customer19@fishmarket.com','$2a$10$8YRBI8pWv0YVzQYjQBDire540DpAIOnfE2CXal3Y65mbLdHAxwui.','customer',NULL,NULL,NULL),(48,'2026-06-10 00:01:05.742','2026-06-10 00:01:05.742',NULL,'Madison Bergstrom','customer20@fishmarket.com','$2a$10$xFiiCnLzBxezV06xJx4GC.hl6.CcS4r.QWIlHlRdYmkNQInvh1m4u','customer',NULL,NULL,NULL),(49,'2026-06-10 14:41:31.692','2026-06-10 14:41:31.692',NULL,'Customer Test','customer1@example.com','$2a$10$4FKxmrAw3Xp2/LRQ9k5zW.AWVf6yFGqnUZwk9.3NX5y8yy/nyIST6','customer',NULL,NULL,NULL),(50,'2026-06-11 14:21:09.988','2026-06-11 14:21:09.988',NULL,'QA Customer','qa.customer+1781187669848@example.com','$2a$10$YwAOHB3WClmzva6M4q3Mp.kiPNZwmm5aKK.BROJ3laHNoxfXbKbZa','customer',NULL,NULL,NULL),(51,'2026-06-11 14:45:50.087','2026-06-11 14:45:50.087',NULL,'QA Customer','qa.customer+1781189150879@example.com','$2a$10$Xz1Vaw8hKrU4sqw.xVNt7e8ghjXQx/l9GLWyc3q4ejK.b1TBJvG9q','customer',NULL,NULL,NULL),(52,'2026-06-11 15:06:42.373','2026-06-11 15:06:42.373',NULL,'QA Customer','qa.customer+1781190401742@example.com','$2a$10$pPuUtnUhhI4QvgZwbRV23O9FQP/2tHJ1I9FsKVg8BFp3IRm/.pgl6','customer',NULL,NULL,NULL),(53,'2026-06-11 15:12:09.379','2026-06-11 15:12:09.379',NULL,'QA Customer','qa.customer+1781190729469@example.com','$2a$10$Xb9tjRIv6xXZPy5v4YqJieX/xTRbYmx4UekDhCLrlAR6sIAmyBloO','customer',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'fish_market_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-17 14:16:44
