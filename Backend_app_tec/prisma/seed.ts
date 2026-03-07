import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.user.deleteMany();
  await prisma.brand.deleteMany();

  const hashedPassword = await bcrypt.hash('123456', 10);

  console.log('👤 Creando usuarios...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Andres Fonseca',
        email: 'admin@gmail.com',
        password: hashedPassword,
        rol: 'admin',
        city: 'Bogotá',
        description: 'Administrador de la plataforma',
        photo: 'https://i.pravatar.cc/150?u=admin',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria García',
        email: 'maria@gmail.com',
        password: hashedPassword,
        rol: 'user',
        city: 'Medellín',
        description: 'Apasionada por la tecnología y los gadgets',
        photo: 'https://i.pravatar.cc/150?u=maria',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos López',
        email: 'carlos@gmail.com',
        password: hashedPassword,
        rol: 'user',
        city: 'Cali',
        description: 'Gamer y entusiasta de hardware',
        photo: 'https://i.pravatar.cc/150?u=carlos',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Laura Martínez',
        email: 'laura@gmail.com',
        password: hashedPassword,
        rol: 'user',
        city: 'Barranquilla',
        description: 'Desarrolladora y amante de Apple',
        photo: 'https://i.pravatar.cc/150?u=laura',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Diego Rodríguez',
        email: 'diego@gmail.com',
        password: hashedPassword,
        rol: 'user',
        city: 'Cartagena',
        description: 'Fotógrafo y creador de contenido tech',
        photo: 'https://i.pravatar.cc/150?u=diego',
      },
    }),
  ]);

  console.log('🏷️  Creando marcas...');
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Apple' } }),
    prisma.brand.create({ data: { name: 'Samsung' } }),
    prisma.brand.create({ data: { name: 'Sony' } }),
    prisma.brand.create({ data: { name: 'Lenovo' } }),
    prisma.brand.create({ data: { name: 'Asus' } }),
    prisma.brand.create({ data: { name: 'Xiaomi' } }),
    prisma.brand.create({ data: { name: 'Nintendo' } }),
  ]);

  const [apple, samsung, sony, lenovo, asus, xiaomi, nintendo] = brands;
  const [andres, maria, carlos, laura, diego] = users;

  console.log('📦 Creando publicaciones...');
  await Promise.all([
    // Apple (3)
    prisma.publication.create({
      data: {
        name: 'iPhone 15 Pro Max',
        description:
          'El iPhone más potente con chip A17 Pro, cámara de 48MP con zoom óptico 5x, pantalla Super Retina XDR de 6.7 pulgadas y cuerpo de titanio.',
        img: 'https://co.nixblix.com/cdn/shop/files/27439196045488-iphone_15_pro_max_natural_titanium_pdp_image_position-1__coes.jpg?v=1751651188',
        price: 5199000,
        brandId: apple.id,
        userId: laura.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'MacBook Air M3',
        description:
          'Ultraportátil con chip M3 de Apple, 8 núcleos de CPU, 10 de GPU, 16GB de RAM unificada, pantalla Liquid Retina de 13.6 pulgadas y hasta 18 horas de batería.',
        img: 'https://co.tiendasishop.com/cdn/shop/files/IMG-19266113_m_jpeg_1_6a741c30-0d41-46f2-8f1e-3ddaa86c5ef8.jpg?v=1772750902&width=1920',
        price: 5799000,
        brandId: apple.id,
        userId: andres.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'iPad Pro M4 12.9"',
        description:
          'La tablet más avanzada de Apple con chip M4, pantalla Ultra Retina XDR con tecnología tandem OLED, compatible con Apple Pencil Pro.',
        img: 'https://www.apple.com/newsroom/images/2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro/article/Apple-iPad-Pro-Ultra-Retina-XDR-display-2-up-240507_inline.jpg.large.jpg',
        price: 4500000,
        brandId: apple.id,
        userId: maria.id,
      },
    }),

    // Samsung (3)
    prisma.publication.create({
      data: {
        name: 'Samsung Galaxy S24 Ultra',
        description:
          'Smartphone premium con S Pen integrado, cámara de 200MP, procesador Snapdragon 8 Gen 3, pantalla Dynamic AMOLED 2X de 6.8" y funciones Galaxy AI.',
        img: 'https://http2.mlstatic.com/D_NQ_NP_837617-MLA99981564017_112025-O.webp',
        price: 4899000,
        brandId: samsung.id,
        userId: diego.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Samsung Galaxy Tab S9 FE',
        description:
          'Tablet con pantalla de 10.9 pulgadas, procesador Exynos 1380, 6GB de RAM, resistencia al agua IP68 y S Pen incluido.',
        img: 'https://megacomputer.com.co/wp-content/uploads/2024/11/1-54.webp',
        price: 1799000,
        brandId: samsung.id,
        userId: carlos.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Samsung Galaxy Book4 Pro',
        description:
          'Portátil ultradelgado con procesador Intel Core Ultra, pantalla Dynamic AMOLED 2X de 14", 16GB de RAM y 512GB SSD.',
        img: 'https://http2.mlstatic.com/D_Q_NP_678225-CBT81420530060_122024-O.webp',
        price: 5299000,
        brandId: samsung.id,
        userId: andres.id,
      },
    }),

    // Sony (3)
    prisma.publication.create({
      data: {
        name: 'PlayStation 5 Slim',
        description:
          'Consola de videojuegos de última generación con SSD ultrarrápido, ray tracing, audio 3D Tempest y lector de disco Blu-ray 4K. Incluye control DualSense.',
        img: 'https://gamer4ever.com.co/cdn/shop/files/711719573432.png?v=1706722445',
        price: 2299000,
        brandId: sony.id,
        userId: carlos.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Sony WH-1000XM5',
        description:
          'Auriculares inalámbricos premium con cancelación de ruido líder en la industria, 30 horas de batería, audio Hi-Res y diseño ultraligero plegable.',
        img: 'https://audiocolor.co/cdn/shop/files/AUDIFONOS-INALAMBRICOS-SONY-CON-CANCELACION-DE-RUIDO-AZUL-WH-1000XM5-4.jpg?v=1722631075',
        price: 1499000,
        brandId: sony.id,
        userId: diego.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Sony Xperia 1 VI',
        description:
          'Smartphone con pantalla 4K HDR OLED de 6.5", triple cámara Zeiss con sensor de 52MP, grabación de video en 4K 120fps y audio Hi-Res.',
        img: 'https://http2.mlstatic.com/D_Q_NP_767620-MLU78561727012_082024-O.webp',
        price: 4199000,
        brandId: sony.id,
        userId: laura.id,
      },
    }),

    // Lenovo (3)
    prisma.publication.create({
      data: {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11',
        description:
          'Portátil empresarial ultraligero con Intel Core i7 vPro, pantalla OLED 2.8K de 14", 16GB RAM, 512GB SSD y teclado legendario ThinkPad.',
        img: 'https://microcell.co/40762-large_default/portatil-lenovo-thinkpad-x1-carbon-gen11-panther-corei7-1355u-32gb-1tb-14-w11p-negro.jpg',
        price: 6200000,
        brandId: lenovo.id,
        userId: andres.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Lenovo Legion Pro 5 16"',
        description:
          'Laptop gaming con AMD Ryzen 9, NVIDIA RTX 4070, pantalla WQXGA 240Hz de 16", 32GB DDR5, 1TB SSD y sistema de refrigeración ColdFront 5.0.',
        img: 'https://carulla.vteximg.com.br/arquivos/ids/23961041/Computador-Gaming-LENOVO-Legion-Pro-5-Intel-Core-i9-13900HX-RAM-16-GB-1-TB-SSD-3515365_a.jpg?v=638984922761000000',
        price: 7500000,
        brandId: lenovo.id,
        userId: carlos.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Lenovo Tab P12 Pro',
        description:
          'Tablet premium con pantalla AMOLED 2K de 12.6", Snapdragon 870, 8GB RAM, cuatro altavoces JBL y Lenovo Precision Pen 3 incluido.',
        img: 'https://i.blogs.es/afab4d/p12-1/840_560.jpeg',
        price: 2100000,
        brandId: lenovo.id,
        userId: maria.id,
      },
    }),

    // Asus (3)
    prisma.publication.create({
      data: {
        name: 'ASUS ROG Phone 8 Pro',
        description:
          'Smartphone gaming definitivo con Snapdragon 8 Gen 3, pantalla AMOLED 165Hz de 6.78", 24GB RAM, cámara Gimbal 50MP y AeroActive Cooler X.',
        img: 'https://cdn-files.kimovil.com/default/0009/71/thumb_870515_default_big.jpg',
        price: 3900000,
        brandId: asus.id,
        userId: carlos.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'ASUS ZenBook 14 OLED',
        description:
          'Ultraportátil con pantalla OLED 2.8K de 14", Intel Core Ultra 7, 16GB LPDDR5X, 512GB SSD, pesa solo 1.2kg y certificación Intel Evo.',
        img: 'https://http2.mlstatic.com/D_Q_NP_970667-MLU76255648359_052024-O.webp',
        price: 4200000,
        brandId: asus.id,
        userId: laura.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'ASUS ROG Strix G16',
        description:
          'Laptop gaming con Intel Core i9, NVIDIA RTX 4060, pantalla QHD+ 240Hz de 16", 16GB DDR5, 1TB SSD y teclado retroiluminado per-key RGB.',
        img: 'https://enjoyvideogames.com.co/wp-content/uploads/2026/01/s-l1600-14-1000x1000.webp.jpg',
        price: 5800000,
        brandId: asus.id,
        userId: diego.id,
      },
    }),

    // Xiaomi (2)
    prisma.publication.create({
      data: {
        name: 'Xiaomi 14 Ultra',
        description:
          'Flagship con cámara Leica Summit de 50MP, procesador Snapdragon 8 Gen 3, pantalla AMOLED LTPO 2K de 6.73", carga rápida de 90W y batería de 5000mAh.',
        img: 'https://celularesmiibague.com/wp-content/uploads/2024/04/Mi-14-Ultra-Colores.jpg',
        price: 3200000,
        brandId: xiaomi.id,
        userId: maria.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Xiaomi Redmi Note 13 Pro+',
        description:
          'Gama media premium con cámara de 200MP, pantalla curva AMOLED 120Hz de 6.67", MediaTek Dimensity 7200, carga turbo de 120W y protección IP68.',
        img: 'https://http2.mlstatic.com/D_NQ_NP_748263-MLA99948838439_112025-O.webp',
        price: 1350000,
        brandId: xiaomi.id,
        userId: diego.id,
      },
    }),

    // Nintendo (2)
    prisma.publication.create({
      data: {
        name: 'Nintendo Switch OLED',
        description:
          'Consola híbrida con pantalla OLED de 7 pulgadas, colores vibrantes, soporte ajustable ancho, dock con puerto LAN, 64GB de almacenamiento interno y audio mejorado.',
        img: 'https://www.alkosto.com/medias/045496885144-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMzIxNnxpbWFnZS93ZWJwfGFEazJMMmhrTWk4eE5UTTNNVFEyTVRVNU1UQTNNQzh3TkRVME9UWTRPRFV4TkRSZk1EQXhYemMxTUZkNE56VXdTQXxjZTI3ZjY3MDAxZmY0ODk3ZWExZWQyZmI0YzI3YzdmN2YzMTE5YTk2MWY0MzE3ZmNhOWFhNTk5MDE4MTA4NGQy',
        price: 1799000,
        brandId: nintendo.id,
        userId: carlos.id,
      },
    }),
    prisma.publication.create({
      data: {
        name: 'Nintendo Switch Lite',
        description:
          'Consola portátil compacta y ligera, perfecta para jugar en cualquier lugar. Pantalla táctil de 5.5", controles integrados y amplio catálogo de juegos.',
        img: 'https://http2.mlstatic.com/D_Q_NP_808292-MLA99857535211_112025-O.webp',
        price: 899000,
        brandId: nintendo.id,
        userId: maria.id,
      },
    }),
  ]);

  console.log('✅ Seed completado exitosamente:');
  console.log(`   - ${users.length} usuarios creados`);
  console.log(`   - ${brands.length} marcas creadas`);
  console.log('   - 20 publicaciones creadas');
  console.log('');
  console.log('📋 Credenciales de acceso (password: 123456):');
  console.log('   Admin: admin@gmail.com');
  console.log(
    '   Users: maria@gmail.com, carlos@gmail.com, laura@gmail.com, diego@gmail.com',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
