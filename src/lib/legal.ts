/* ─────────────────────────────────────────────────────────────────────────
 * Documentos legales de SitioListo
 *
 * Viven en el repo a propósito: cada cambio queda en el historial de git con
 * fecha y autor. Si alguna vez se discute qué decían los términos en una
 * fecha dada, la respuesta es un `git log`, no la memoria de nadie.
 *
 * ⚠ REDACTADOS POR UN DESARROLLADOR, NO POR UN ABOGADO.
 * Están pensados para que un profesional los revise y corrija, no para
 * publicarse tal cual. Todo lo que dice [COMPLETAR] son datos que no se
 * pueden inventar: razón social, CUIT, domicilio y condición fiscal.
 *
 * Normativa argentina que se tuvo en cuenta:
 *   - Ley 24.240 de Defensa del Consumidor
 *   - Resolución 424/2020 (Botón de Arrepentimiento, obligatorio y visible)
 *   - Resolución 316/2018 (la baja tiene que ser tan simple como el alta)
 *   - Ley 25.326 de Protección de los Datos Personales
 * ───────────────────────────────────────────────────────────────────────── */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  /** Una línea para el <meta description> y el índice. */
  summary: string;
  /** ISO. Se muestra como "última actualización". */
  updatedAt: string;
  sections: LegalSection[];
};

const CONTACTO = 'contacto@sitiolisto.com.ar';
const ACTUALIZADO = '2026-09-27';

/** Datos del prestador. Un solo lugar: los tres documentos los referencian. */
const PRESTADOR = [
  'Razón social: [COMPLETAR]',
  'CUIT: [COMPLETAR]',
  'Domicilio: [COMPLETAR]',
  'Condición fiscal: [COMPLETAR]',
  `Correo de contacto: ${CONTACTO}`,
];

const TERMINOS: LegalDoc = {
  slug: 'terminos',
  title: 'Términos y Condiciones',
  summary:
    'Condiciones de contratación del servicio de creación y alojamiento de sitios web de SitioListo.',
  updatedAt: ACTUALIZADO,
  sections: [
    {
      heading: 'Quiénes somos',
      paragraphs: [
        'SitioListo es un servicio de creación y alojamiento de sitios web operado por:',
      ],
      list: PRESTADOR,
    },
    {
      heading: 'Qué incluye el servicio',
      paragraphs: [
        'SitioListo te permite elegir una plantilla, personalizarla con tus textos, colores e imágenes, y publicarla en internet sin escribir código.',
        'Según el plan contratado, el servicio incluye una cantidad determinada de sitios, secciones y plantillas disponibles, con o sin dominio propio. Las condiciones vigentes de cada plan están publicadas en la página de precios y forman parte de estos términos.',
      ],
    },
    {
      heading: 'Contratación, precios y facturación',
      paragraphs: [
        'La contratación se hace desde el panel, eligiendo un plan y completando el pago. Los precios se expresan en pesos argentinos e incluyen los impuestos aplicables.',
        'El cobro es una suscripción de débito recurrente procesada por Mercado Pago. SitioListo no almacena los datos de tu tarjeta: esa información la maneja exclusivamente Mercado Pago.',
        'Por cada cobro se emite el comprobante fiscal correspondiente al correo electrónico registrado en tu cuenta.',
        'Los precios pueden modificarse. Cualquier cambio se comunica con al menos 30 días de anticipación al correo registrado, y podés dar de baja el servicio antes de que entre en vigencia sin costo alguno.',
      ],
    },
    {
      heading: 'Prueba gratuita',
      paragraphs: [
        'El plan Básico incluye 14 días de prueba sin cargo. Durante ese período podés cancelar en cualquier momento sin que se genere ningún cobro.',
        'Si no cancelás antes de que termine la prueba, la suscripción se activa y se realiza el primer cobro.',
      ],
    },
    {
      heading: 'Renovación, baja y arrepentimiento',
      paragraphs: [
        'La suscripción se renueva automáticamente por períodos iguales al contratado, hasta que la des de baja.',
        'Podés dar de baja el servicio en cualquier momento desde tu panel, en la sección Suscripción, sin necesidad de llamar ni escribir a nadie. La baja surte efecto al final del período ya abonado: conservás el acceso hasta esa fecha.',
        'Además, si contrataste hace menos de 10 días corridos, tenés derecho a arrepentirte de la compra y recibir el reintegro de lo abonado. Ese derecho está explicado en detalle en el documento de Arrepentimiento y baja.',
      ],
    },
    {
      heading: 'Tus obligaciones como usuario',
      list: [
        'Brindar datos verdaderos al registrarte y mantenerlos actualizados.',
        'Cuidar tu contraseña: sos responsable de la actividad que ocurra en tu cuenta.',
        'Ser titular de los derechos sobre los textos, imágenes y marcas que publiques, o contar con autorización para usarlos.',
        'Usar el servicio conforme a la ley argentina.',
      ],
    },
    {
      heading: 'Contenido que no se permite',
      paragraphs: [
        'No podés usar SitioListo para publicar contenido que sea ilícito, que infrinja derechos de terceros, que promueva la discriminación o la violencia, que constituya una estafa o suplantación de identidad, ni para distribuir software malicioso o hacer envíos masivos no solicitados.',
        'Si detectamos un incumplimiento te lo notificamos y te damos un plazo razonable para corregirlo, salvo que la gravedad o una orden judicial exijan actuar de inmediato.',
      ],
    },
    {
      heading: 'Propiedad del contenido',
      paragraphs: [
        'El contenido que cargás es y sigue siendo tuyo. No lo usamos con otro fin que prestarte el servicio, ni lo cedemos a terceros con fines comerciales.',
        'Las plantillas, el código y la marca SitioListo son de titularidad del prestador. Contratar un plan te da derecho a usar las plantillas dentro del servicio, no a revenderlas ni a redistribuirlas por fuera.',
        'Si das de baja el servicio podés exportar o copiar tus contenidos antes de la fecha de baja. Pasados 30 días de la baja, los datos pueden eliminarse de forma definitiva.',
      ],
    },
    {
      heading: 'Disponibilidad del servicio',
      paragraphs: [
        'Trabajamos para que el servicio esté disponible de forma continua, pero no podemos garantizar que nunca se interrumpa. Puede haber cortes por mantenimiento, por fallas de proveedores de infraestructura o por causas ajenas a nuestro control.',
        'Cuando el mantenimiento sea programado, avisamos con anticipación por correo electrónico.',
      ],
    },
    {
      heading: 'Responsabilidad',
      paragraphs: [
        'SitioListo responde por los daños directos que le sean imputables conforme a la normativa vigente. No respondemos por el contenido que publiques ni por el uso que hagas del sitio.',
        'Nada de lo dicho acá limita los derechos que la Ley 24.240 de Defensa del Consumidor te reconoce como consumidor.',
      ],
    },
    {
      heading: 'Cambios en estos términos',
      paragraphs: [
        'Podemos actualizar estos términos. Si el cambio afecta tus derechos u obligaciones de manera sustancial, te avisamos al correo registrado con al menos 30 días de anticipación.',
        'La fecha de la última actualización figura al pie de este documento, y el historial completo de cambios se conserva versionado.',
      ],
    },
    {
      heading: 'Ley aplicable y reclamos',
      paragraphs: [
        'Estos términos se rigen por las leyes de la República Argentina.',
        'Ante cualquier reclamo podés escribirnos primero a ' + CONTACTO + '. También podés acudir al Servicio de Conciliación Previa en las Relaciones de Consumo (COPREC) y a la autoridad de aplicación de defensa del consumidor de tu jurisdicción.',
      ],
    },
  ],
};

