-- Script SQL para agregar la columna imagenUrl a la tabla productos
-- Ejecuta esto en tu base de datos MySQL/PostgreSQL

-- Para MySQL:
alter table productos add imagen_url varchar2(500);

comment on column productos.imagen_url is
   'Ruta de la imagen del producto en assets (ej: /assets/products/laptop1.jpg)';

-- Para PostgreSQL:
-- ALTER TABLE productos
-- ADD COLUMN imagen_url VARCHAR(500);
-- COMMENT ON COLUMN productos.imagen_url IS 'Ruta de la imagen del producto en assets (ej: /assets/products/laptop1.jpg)';

-- Actualizar algunos productos de ejemplo (ajusta según tus productos):
update productos
   set
   imagen_url = '/assets/products/laptop.jpg'
 where nombre like '%laptop%';
update productos
   set
   imagen_url = '/assets/products/phone.jpg'
 where nombre like '%celular%'
    or nombre like '%phone%';
update productos
   set
   imagen_url = '/assets/products/accessory.jpg'
 where categoria_id = 3;