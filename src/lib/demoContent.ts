/* ─────────────────────────────────────────────────────────────────────────
 * Contenido de ejemplo para la vista previa de plantillas.
 *
 * La galería mostraba rectángulos de color con el nombre escrito: alguien que
 * viene a comprar un constructor de sitios no veía ni un sitio. Esto alimenta
 * /preview/[plantilla] con contenido de un negocio plausible, para que la
 * vista previa sea la plantilla de verdad y no una maqueta.
 *
 * Es contenido inventado a propósito y se ve como tal ("Panadería La
 * Esquina"): nunca son datos de un cliente real.
 * ───────────────────────────────────────────────────────────────────────── */

import { TEMPLATE_COLLECTIONS, type SiteItemKind } from '@/lib/constants';

type DemoItemSeed = {
  title: string;
  subtitle?: string;
  description?: string;
  price?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
};

type DemoIdentity = {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  phone: string;
  address: string;
  openingHours: string;
  /** Tres muestras por colección que la plantilla use. */
  samples: Partial<Record<SiteItemKind, DemoItemSeed[]>>;
};

const TEL = '+54 9 11 5555-1234';

// Atajos para las colecciones que se repiten entre rubros parecidos.
const equipo = (a: string, b: string, c: string): DemoItemSeed[] => [
  { title: a, subtitle: 'Matrícula 12.345' },
  { title: b, subtitle: 'Matrícula 23.456' },
  { title: c, subtitle: 'Matrícula 34.567' },
];

const faqs = (pares: [string, string][]): DemoItemSeed[] =>
  pares.map(([q, a]) => ({ title: q, description: a }));

const galeria = (...titulos: string[]): DemoItemSeed[] =>
  titulos.map((t) => ({ title: t }));

