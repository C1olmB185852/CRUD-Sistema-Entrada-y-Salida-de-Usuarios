create database registro;

use registro;


CREATE TABLE registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    fecha_entrada DATETIME,
    fecha_salida DATETIME
);

SHOW DATABASES;