const PRIVACIDAD: LegalDoc = {
  slug: 'privacidad',
  title: 'Política de Privacidad',
  summary:
    'Qué datos personales recolecta SitioListo, para qué los usa, con quién los comparte y cómo ejercer tus derechos.',
  updatedAt: ACTUALIZADO,
  sections: [
    {
      heading: 'Responsable de la base de datos',
      paragraphs: ['El responsable del tratamiento de tus datos personales es:'],
      list: PRESTADOR,
    },
    {
      heading: 'Qué datos recolectamos',
      list: [
        'Datos de registro: nombre y correo electrónico.',
        'Datos de tu sitio: subdominio o dominio propio, textos, imágenes y demás contenido que cargues.',
        'Datos de la suscripción: plan contratado, estado y fechas. El identificador de la operación de pago lo provee Mercado Pago.',
        'Datos técnicos mínimos de funcionamiento, como registros de error necesarios para detectar fallas.',
      ],
      paragraphs: [
        'No recolectamos ni almacenamos datos de tarjetas de crédito o débito. Esa información se procesa íntegramente en Mercado Pago y nunca pasa por nuestros servidores.',
      ],
    },
    {
      heading: 'Para qué los usamos',
      list: [
        'Prestarte el servicio: crear tu cuenta, publicar y mantener tu sitio en línea.',
        'Gestionar el cobro de la suscripción y emitir los comprobantes.',
        'Comunicarte cuestiones operativas: estado del pago, vencimientos, cambios en el servicio.',
        'Detectar y corregir fallas técnicas.',
      ],
      paragraphs: [
        'No vendemos tus datos ni los cedemos a terceros con fines publicitarios.',
      ],
    },
    {
      heading: 'Con quién los compartimos',
      paragraphs: [
        'Compartimos datos únicamente con los proveedores necesarios para que el servicio funcione, y solo en la medida en que cada uno lo requiere:',
      ],
      list: [
        'Supabase — base de datos y autenticación.',
        'Mercado Pago — procesamiento de los pagos.',
        'Nuestro proveedor de infraestructura, para el alojamiento de la aplicación y de los sitios publicados.',
      ],
    },
    {
      heading: 'Transferencia internacional',
      paragraphs: [
        'Algunos de estos proveedores pueden almacenar o procesar datos en servidores ubicados fuera de la República Argentina.',
        'Al usar el servicio prestás tu consentimiento para esa transferencia, que se realiza con el fin exclusivo de prestarte el servicio contratado y bajo las medidas de seguridad de cada proveedor.',
      ],
    },
    {
      heading: 'Cuánto tiempo los conservamos',
      paragraphs: [
        'Mientras tu cuenta esté activa. Si das de baja el servicio, conservamos tus datos hasta 30 días después de la fecha de baja para permitirte recuperarlos, y luego los eliminamos.',
        'Los registros exigidos por la normativa fiscal se conservan por el plazo legal que corresponda.',
      ],
    },
    {
      heading: 'Tus derechos',
      paragraphs: [
        'Podés acceder a tus datos, rectificarlos si son inexactos, actualizarlos y solicitar su supresión, conforme a la Ley 25.326 de Protección de los Datos Personales.',
        `Para ejercerlos escribinos a ${CONTACTO}. El titular de los datos tiene derecho a ejercer el derecho de acceso de forma gratuita a intervalos no inferiores a seis meses, salvo que acredite un interés legítimo al efecto (art. 14, inc. 3 de la Ley 25.326).`,
        'La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.',
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'SitioListo usa exclusivamente cookies estrictamente necesarias para el funcionamiento del servicio: las que mantienen tu sesión iniciada y las que recuerdan tu preferencia de tema claro u oscuro.',
        'No utilizamos cookies de analítica, de publicidad ni de seguimiento, ni de terceros con esos fines. Por eso no verás un cartel de consentimiento: no hay nada que consentir más allá de lo indispensable para que el servicio funcione.',
        'Si en el futuro incorporamos herramientas de medición, actualizaremos esta política y solicitaremos tu consentimiento previo.',
      ],
    },
    {
      heading: 'Seguridad',
      paragraphs: [
        'Todo el tráfico viaja cifrado con HTTPS. El acceso a la base de datos está restringido por políticas que limitan a cada usuario a sus propios datos, y las contraseñas se almacenan de forma cifrada por nuestro proveedor de autenticación.',
        'Ningún sistema es infalible. Si detectamos un incidente que afecte tus datos personales, te lo notificaremos.',
      ],
    },
    {
      heading: 'Cambios en esta política',
      paragraphs: [
        'Si modificamos esta política, publicamos la nueva versión en esta misma página y actualizamos la fecha del pie. Si el cambio es sustancial, te avisamos al correo registrado.',
      ],
    },
  ],
};