export const DEMOS: Record<string, DemoIdentity> = {
  'sabor-urbano': {
    siteName: 'Bodegón Don Ernesto',
    heroTitle: 'Cocina de barrio, como en casa',
    heroSubtitle: 'Milanesas, pastas caseras y vino de la casa en pleno Boedo.',
    aboutText: 'Desde 1987 cocinamos lo mismo que comemos nosotros. Sin vueltas.',
    phone: TEL,
    address: 'Av. Boedo 1240, CABA',
    openingHours: 'Mar a Dom · 12 a 16 y 20 a 00',
    samples: {},
  },
  'portfolio-minimal': {
    siteName: 'Malena Ruiz',
    heroTitle: 'Diseño gráfico y dirección de arte',
    heroSubtitle: 'Identidad visual para marcas que recién empiezan.',
    aboutText: 'Trabajo con negocios chicos que necesitan verse grandes.',
    phone: TEL,
    address: 'Villa Crespo, CABA',
    openingHours: 'Lun a Vie · 10 a 18',
    samples: {},
  },
  'landing-pro': {
    siteName: 'Contá Simple',
    heroTitle: 'Tu contabilidad, resuelta',
    heroSubtitle: 'Monotributo, facturación y balances sin que tengas que entender nada.',
    aboutText: 'Acompañamos a más de 400 monotributistas en todo el país.',
    phone: TEL,
    address: 'Atención 100% online',
    openingHours: 'Lun a Vie · 9 a 18',
    samples: {},
  },
  'servicios-pro': {
    siteName: 'Reformas Delgado',
    heroTitle: 'Refacciones y obra chica',
    heroSubtitle: 'Presupuesto sin cargo en 48 horas.',
    aboutText: 'Equipo propio de albañilería, plomería y electricidad.',
    phone: TEL,
    address: 'Zona Norte, GBA',
    openingHours: 'Lun a Sáb · 8 a 18',
    samples: {},
  },
  'tienda-express': {
    siteName: 'Almacén Nuevo Sur',
    heroTitle: 'Tu almacén, ahora online',
    heroSubtitle: 'Pedí por WhatsApp y te lo llevamos en el día.',
    aboutText: 'Productos de almacén, limpieza y bebidas con entrega en el barrio.',
    phone: TEL,
    address: 'Lomas de Zamora, GBA',
    openingHours: 'Lun a Sáb · 9 a 21',
    samples: {},
  },
  'tienda-catalogo': {
    siteName: 'Deco Norte',
    heroTitle: 'Muebles y deco para tu casa',
    heroSubtitle: 'Envíos a todo el país. Hasta 6 cuotas sin interés.',
    aboutText: 'Fabricación propia de muebles de pino y melamina.',
    phone: TEL,
    address: 'San Martín, GBA',
    openingHours: 'Lun a Vie · 9 a 18 · Sáb 9 a 13',
    samples: {},
  },
  'fotografia-estudio': {
    siteName: 'Estudio Clara Luz',
    heroTitle: 'Fotografía de casamientos y familia',
    heroSubtitle: 'Momentos reales, sin poses forzadas.',
    aboutText: 'Doce años documentando casamientos en Buenos Aires y la costa.',
    phone: TEL,
    address: 'Palermo, CABA',
    openingHours: 'Lun a Vie · 10 a 19',
    samples: {
      gallery: galeria('Casamiento en San Isidro', 'Book de 15', 'Sesión familiar en el parque', 'Retrato en estudio'),
      service: [
        { title: 'Casamiento completo', description: 'Civil, fiesta y álbum impreso.', price: 850000 },
        { title: 'Book de 15', description: 'Dos cambios de ropa, 40 fotos editadas.', price: 320000 },
        { title: 'Sesión familiar', description: 'Una hora al aire libre, 25 fotos.', price: 180000 },
      ],
    },
  },
  'gimnasio-fitness': {
    siteName: 'Box Ciudadela',
    heroTitle: 'Entrená en serio',
    heroSubtitle: 'Funcional, musculación y clases grupales todos los días.',
    aboutText: 'Profesores recibidos y grupos reducidos de hasta 12 personas.',
    phone: TEL,
    address: 'Ciudadela, GBA',
    openingHours: 'Lun a Vie · 6 a 23 · Sáb 9 a 14',
    samples: {
      plan: [
        { title: 'Libre', description: 'Acceso a todas las clases y sala.', price: 38000 },
        { title: '3 veces por semana', description: 'Elegís los días.', price: 29000 },
        { title: 'Solo musculación', description: 'Sala de máquinas y peso libre.', price: 24000 },
      ],
      schedule: [
        { title: 'Funcional', subtitle: 'Lun, Mié y Vie · 7:00 y 19:00' },
        { title: 'Musculación', subtitle: 'Todos los días · 6:00 a 23:00' },
        { title: 'Entrada en calor y movilidad', subtitle: 'Mar y Jue · 18:00' },
      ],
    },
  },
  'comercio-local': {
    siteName: 'Ferretería El Tornillo',
    heroTitle: 'Todo para tu casa y tu obra',
    heroSubtitle: 'Cuarenta años atendiendo el barrio.',
    aboutText: 'Herramientas, sanitarios, electricidad y pinturería.',
    phone: TEL,
    address: 'Av. Rivadavia 8820, CABA',
    openingHours: 'Lun a Vie · 8 a 19 · Sáb 8 a 13',
    samples: {
      feature: [
        { title: 'Corte de vidrio a medida', description: 'En el día, mientras esperás.' },
        { title: 'Copia de llaves', description: 'Todo tipo, incluidas de seguridad.' },
        { title: 'Envío al barrio', description: 'Sin cargo en compras desde $30.000.' },
      ],
    },
  },
  'belleza-estetica': {
    siteName: 'Estudio Aura',
    heroTitle: 'Belleza y bienestar',
    heroSubtitle: 'Turnos por WhatsApp, sin esperas.',
    aboutText: 'Un espacio chico y tranquilo, atendido por sus dueñas.',
    phone: TEL,
    address: 'Caballito, CABA',
    openingHours: 'Mar a Sáb · 10 a 20',
    samples: {
      service: [
        { title: 'Manicura semipermanente', description: 'Incluye retirado y diseño simple.', price: 22000 },
        { title: 'Perfilado de cejas', description: 'Con henna opcional.', price: 14000 },
        { title: 'Limpieza facial profunda', description: 'Una hora, con extracción.', price: 35000 },
      ],
      gallery: galeria('Nail art floral', 'Cejas con henna', 'Antes y después facial'),
    },
  },
  'cafeteria': {
    siteName: 'Café Tostado',
    heroTitle: 'Café de especialidad en el barrio',
    heroSubtitle: 'Tostamos nuestro propio grano todas las semanas.',
    aboutText: 'Cafetería chica con panadería propia y mesas en la vereda.',
    phone: TEL,
    address: 'Almagro, CABA',
    openingHours: 'Lun a Dom · 8 a 20',
    samples: {
      menu: [
        { title: 'Flat white', description: 'Doble shot, leche texturada.', price: 4200, meta: { category: 'Café' } },
        { title: 'Medialunas de manteca', description: 'Media docena, recién horneadas.', price: 7800, meta: { category: 'Panadería' } },
        { title: 'Tostado de jamón y queso', description: 'En pan de masa madre.', price: 9500, meta: { category: 'Para comer' } },
      ],
      gallery: galeria('El salón', 'Nuestro tostado', 'Mesa en la vereda'),
    },
  },
  'bar-cerveceria': {
    siteName: 'Birra Norte',
    heroTitle: 'Cervecería artesanal',
    heroSubtitle: 'Diez canillas rotativas y cocina hasta tarde.',
    aboutText: 'Producimos cuatro estilos propios y rotamos invitadas cada semana.',
    phone: TEL,
    address: 'Vicente López, GBA',
    openingHours: 'Mié a Dom · 19 a 02',
    samples: {
      menu: [
        { title: 'IPA de la casa', description: 'Pinta. Amarga, cítrica, 6,2%.', price: 6500, meta: { category: 'Canillas' } },
        { title: 'Golden Ale', description: 'Pinta. Suave, para empezar.', price: 6000, meta: { category: 'Canillas' } },
        { title: 'Papas bravas', description: 'Para compartir, con alioli.', price: 11000, meta: { category: 'Cocina' } },
      ],
      gallery: galeria('Las canillas', 'Patio trasero', 'Noche de música en vivo'),
    },
  },
  'pasteleria': {
    siteName: 'Dulce Matilde',
    heroTitle: 'Pastelería artesanal',
    heroSubtitle: 'Tortas por encargo con 48 horas de anticipación.',
    aboutText: 'Todo hecho el mismo día, sin conservantes.',
    phone: TEL,
    address: 'Ramos Mejía, GBA',
    openingHours: 'Mar a Dom · 9 a 20',
    samples: {
      menu: [
        { title: 'Torta de chocolate y dulce de leche', description: 'Para 12 porciones.', price: 42000, meta: { category: 'Tortas' } },
        { title: 'Lemon pie', description: 'Merengue italiano flameado.', price: 28000, meta: { category: 'Tartas' } },
        { title: 'Alfajores de maicena', description: 'Docena.', price: 12000, meta: { category: 'Para llevar' } },
      ],
      gallery: galeria('Torta de cumpleaños', 'Mesa dulce de casamiento', 'Vitrina del día'),
    },
  },
  'barberia': {
    siteName: 'Barbería Oeste',
    heroTitle: 'Corte y barba',
    heroSubtitle: 'Reservá tu turno por WhatsApp.',
    aboutText: 'Tres sillas, música fuerte y café gratis.',
    phone: TEL,
    address: 'Morón, GBA',
    openingHours: 'Mar a Sáb · 10 a 20',
    samples: {
      service: [
        { title: 'Corte clásico', description: 'Máquina y tijera, con lavado.', price: 15000 },
        { title: 'Corte + barba', description: 'Incluye toalla caliente.', price: 22000 },
        { title: 'Perfilado de barba', description: 'Navaja y aceite.', price: 11000 },
      ],
      gallery: galeria('Fade con barba', 'Corte clásico', 'El local'),
      team: equipo('Nico', 'Fede', 'Juanma'),
    },
  },
  'consultorio-medico': {
    siteName: 'Centro Médico Aranda',
    heroTitle: 'Atención médica integral',
    heroSubtitle: 'Turnos en el día para consultas generales.',
    aboutText: 'Clínica médica, cardiología y nutrición en un mismo lugar.',
    phone: TEL,
    address: 'Quilmes, GBA',
    openingHours: 'Lun a Vie · 8 a 20 · Sáb 9 a 13',
    samples: {
      service: [
        { title: 'Clínica médica', description: 'Consulta general y controles.' },
        { title: 'Cardiología', description: 'Electrocardiograma y ergometría.' },
        { title: 'Nutrición', description: 'Planes personalizados.' },
      ],
      team: equipo('Dra. Laura Aranda', 'Dr. Martín Sosa', 'Lic. Paula Giménez'),
      faq: faqs([
        ['¿Atienden por obra social?', 'Sí, trabajamos con las principales obras sociales y prepagas.'],
        ['¿Necesito turno previo?', 'Para consulta general atendemos por orden de llegada hasta las 11.'],
        ['¿Hacen estudios en el lugar?', 'Sí, electrocardiograma y laboratorio básico.'],
      ]),
    },
  },
  'odontologia': {
    siteName: 'Odontología Benedetti',
    heroTitle: 'Tu sonrisa, en buenas manos',
    heroSubtitle: 'Primera consulta y diagnóstico sin cargo.',
    aboutText: 'Consultorio familiar con más de 20 años en el barrio.',
    phone: TEL,
    address: 'Banfield, GBA',
    openingHours: 'Lun a Vie · 9 a 19',
    samples: {
      service: [
        { title: 'Limpieza y flúor', description: 'Sesión de 40 minutos.', price: 28000 },
        { title: 'Blanqueamiento', description: 'Tres sesiones en consultorio.', price: 150000 },
        { title: 'Ortodoncia', description: 'Brackets metálicos o estéticos.' },
      ],
      team: equipo('Dr. Pablo Benedetti', 'Dra. Sofía Ríos', 'Dra. Ana Torres'),
      testimonial: [
        { title: 'Carla M.', description: 'Me hicieron el blanqueamiento y quedé chocha. Muy prolijos.', meta: { rating: 5 } },
        { title: 'Diego R.', description: 'Llevo a mis hijos desde que eran chiquitos. Nunca un problema.', meta: { rating: 5 } },
        { title: 'Silvia P.', description: 'Turnos puntuales, algo que no es común.', meta: { rating: 4 } },
      ],
    },
  },
  'spa': {
    siteName: 'Spa Serena',
    heroTitle: 'Un rato para vos',
    heroSubtitle: 'Masajes, faciales y circuito de relax.',
    aboutText: 'Un espacio pensado para desconectar de verdad.',
    phone: TEL,
    address: 'Tigre, GBA',
    openingHours: 'Mar a Dom · 10 a 21',
    samples: {
      service: [
        { title: 'Masaje descontracturante', description: '50 minutos, espalda y cervicales.', price: 45000 },
        { title: 'Facial hidratante', description: 'Limpieza, tónico y máscara.', price: 38000 },
        { title: 'Circuito de relax', description: 'Sauna, hidromasaje y descanso.', price: 30000 },
      ],
      gallery: galeria('Sala de masajes', 'Circuito de agua', 'Área de descanso'),
      plan: [
        { title: 'Día completo', description: 'Circuito + un tratamiento a elección.', price: 68000 },
        { title: 'Pack 4 masajes', description: 'Válido por tres meses.', price: 160000 },
        { title: 'Para dos', description: 'Circuito en pareja con brindis.', price: 95000 },
      ],
    },
  },
  'veterinaria': {
    siteName: 'Veterinaria Huellas',
    heroTitle: 'Cuidamos a los de casa',
    heroSubtitle: 'Consultas, vacunación y peluquería canina.',
    aboutText: 'Atención de urgencias y planes de vacunación al día.',
    phone: TEL,
    address: 'Berazategui, GBA',
    openingHours: 'Lun a Sáb · 9 a 20',
    samples: {
      service: [
        { title: 'Consulta general', description: 'Revisación completa.', price: 18000 },
        { title: 'Plan de vacunación', description: 'Esquema anual para perros y gatos.' },
        { title: 'Peluquería canina', description: 'Baño, corte y corte de uñas.', price: 25000 },
      ],
      team: equipo('Dra. Mariana López', 'Dr. Esteban Paz', 'Flor (peluquería)'),
      faq: faqs([
        ['¿Atienden urgencias?', 'Sí, de lunes a sábado en horario de atención.'],
        ['¿Hacen castraciones?', 'Sí, con turno previo y estudios prequirúrgicos.'],
        ['¿Venden alimento balanceado?', 'Tenemos las principales marcas veterinarias.'],
      ]),
    },
  },
  'estudio-juridico': {
    siteName: 'Estudio Ferrari & Asoc.',
    heroTitle: 'Asesoramiento legal claro',
    heroSubtitle: 'Primera consulta sin cargo.',
    aboutText: 'Derecho laboral, de familia y sucesiones.',
    phone: TEL,
    address: 'Microcentro, CABA',
    openingHours: 'Lun a Vie · 9 a 18',
    samples: {
      service: [
        { title: 'Derecho laboral', description: 'Despidos, accidentes y reclamos.' },
        { title: 'Familia', description: 'Divorcios, cuotas y régimen de visitas.' },
        { title: 'Sucesiones', description: 'Trámite completo hasta la inscripción.' },
      ],
      team: equipo('Dr. Luis Ferrari', 'Dra. Carolina Méndez', 'Dr. Ignacio Vera'),
      faq: faqs([
        ['¿Cobran la primera consulta?', 'No, la primera entrevista es sin cargo.'],
        ['¿Trabajan a resultado?', 'En casos laborales sí, se conviene por escrito.'],
        ['¿Atienden en el interior?', 'Sí, por videollamada y con correspondencia local.'],
      ]),
    },
  },
  'estudio-contable': {
    siteName: 'Estudio Vidal',
    heroTitle: 'Contadores para tu negocio',
    heroSubtitle: 'Monotributo, sueldos y balances.',
    aboutText: 'Acompañamos a pymes y profesionales independientes.',
    phone: TEL,
    address: 'Rosario, Santa Fe',
    openingHours: 'Lun a Vie · 9 a 18',
    samples: {
      service: [
        { title: 'Monotributo', description: 'Alta, recategorización y pagos.' },
        { title: 'Liquidación de sueldos', description: 'Hasta 20 empleados.' },
        { title: 'Balances', description: 'Cierre anual y presentación.' },
      ],
      plan: [
        { title: 'Monotributista', description: 'Todo lo mensual resuelto.', price: 45000 },
        { title: 'Pyme', description: 'Incluye sueldos e IVA.', price: 120000 },
        { title: 'A medida', description: 'Para estructuras más grandes.' },
      ],
      faq: faqs([
        ['¿Atienden de forma remota?', 'Sí, la mayoría de nuestros clientes son de otras provincias.'],
        ['¿Incluye la factura electrónica?', 'Sí, la emitimos o te enseñamos a hacerlo.'],
        ['¿Qué pasa si debo meses?', 'Armamos un plan de regularización antes de empezar.'],
      ]),
    },
  },
  'arquitectura': {
    siteName: 'Estudio Pampa',
    heroTitle: 'Arquitectura y obra',
    heroSubtitle: 'Del anteproyecto a la llave en mano.',
    aboutText: 'Viviendas unifamiliares y refacciones integrales.',
    phone: TEL,
    address: 'La Plata, Buenos Aires',
    openingHours: 'Lun a Vie · 9 a 18',
    samples: {
      gallery: galeria('Casa en City Bell', 'Refacción en Palermo', 'Local comercial', 'Ampliación en planta alta'),
      service: [
        { title: 'Anteproyecto', description: 'Plantas, vistas y render.' },
        { title: 'Dirección de obra', description: 'Seguimiento semanal.' },
        { title: 'Llave en mano', description: 'Proyecto, obra y terminaciones.' },
      ],
      team: equipo('Arq. Nicolás Prado', 'Arq. Valeria Costa', 'MMO Jorge Díaz'),
    },
  },
  'taller-mecanico': {
    siteName: 'Taller Los Hermanos',
    heroTitle: 'Mecánica de confianza',
    heroSubtitle: 'Diagnóstico sin cargo y presupuesto por escrito.',
    aboutText: 'Mecánica general, tren delantero e inyección.',
    phone: TEL,
    address: 'San Justo, GBA',
    openingHours: 'Lun a Vie · 8 a 18 · Sáb 8 a 13',
    samples: {
      service: [
        { title: 'Service completo', description: 'Aceite, filtros y revisión de 30 puntos.', price: 95000 },
        { title: 'Tren delantero', description: 'Alineación y balanceo.', price: 45000 },
        { title: 'Diagnóstico por scanner', description: 'Lectura y borrado de fallas.', price: 20000 },
      ],
      feature: [
        { title: 'Presupuesto por escrito', description: 'Antes de tocar nada.' },
        { title: 'Repuestos originales', description: 'O alternativos, vos elegís.' },
        { title: 'Garantía de 6 meses', description: 'Sobre mano de obra.' },
      ],
      faq: faqs([
        ['¿Hacen VTV?', 'No, pero dejamos el auto listo para aprobarla.'],
        ['¿Trabajan con todas las marcas?', 'Nacionales e importadas, menos alta gama.'],
        ['¿Se puede dejar el auto?', 'Sí, tenemos playa cubierta sin cargo.'],
      ]),
    },
  },
  'tecnologia-reparaciones': {
    siteName: 'TecnoFix',
    heroTitle: 'Reparación de celulares y notebooks',
    heroSubtitle: 'La mayoría de los arreglos, en el día.',
    aboutText: 'Técnicos propios y repuestos con garantía.',
    phone: TEL,
    address: 'Av. Corrientes 2100, CABA',
    openingHours: 'Lun a Sáb · 10 a 19',
    samples: {
      service: [
        { title: 'Cambio de pantalla', description: 'Todas las marcas, en el día.', price: 85000 },
        { title: 'Cambio de batería', description: 'Con garantía de 6 meses.', price: 45000 },
        { title: 'Formateo de notebook', description: 'Respaldo de datos incluido.', price: 35000 },
      ],
      feature: [
        { title: 'Diagnóstico sin cargo', description: 'Te decimos qué tiene antes de cobrarte.' },
        { title: 'Garantía escrita', description: 'Seis meses en repuestos.' },
        { title: 'Retiro a domicilio', description: 'En CABA, sin costo.' },
      ],
      faq: faqs([
        ['¿Cuánto tarda un cambio de pantalla?', 'Entre dos y cuatro horas si tenemos el repuesto.'],
        ['¿Pierdo mis datos?', 'No, salvo que la falla lo exija; siempre avisamos antes.'],
        ['¿Reparan equipos mojados?', 'Sí, cuanto antes lo traigas mejor.'],
      ]),
    },
  },
  'academia': {
    siteName: 'Academia Puente',
    heroTitle: 'Cursos con salida laboral',
    heroSubtitle: 'Presencial en CABA y online para todo el país.',
    aboutText: 'Formación corta y práctica, con certificado.',
    phone: TEL,
    address: 'Once, CABA',
    openingHours: 'Lun a Vie · 9 a 21',
    samples: {
      service: [
        { title: 'Programación web', description: 'Seis meses, dos veces por semana.' },
        { title: 'Diseño gráfico', description: 'Cuatro meses, con portfolio final.' },
        { title: 'Inglés para trabajo', description: 'Niveles desde cero.' },
      ],
      team: equipo('Lic. Andrea Sosa', 'Prof. Martín Díaz', 'Prof. Ana Correa'),
      faq: faqs([
        ['¿Los cursos tienen certificado?', 'Sí, certificado propio al completar la cursada.'],
        ['¿Se puede pagar en cuotas?', 'Sí, hasta en tres pagos sin interés.'],
        ['¿Hay clases grabadas?', 'Todas las clases online quedan grabadas por un año.'],
      ]),
    },
  },
  'inmobiliaria': {
    siteName: 'Inmobiliaria del Sol',
    heroTitle: 'Tu próxima casa',
    heroSubtitle: 'Venta y alquiler en zona sur.',
    aboutText: 'Matriculados con 25 años en el mercado local.',
    phone: TEL,
    address: 'Adrogué, GBA',
    openingHours: 'Lun a Vie · 9 a 18 · Sáb 10 a 13',
    samples: {
      property: [
        { title: 'Casa 3 ambientes en Adrogué', description: 'Patio, quincho y cochera.', price: 145000, meta: { operation: 'Venta', location: 'Adrogué', bedrooms: 3, area: 120 } },
        { title: 'Departamento 2 ambientes', description: 'A estrenar, con balcón.', price: 450000, meta: { operation: 'Alquiler', location: 'Temperley', bedrooms: 1, area: 48 } },
        { title: 'Lote en Canning', description: 'Barrio cerrado con seguridad.', price: 89000, meta: { operation: 'Venta', location: 'Canning', area: 800 } },
      ],
      service: [
        { title: 'Tasación sin cargo', description: 'Con informe escrito.' },
        { title: 'Administración de alquileres', description: 'Cobranza y mantenimiento.' },
        { title: 'Gestión de escrituras', description: 'Con escribanía asociada.' },
      ],
      faq: faqs([
        ['¿Cobran la tasación?', 'No, la tasación es sin cargo y sin compromiso.'],
        ['¿Qué garantías piden para alquilar?', 'Recibo de sueldo y garantía propietaria o seguro de caución.'],
        ['¿Publican en los portales?', 'Sí, en todos los principales del país.'],
      ]),
    },
  },
  'hotel-cabanas': {
    siteName: 'Cabañas Los Alerces',
    heroTitle: 'Descanso en la montaña',
    heroSubtitle: 'Cabañas equipadas a diez minutos del centro.',
    aboutText: 'Seis cabañas de madera con vista al lago.',
    phone: TEL,
    address: 'San Martín de los Andes, Neuquén',
    openingHours: 'Recepción · 8 a 22',
    samples: {
      property: [
        { title: 'Cabaña Alerce', description: 'Para 4 personas, con hogar a leña.', price: 95000, meta: { bedrooms: 2, area: 60 } },
        { title: 'Cabaña Lenga', description: 'Para 6 personas, dos baños.', price: 130000, meta: { bedrooms: 3, area: 85 } },
        { title: 'Estudio Ñire', description: 'Para 2 personas, ideal parejas.', price: 70000, meta: { bedrooms: 1, area: 35 } },
      ],
      gallery: galeria('Vista al lago', 'Interior de la cabaña', 'Quincho común', 'Sendero de acceso'),
      feature: [
        { title: 'Desayuno incluido', description: 'Casero, servido en la cabaña.' },
        { title: 'Wi-Fi en todo el predio', description: 'Fibra óptica.' },
        { title: 'Se admiten mascotas', description: 'Consultar al reservar.' },
      ],
    },
  },
  'agencia-viajes': {
    siteName: 'Rumbo Sur Viajes',
    heroTitle: 'Armamos tu viaje',
    heroSubtitle: 'Paquetes nacionales e internacionales en cuotas.',
    aboutText: 'Agencia habilitada con legajo vigente.',
    phone: TEL,
    address: 'Córdoba Capital',
    openingHours: 'Lun a Vie · 9 a 18 · Sáb 9 a 13',
    samples: {
      service: [
        { title: 'Bariloche en familia', description: '7 noches con aéreos y excursiones.', price: 1200000 },
        { title: 'Brasil todo incluido', description: 'Porto Seguro, 7 noches.', price: 1650000 },
        { title: 'Cataratas del Iguazú', description: '4 noches con traslados.', price: 780000 },
      ],
      gallery: galeria('Bariloche', 'Porto Seguro', 'Cataratas'),
      testimonial: [
        { title: 'Familia Gómez', description: 'Nos armaron todo el viaje a Bariloche, sin una sola complicación.', meta: { rating: 5 } },
        { title: 'Lucía F.', description: 'Muy atentos y consiguieron mejor precio que por internet.', meta: { rating: 5 } },
        { title: 'Roberto A.', description: 'Segunda vez que viajo con ellos. Recomendables.', meta: { rating: 4 } },
      ],
    },
  },
  'floreria': {
    siteName: 'Florería Azahar',
    heroTitle: 'Flores para cada ocasión',
    heroSubtitle: 'Envíos en el día en CABA.',
    aboutText: 'Ramos, plantas y arreglos para eventos.',
    phone: TEL,
    address: 'Recoleta, CABA',
    openingHours: 'Lun a Sáb · 9 a 19 · Dom 10 a 14',
    samples: {
      menu: [
        { title: 'Ramo de estación', description: 'Armado con lo más fresco del día.', price: 28000, meta: { category: 'Ramos' } },
        { title: 'Caja de rosas', description: 'Doce rosas en caja de regalo.', price: 45000, meta: { category: 'Ramos' } },
        { title: 'Planta de interior', description: 'Con maceta de cerámica.', price: 32000, meta: { category: 'Plantas' } },
      ],
      gallery: galeria('Ramo de novia', 'Arreglo para oficina', 'Vidriera de primavera'),
    },
  },
  'eventos-dj': {
    siteName: 'DJ Nacho Ruiz',
    heroTitle: 'Música para tu fiesta',
    heroSubtitle: 'Casamientos, 15 años y corporativos.',
    aboutText: 'Equipo de sonido e iluminación propio.',
    phone: TEL,
    address: 'Mar del Plata, Buenos Aires',
    openingHours: 'Consultas · todos los días',
    samples: {
      service: [
        { title: 'Casamiento completo', description: 'Ceremonia, cóctel y fiesta.', price: 650000 },
        { title: 'Fiesta de 15', description: 'Incluye pantalla LED.', price: 480000 },
        { title: 'Evento corporativo', description: 'Sonido para charlas y cierre.', price: 350000 },
      ],
      gallery: galeria('Casamiento en la costa', 'Fiesta de 15', 'Cabina y luces'),
      testimonial: [
        { title: 'Flor y Seba', description: 'No se sentó nadie en toda la noche. Impecable.', meta: { rating: 5 } },
        { title: 'Familia Ledesma', description: 'Los 15 de mi hija salieron perfectos.', meta: { rating: 5 } },
        { title: 'Grupo Ancla', description: 'Muy profesional para nuestro evento de fin de año.', meta: { rating: 5 } },
      ],
    },
  },
  'ong-fundacion': {
    siteName: 'Fundación Raíces',
    heroTitle: 'Trabajamos por el barrio',
    heroSubtitle: 'Apoyo escolar y merendero para 120 chicos.',
    aboutText: 'Doce años de trabajo sostenido en La Matanza.',
    phone: TEL,
    address: 'La Matanza, GBA',
    openingHours: 'Lun a Vie · 14 a 19',
    samples: {
      feature: [
        { title: 'Apoyo escolar', description: 'Lunes a viernes, primaria y secundaria.' },
        { title: 'Merienda diaria', description: '120 chicos por día.' },
        { title: 'Talleres de oficio', description: 'Carpintería y costura para adultos.' },
      ],
      team: equipo('Marta Quiroga', 'Julián Paz', 'Rosa Benítez'),
      faq: faqs([
        ['¿Cómo puedo colaborar?', 'Con una donación mensual, con mercadería o como voluntario.'],
        ['¿Son una ONG registrada?', 'Sí, somos asociación civil con personería jurídica.'],
        ['¿Se puede deducir la donación?', 'Sí, emitimos el comprobante correspondiente.'],
      ]),
    },
  },
};

