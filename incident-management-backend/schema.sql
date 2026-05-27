CREATE DATABASE IF NOT EXISTS ticketing_system;
USE ticketing_system;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  impact VARCHAR(20) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  incident_reporter_id INT NOT NULL,
  assigned_to_id INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  CONSTRAINT fk_tickets_reporter
    FOREIGN KEY (incident_reporter_id) REFERENCES users(id),
  CONSTRAINT fk_tickets_assignee
    FOREIGN KEY (assigned_to_id) REFERENCES users(id)
);

INSERT INTO users (id, name) VALUES
(1, 'Umaid'),
(2, 'Syeda'),
(3, 'Karim'),
(4, 'David'),
(5, 'Aisha'),
(6, 'Omar'),
(7, 'Fatima'),
(8, 'Daniel'),
(9, 'Mariam'),
(10, 'Jason'),
(11, 'Nadia'),
(12, 'Ahmed');

INSERT INTO tickets (
  id,
  title,
  description,
  category,
  impact,
  priority,
  status,
  incident_reporter_id,
  assigned_to_id,
  created_at,
  resolved_at
) VALUES
(1, 'Production API returning 500 errors',
 'Multiple users are reporting failed requests from the production API.',
 'Software', 'Critical', 'Critical', 'Open', 1, 3,
 '2026-05-26 09:30:00', NULL),

(2, 'Office network connectivity issue',
 'Several workstations cannot connect to internal tools.',
 'Network', 'High', 'High', 'In Progress', 2, 1,
 '2026-05-26 08:45:00', NULL),

(3, 'Laptop replacement request',
 'User reports repeated hardware failures and requires a replacement laptop.',
 'Hardware', 'Medium', 'Medium', 'Resolved', 4, 2,
 '2026-05-25 11:00:00', '2026-05-25 16:45:00'),

(4, 'Suspicious login attempt',
 'Security alert triggered after multiple failed login attempts.',
 'Security', 'High', 'Critical', 'Closed', 3, 3,
 '2026-05-25 08:20:00', '2026-05-25 13:10:00'),

(5, 'VPN connection failures',
 'Several remote users are unable to connect to the company VPN.',
 'Network', 'High', 'High', 'Open', 5, 6,
 '2026-05-26 12:10:00', NULL),

(6, 'Database backup job failed',
 'The scheduled overnight database backup did not complete successfully.',
 'Software', 'Medium', 'High', 'In Progress', 7, 8,
 '2026-05-26 07:45:00', NULL),

(7, 'Printer not responding in finance office',
 'The shared finance office printer is powered on but not responding to print jobs.',
 'Hardware', 'Low', 'Low', 'Open', 9, NULL,
 '2026-05-25 10:25:00', NULL),

(8, 'Unauthorized access alert',
 'Monitoring detected a login attempt from an unfamiliar location.',
 'Security', 'Critical', 'Critical', 'In Progress', 10, 11,
 '2026-05-24 22:40:00', NULL),

(9, 'Application deployment stuck',
 'The latest deployment is stuck during the container startup phase.',
 'Software', 'High', 'High', 'Open', 12, 5,
 '2026-05-24 15:35:00', NULL),

(10, 'Wi-Fi access point offline',
 'A wireless access point on the second floor is offline.',
 'Network', 'Medium', 'Medium', 'Resolved', 6, 7,
 '2026-05-23 09:15:00', '2026-05-23 11:30:00'),

(11, 'Workstation blue screen issue',
 'A user workstation repeatedly crashes during startup.',
 'Hardware', 'Medium', 'Medium', 'Closed', 8, 9,
 '2026-05-22 13:50:00', '2026-05-22 16:05:00'),

(12, 'Password reset portal unavailable',
 'Users are unable to access the password reset self-service portal.',
 'Security', 'High', 'High', 'Open', 11, NULL,
 '2026-05-26 16:20:00', NULL),

(13, 'Monitoring alert for high CPU usage',
 'Application server CPU usage has remained above 90 percent for more than 20 minutes.',
 'Software', 'High', 'High', 'In Progress', 5, 3,
 '2026-05-26 13:05:00', NULL),

(14, 'Firewall rule blocking internal service',
 'A recent firewall rule change appears to be blocking access to an internal service.',
 'Network', 'Critical', 'Critical', 'Open', 6, 10,
 '2026-05-26 10:55:00', NULL),

(15, 'Keyboard and docking station failure',
 'User reports that their external keyboard and docking station are no longer detected.',
 'Hardware', 'Low', 'Low', 'Resolved', 7, 4,
 '2026-05-21 09:40:00', '2026-05-21 12:15:00'),

(16, 'Endpoint antivirus scan failed',
 'A scheduled antivirus scan failed on multiple workstations.',
 'Security', 'Medium', 'Medium', 'In Progress', 8, 11,
 '2026-05-24 11:25:00', NULL),

(17, 'Internal dashboard loading slowly',
 'Users report that the internal dashboard is taking too long to load during business hours.',
 'Software', 'Medium', 'Medium', 'Open', 9, 12,
 '2026-05-26 14:35:00', NULL),

(18, 'Switch port flapping detected',
 'Network monitoring detected repeated link up/down events on a switch port.',
 'Network', 'Medium', 'High', 'Open', 10, 6,
 '2026-05-25 15:10:00', NULL),

(19, 'Conference room display not working',
 'The conference room display does not detect HDMI input from user laptops.',
 'Hardware', 'Low', 'Low', 'Closed', 11, 7,
 '2026-05-20 10:30:00', '2026-05-20 14:00:00'),

(20, 'Phishing email reported',
 'A user reported a suspicious email asking for account verification.',
 'Security', 'High', 'High', 'Resolved', 12, 11,
 '2026-05-23 16:45:00', '2026-05-23 18:05:00'),

(21, 'Container image pull failure',
 'Deployment failed because the application container image could not be pulled from the registry.',
 'Software', 'High', 'High', 'Open', 1, 8,
 '2026-05-26 15:50:00', NULL),

(22, 'DNS resolution issue',
 'Several users report that an internal hostname cannot be resolved.',
 'Network', 'High', 'High', 'In Progress', 2, 10,
 '2026-05-26 06:55:00', NULL),

(23, 'Replacement monitor request',
 'User requires a replacement monitor due to intermittent display flickering.',
 'Hardware', 'Low', 'Medium', 'Open', 3, NULL,
 '2026-05-22 09:05:00', NULL),

(24, 'MFA push notifications delayed',
 'Users are experiencing delays receiving multi-factor authentication push notifications.',
 'Security', 'Medium', 'High', 'Open', 4, 11,
 '2026-05-26 11:45:00', NULL);