const ARREPENTIMIENTO: LegalDoc = {
  slug: 'arrepentimiento',
  title: 'Arrepentimiento y baja',
  summary:
    'Cómo arrepentirte de la compra dentro de los 10 días y cómo dar de baja el servicio en cualquier momento.',
  updatedAt: ACTUALIZADO,
  sections: [
    {
      heading: 'Botón de arrepentimiento',
      paragraphs: [
        'Si contrataste un plan hace menos de 10 días corridos, podés arrepentirte de la compra y recibir el reintegro de lo abonado, sin costo ni justificación.',
        'Este derecho está previsto en el artículo 34 de la Ley 24.240 de Defensa del Consumidor y en la Resolución 424/2020 de la Secretaría de Comercio Interior.',
      ],
    },
    {
      heading: 'Cómo ejercerlo',
      paragraphs: [
        'Tenés dos caminos, y los dos valen igual:',
      ],
      list: [
        'Desde tu panel: ingresá a la sección Suscripción y usá la opción de cancelación. Es el camino más rápido.',
        `Por correo: escribinos a ${CONTACTO} indicando tu nombre, el correo de tu cuenta y que querés ejercer el derecho de arrepentimiento.`,
      ],
      // El plazo de 10 días hábiles para el reintegro sale de la Res. 424/2020.
    },
    {
      heading: 'Reintegro',
      paragraphs: [
        'Procesamos el reintegro dentro de los 10 días hábiles de recibida tu solicitud, por la misma vía que usaste para pagar.',
        'El servicio se da de baja de inmediato y el sitio deja de publicarse.',
      ],
    },
    {
      heading: 'Baja del servicio',
      paragraphs: [
        'La baja es distinta del arrepentimiento: podés darte de baja en cualquier momento, hayan pasado los 10 días o no.',
        'Se hace desde tu panel, en la sección Suscripción, con la misma facilidad con la que contrataste. No hace falta llamar por teléfono ni esperar la respuesta de nadie.',
        'La baja detiene la renovación automática. Conservás el acceso hasta el final del período que ya abonaste, y a partir de ahí no se generan nuevos cobros.',
      ],
    },
    {
      heading: 'Tus datos después de la baja',
      paragraphs: [
        'Conservamos tu contenido durante 30 días desde la baja, por si querés recuperarlo o reactivar el servicio. Pasado ese plazo, se elimina de forma definitiva.',
      ],
    },
  ],
};

export const LEGAL_DOCS: LegalDoc[] = [TERMINOS, PRIVACIDAD, ARREPENTIMIENTO];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}

/** Links para el footer, en el orden en que se muestran. */
export const LEGAL_LINKS = LEGAL_DOCS.map((d) => ({
  href: `/legal/${d.slug}`,
  label: d.title,
}));