/** Identidad de ejemplo, con un fallback para no romper nunca la preview. */
export function getDemoIdentity(templateId: string): DemoIdentity {
  return (
    DEMOS[templateId] ?? {
      siteName: 'Tu Negocio',
      heroTitle: 'Bienvenidos',
      heroSubtitle: 'Así se va a ver tu sitio.',
      aboutText: 'Contá acá la historia de tu negocio.',
      phone: TEL,
      address: 'Tu dirección',
      openingHours: 'Lun a Vie · 9 a 18',
      samples: {},
    }
  );
}

/**
 * Construye los site_items de ejemplo respetando qué colecciones declara la
 * plantilla en TEMPLATE_COLLECTIONS: si mañana se le agrega una colección a
 * una plantilla, la preview la muestra sin tocar este archivo.
 */
export function buildDemoItems(templateId: string) {
  const identidad = getDemoIdentity(templateId);
  const kinds = TEMPLATE_COLLECTIONS[templateId] ?? [];

  return kinds.flatMap((kind, kindIndex) => {
    const seeds = identidad.samples[kind] ?? [];
    return seeds.map((seed, i) => ({
      id: `demo-${templateId}-${kind}-${i}`,
      kind,
      title: seed.title,
      subtitle: seed.subtitle ?? null,
      description: seed.description ?? null,
      price: seed.price ?? null,
      image_url: null,
      meta: seed.meta ?? {},
      sort_order: kindIndex * 100 + i,
    }));
  });
}

/** Catálogo de ejemplo para tienda-catalogo, que no usa site_items. */
export function buildDemoCatalog() {
  const categorias = [
    { id: 'demo-cat-1', name: 'Living', slug: 'living', sort_order: 0 },
    { id: 'demo-cat-2', name: 'Dormitorio', slug: 'dormitorio', sort_order: 1 },
    { id: 'demo-cat-3', name: 'Escritorio', slug: 'escritorio', sort_order: 2 },
  ];

  const productos = [
    { name: 'Mesa ratona de pino', price: 145000, compare_at_price: 180000, category_id: 'demo-cat-1', is_featured: true },
    { name: 'Biblioteca 5 estantes', price: 230000, compare_at_price: null, category_id: 'demo-cat-1', is_featured: false },
    { name: 'Respaldo de cama 2 plazas', price: 195000, compare_at_price: null, category_id: 'demo-cat-2', is_featured: true },
    { name: 'Mesa de luz', price: 78000, compare_at_price: 95000, category_id: 'demo-cat-2', is_featured: false },
    { name: 'Escritorio con cajonera', price: 210000, compare_at_price: null, category_id: 'demo-cat-3', is_featured: false },
    { name: 'Estante flotante', price: 42000, compare_at_price: null, category_id: 'demo-cat-3', is_featured: false },
  ].map((p, i) => ({
    id: `demo-prod-${i}`,
    category_id: p.category_id,
    name: p.name,
    slug: `demo-${i}`,
    description: 'Fabricación propia. Consultá por medidas a pedido.',
    price: p.price,
    compare_at_price: p.compare_at_price,
    image_url: null,
    image_urls: [],
    in_stock: true,
    is_featured: p.is_featured,
    sort_order: i,
  }));

  return {
    products: productos,
    categories: categorias,
    settings: {
      banner_title: 'Muebles de fabricación propia',
      banner_subtitle: 'Envíos a todo el país · Hasta 6 cuotas sin interés',
      banner_image_url: null,
      whatsapp: '5491155551234',
    },
  };
}
