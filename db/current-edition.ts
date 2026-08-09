export type CurrentEditionArticle = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  categorySlug: string;
  heroImageUrl: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  publishedAt: string;
};

const sourceLine = (name: string, url: string) => `Fuente consultada: ${name} | ${url}`;

const baseCurrentEditionArticles: CurrentEditionArticle[] = [
  {
    title: "La economía dominicana acelera y crece 6.4 % en junio",
    slug: "economia-dominicana-crece-64-por-ciento-junio-2026",
    summary: "El Banco Central reportó el mejor ritmo mensual del año, impulsado por construcción, minería, zonas francas y servicios.",
    body: `La actividad económica de República Dominicana registró una expansión interanual de 6.4 % en junio de 2026, el mayor crecimiento mensual observado en lo que va de año, según el Banco Central.

El desempeño permitió que el trimestre abril-junio cerrara con un avance promedio de 5.0 % y que el primer semestre acumulara un crecimiento de 4.5 %. La construcción, con 14.9 %, y la minería, con 18.1 %, estuvieron entre los sectores de mayor dinamismo.

El dato confirma una recuperación más firme, aunque la economía sigue expuesta a los precios internacionales del petróleo, los costos del transporte y la incertidumbre externa. Para los hogares, la clave será que el crecimiento se traduzca en empleos, ingresos y estabilidad de precios.

${sourceLine("Banco Central de la República Dominicana", "https://www.bancentral.gov.do/a/d/6618-economia-dominicana-registra-expansion-de-64--en-junio-2026")}`,
    categorySlug: "economia",
    heroImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=88",
    isBreaking: true,
    isFeatured: true,
    publishedAt: "2026-08-05T20:20:00.000Z",
  },
  {
    title: "Marileidy Paulino lidera el oro dominicano en el relevo mixto 4x400",
    slug: "marileidy-paulino-oro-relevo-mixto-santo-domingo-2026",
    summary: "La cuarteta anfitriona se impuso en Santo Domingo 2026 y convirtió la final en uno de los momentos centrales de los Juegos.",
    body: `República Dominicana conquistó el oro en el relevo mixto 4x400 metros de los Juegos Centroamericanos y del Caribe Santo Domingo 2026 con un equipo integrado por Marileidy Paulino, Christopher Melenciano, Anabel Medina y Erick Sánchez.

El resultado reunió a figuras consagradas y atletas que han superado barreras extraordinarias. Melenciano, velocista con discapacidad auditiva, ya había hecho historia en los Sordolímpicos y volvió a ser determinante en una gran cita regional.

Más allá de la medalla, la victoria confirma la profundidad del atletismo dominicano y el valor de competir en casa ante una afición que ha acompañado cada jornada.

${sourceLine("AS", "https://as.com/us/masdeporte/nacio-con-discapacidad-auditiva-hizo-historia-en-los-sordolimpicos-y-hoy-brilla-con-el-oro-dominicano-f202608-n/")}`,
    categorySlug: "deportes",
    heroImageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=88",
    isBreaking: true,
    isFeatured: true,
    publishedAt: "2026-08-05T20:10:00.000Z",
  },
  {
    title: "Wall Street cierra cerca de máximos mientras el petróleo mantiene la atención mundial",
    slug: "wall-street-maximos-petroleo-atencion-mundial-agosto-2026",
    summary: "Los mercados terminaron mixtos entre expectativas diplomáticas, resultados empresariales y cautela ante las tecnológicas.",
    body: `Las principales bolsas de Estados Unidos cerraron cerca de niveles récord en una jornada marcada por las expectativas de un acuerdo que alivie las tensiones en torno al estrecho de Ormuz.

El Dow Jones avanzó, mientras el S&P 500 y el Nasdaq retrocedieron ligeramente. Los resultados de empresas de turismo y entretenimiento sostuvieron parte del mercado, pero varias compañías tecnológicas cayeron después de fuertes avances recientes.

Para economías importadoras de energía como República Dominicana, la evolución del crudo sigue siendo decisiva: influye sobre combustibles, transporte, producción e inflación.

${sourceLine("Associated Press", "https://apnews.com/article/53179dc1c0148c5afeb47379b8f5b5c5")}`,
    categorySlug: "mundo",
    heroImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=88",
    isFeatured: true,
    publishedAt: "2026-08-05T20:00:00.000Z",
  },
  {
    title: "El Código Penal entra en una etapa decisiva entre aplicación y nuevas reformas",
    slug: "codigo-penal-etapa-decisiva-aplicacion-reformas-2026",
    summary: "El país llega a agosto con una reforma penal de gran alcance y un debate abierto sobre ajustes, derechos y seguridad.",
    body: `La entrada en vigor del nuevo Código Penal ha colocado en primer plano el mayor cambio de la legislación penal dominicana en más de un siglo. La norma incorpora nuevos tipos penales vinculados con crimen organizado, delitos digitales, violencia y fraudes modernos.

Durante las últimas semanas, legisladores, juristas, gremios y organizaciones sociales han discutido modificaciones relacionadas con libertad de expresión, responsabilidad médica, difamación y responsabilidad de las personas jurídicas.

El desafío no termina con la fecha de aplicación. La justicia necesitará capacitación, criterios uniformes y seguimiento público para que la nueva normativa fortalezca la seguridad sin debilitar garantías fundamentales.

${sourceLine("Diario Libre", "https://www.diariolibre.com/politica/congreso-nacional/2026/07/15/comision-bicameral-revisa-modificaciones-codigo-penal/3601002")}`,
    categorySlug: "politica",
    heroImageUrl: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1600&q=88",
    isFeatured: true,
    publishedAt: "2026-08-05T19:50:00.000Z",
  },
  {
    title: "Santo Domingo 2026 convierte al país en la capital deportiva del Caribe",
    slug: "santo-domingo-2026-capital-deportiva-caribe",
    summary: "Más de seis mil atletas y decenas de disciplinas mantienen al país en el centro de la conversación regional.",
    body: `Los XXV Juegos Centroamericanos y del Caribe reúnen en República Dominicana a más de seis mil atletas de 37 delegaciones, con un programa de 40 deportes y 56 disciplinas.

La competencia, que se extiende hasta el 8 de agosto, representa una oportunidad para medir el nivel de los atletas dominicanos y también para evaluar la organización, movilidad, infraestructura y experiencia del público.

El reto de largo plazo será convertir las instalaciones, el conocimiento operativo y el entusiasmo ciudadano en programas permanentes para la juventud y las federaciones.

${sourceLine("Presidencia de la República Dominicana", "https://presidencia.gob.do/noticias/gobierno-anuncia-incentivos-economicos-para-medallistas-dominicanos-en-los-juegos")}`,
    categorySlug: "nacionales",
    heroImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=88",
    isFeatured: true,
    publishedAt: "2026-08-05T19:40:00.000Z",
  },
  {
    title: "La inteligencia artificial vuelve a impulsar el optimismo en los mercados",
    slug: "inteligencia-artificial-impulsa-optimismo-mercados-agosto-2026",
    summary: "El gasto de las grandes tecnológicas en infraestructura de IA sostiene una nueva ola de inversión y eleva el debate sobre su rentabilidad.",
    body: `Las empresas relacionadas con inteligencia artificial y semiconductores han liderado el repunte de los mercados al comenzar agosto, en medio de resultados corporativos que muestran un aumento de la inversión tecnológica.

Microsoft, Google, Amazon y Meta proyectan cientos de miles de millones de dólares en infraestructura de IA. El mercado ahora exige pruebas de que esa inversión puede traducirse en nuevos ingresos y productividad.

La tendencia abre oportunidades para profesionales y empresas, pero también intensifica la necesidad de formación digital, protección de datos y reglas claras para el uso responsable de sistemas automatizados.

${sourceLine("Barron's", "https://www.barrons.com/articles/stock-market-august-rally-ai-trade-5bf2c0b4")}`,
    categorySlug: "planeta",
    heroImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=88",
    isFeatured: true,
    publishedAt: "2026-08-05T19:30:00.000Z",
  },
  {
    title: "Outside Lands prepara una edición global con transmisión en directo",
    slug: "outside-lands-2026-transmision-directo-cartelera",
    summary: "El festival de San Francisco reunirá a Charli XCX, The Strokes, Rüfüs Du Sol y decenas de artistas del 7 al 9 de agosto.",
    body: `Outside Lands 2026 abrirá sus escenarios en el Golden Gate Park de San Francisco con una cartelera que cruza pop, rock, música electrónica y propuestas independientes.

La edición contará con presentaciones de Charli XCX, The Strokes, Rüfüs Du Sol, The xx, Turnstile y otros artistas. La organización confirmó una transmisión digital en dos canales para ampliar el alcance del festival.

La estrategia refleja cómo los grandes eventos musicales combinan la experiencia presencial con audiencias globales que siguen conciertos desde teléfonos, televisores y plataformas sociales.

${sourceLine("Pitchfork", "https://pitchfork.com/story/outside-lands-2026-amazon-music-livestream-schedule-and-details")}`,
    categorySlug: "entretenimiento",
    heroImageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=88",
    isFeatured: true,
    publishedAt: "2026-08-05T19:20:00.000Z",
  },

  {
    title: "Turismo supera 4.9 millones de visitantes en el primer semestre",
    slug: "turismo-supera-49-millones-visitantes-primer-semestre-2026",
    summary: "La llegada de pasajeros internacionales creció 10 % y reforzó el peso del turismo en la recuperación económica.",
    body: `República Dominicana recibió 4,963,343 visitantes internacionales durante el primer semestre de 2026, una expansión de 10 % frente al mismo período del año anterior.

Solo en junio llegaron 816,512 turistas por vía aérea. Hoteles, bares y restaurantes crecieron 4.6 % en ese mes, de acuerdo con los datos del Banco Central.

El avance fortalece la generación de divisas y empleo, pero también aumenta la importancia de diversificar destinos, mejorar servicios y proteger los recursos naturales que sostienen la oferta turística.

${sourceLine("Banco Central de la República Dominicana", "https://www.bancentral.gov.do/a/d/6618-economia-dominicana-registra-expansion-de-64--en-junio-2026")}`,
    categorySlug: "economia",
    heroImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T19:10:00.000Z",
  },
  {
    title: "Christopher Melenciano: del silencio de las barreras al oro regional",
    slug: "christopher-melenciano-historia-oro-regional-relevo",
    summary: "El velocista dominicano con discapacidad auditiva volvió a hacer historia como integrante del relevo mixto campeón.",
    body: `Christopher Melenciano fue pieza del equipo dominicano que ganó el relevo mixto 4x400 en Santo Domingo 2026, junto a Marileidy Paulino, Anabel Medina y Erick Sánchez.

Su trayectoria ya incluía un hito: ser el primer dominicano con discapacidad auditiva en conquistar medallas en unos Juegos Sordolímpicos, con oro en 200 metros y plata en 400.

Su presencia en una final regional de primer nivel envía un mensaje que trasciende la pista: la inclusión deportiva necesita oportunidades, entrenadores, recursos y visibilidad sostenida.

${sourceLine("AS", "https://as.com/us/masdeporte/nacio-con-discapacidad-auditiva-hizo-historia-en-los-sordolimpicos-y-hoy-brilla-con-el-oro-dominicano-f202608-n/")}`,
    categorySlug: "deportes",
    heroImageUrl: "https://images.unsplash.com/photo-1530137073520-4ea6e2f10a48?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T19:00:00.000Z",
  },
  {
    title: "Brasil llega a una decisión de tasas con inflación todavía resistente",
    slug: "brasil-decision-tasas-inflacion-agosto-2026",
    summary: "Analistas anticipan un cuarto recorte consecutivo, aunque el banco central mantendría una comunicación prudente.",
    body: `El Banco Central de Brasil llega a su reunión de agosto con la expectativa mayoritaria de reducir nuevamente la tasa Selic, según un sondeo de economistas.

El escenario base apunta a un recorte moderado, desde 14.25 % a 14.00 %, después de tres reducciones consecutivas. La inflación y el calendario electoral limitan el espacio para acelerar el ciclo.

La decisión importa para América Latina porque Brasil influye sobre flujos de inversión, monedas regionales, comercio y expectativas de política monetaria.

${sourceLine("Reuters", "https://www.reuters.com/world/americas/brazil-central-bank-cut-rates-fourth-straight-meeting-august-5-2026-08-03/")}`,
    categorySlug: "mundo",
    heroImageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T18:50:00.000Z",
  },
  {
    title: "Las reformas del Código Penal ponen a prueba la calidad del debate público",
    slug: "reformas-codigo-penal-calidad-debate-publico",
    summary: "Las observaciones de juristas, médicos, periodistas y organizaciones sociales obligan a explicar cada cambio con precisión.",
    body: `El proceso de revisión del Código Penal recibió decenas de propuestas sobre libertad de expresión, delitos digitales, negligencia médica y responsabilidad penal de empresas e instituciones.

Una comisión bicameral estudió las observaciones mientras el calendario de entrada en vigor reducía el margen para alcanzar consensos. El volumen de temas confirma que la reforma no puede comunicarse solo con consignas.

La ciudadanía necesita conocer qué conductas se penalizan, cuáles garantías permanecen y cómo se aplicarán las nuevas figuras. Esa pedagogía es una responsabilidad compartida del Congreso, la justicia, la academia y los medios.

${sourceLine("Diario Libre", "https://www.diariolibre.com/politica/congreso-nacional/2026/07/08/proyectos-de-modificacion-codigo-penal-en-discusion/3593957")}`,
    categorySlug: "politica",
    heroImageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T18:40:00.000Z",
  },
  {
    title: "La gran cita deportiva deja una agenda de movilidad, seguridad y servicios",
    slug: "santo-domingo-2026-agenda-movilidad-seguridad-servicios",
    summary: "La celebración de los Juegos exige coordinación diaria y abre una conversación sobre la ciudad que quedará después del evento.",
    body: `La operación de Santo Domingo 2026 reúne competencias, delegaciones, voluntarios y público en distintos puntos del Gran Santo Domingo.

El movimiento de miles de personas convierte la movilidad, señalización, seguridad, atención médica y transporte en parte esencial del desempeño del país como anfitrión.

La experiencia puede dejar protocolos útiles para futuros eventos y también identificar mejoras permanentes en el espacio público. El legado se medirá por lo que continúe funcionando cuando termine la última competencia.

${sourceLine("Centro Caribe Sports", "https://centrocaribesports.org/en/news/expo-santo-domingo-2026-officially-opens/")}`,
    categorySlug: "nacionales",
    heroImageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T18:30:00.000Z",
  },
  {
    title: "Europa activa una nueva vigilancia contra deepfakes y abusos de la IA",
    slug: "europa-vigilancia-deepfakes-abusos-inteligencia-artificial",
    summary: "Un equipo especializado supervisará el cumplimiento de la Ley de IA y podrá recibir denuncias confidenciales.",
    body: `La Unión Europea puso en marcha una unidad de vigilancia para controlar el cumplimiento de sus nuevas reglas de inteligencia artificial.

La regulación exige identificar contenidos generados por IA y busca responder a riesgos como deepfakes, ataques informáticos, material ilícito y manipulación de derechos fundamentales.

El modelo europeo será observado por gobiernos y empresas de otras regiones. Para los usuarios, la discusión central es cómo combinar innovación, transparencia, privacidad y mecanismos efectivos de reclamación.

${sourceLine("Associated Press", "https://apnews.com/article/f4fcee1f9750e2b32cdf26ad73ee5ec2")}`,
    categorySlug: "planeta",
    heroImageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T18:20:00.000Z",
  },
  {
    title: "BTS regresa a Nueva York y convierte la espera de siete años en celebración",
    slug: "bts-regresa-nueva-york-concierto-2026",
    summary: "La vuelta del grupo al área de Nueva York reunió a seguidores de distintas generaciones en MetLife Stadium.",
    body: `BTS volvió a presentar un concierto completo en el área de Nueva York después de siete años, en una jornada marcada por la emoción de sus seguidores.

La comunidad ARMY organizó proyectos de bienvenida y distribuyó miles de flores simbólicas. El grupo combinó canciones conocidas con temas de su nueva etapa y cerró la noche con fuegos artificiales.

El regreso confirma el alcance global del K-pop y la capacidad de sus comunidades digitales para convertir cada presentación en una experiencia cultural compartida.

${sourceLine("Cosmopolitan", "https://www.cosmopolitan.com/entertainment/music/a73336058/bts-army-new-york-august-2026-return-concert-arirang/")}`,
    categorySlug: "entretenimiento",
    heroImageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T18:10:00.000Z",
  },

  {
    title: "Construcción y minería encabezan el repunte productivo del país",
    slug: "construccion-mineria-repunte-productivo-rd-2026",
    summary: "La construcción creció 14.9 % y explicó cerca de una tercera parte de la expansión económica de junio.",
    body: `La construcción dominicana registró una expansión interanual de 14.9 % en junio, apoyada en proyectos privados y una mayor ejecución de inversión pública.

La minería avanzó 18.1 %, mientras las zonas francas crecieron 5.8 % y los servicios en conjunto 5.2 %. El resultado muestra una recuperación distribuida entre varios motores productivos.

El seguimiento deberá concentrarse en la sostenibilidad del impulso, la calidad del empleo creado y el efecto de los costos internacionales sobre materiales, energía y financiamiento.

${sourceLine("Banco Central de la República Dominicana", "https://www.bancentral.gov.do/a/d/6618-economia-dominicana-registra-expansion-de-64--en-junio-2026")}`,
    categorySlug: "economia",
    heroImageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T18:00:00.000Z",
  },
  {
    title: "Wilfrido De la Cruz entrega a República Dominicana su primer oro en taekwondo",
    slug: "wilfrido-de-la-cruz-primer-oro-taekwondo-santo-domingo-2026",
    summary: "El dominicano ganó la categoría de -54 kilogramos y abrió la cuenta dorada del país anfitrión en la disciplina.",
    body: `Wilfrido De la Cruz conquistó el título de -54 kilogramos en el taekwondo de Santo Domingo 2026 al superar 2-0 al hondureño Derek Midence.

El resultado representó la primera medalla de oro de República Dominicana en la disciplina durante estos Juegos. México dominó buena parte de la jornada con tres campeonatos, mientras Costa Rica y Venezuela también subieron a lo más alto.

La actuación dominicana confirma la importancia de las disciplinas de combate dentro del programa competitivo nacional.

${sourceLine("Centro Caribe Sports", "https://centrocaribesports.org/noticias/taekwondo-corona-a-sus-primeros-seis-campeones-en-santo-domingo-2026/")}`,
    categorySlug: "deportes",
    heroImageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T17:50:00.000Z",
  },
  {
    title: "El petróleo vuelve a medir la resistencia de la economía mundial",
    slug: "petroleo-mide-resistencia-economia-mundial-agosto-2026",
    summary: "El crudo oscila alrededor de los 80 dólares mientras los mercados reaccionan a señales diplomáticas y nuevos focos de tensión.",
    body: `Los precios internacionales del petróleo mantuvieron una jornada volátil, con movimientos asociados a las negociaciones en Medio Oriente y a la seguridad de las rutas energéticas.

El impacto ya se refleja en combustibles y transporte en varios países. Al mismo tiempo, las bolsas reaccionan positivamente cuando aumenta la posibilidad de una salida diplomática.

En República Dominicana, un petróleo más caro presiona la inflación, el costo eléctrico y el presupuesto destinado a estabilizar combustibles. Por eso, cada movimiento externo tiene efectos directos sobre hogares y empresas.

${sourceLine("The Guardian", "https://www.theguardian.com/business/live/2026/aug/05/asian-shares-jump-ai-trade-revival-despite-spacex-amd-setbacks-oil-prices-dip-live-updates")}`,
    categorySlug: "mundo",
    heroImageUrl: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T17:40:00.000Z",
  },
  {
    title: "Qué debe saber la ciudadanía sobre los nuevos delitos digitales",
    slug: "guia-ciudadana-nuevos-delitos-digitales-codigo-penal",
    summary: "La reforma penal incorpora conductas vinculadas con chantaje, suplantación, fraudes y difusión abusiva de contenidos.",
    body: `El nuevo marco penal dominicano incorpora figuras que responden a conductas surgidas o amplificadas por internet, las redes sociales y los sistemas digitales.

Entre los temas discutidos aparecen el chantaje con imágenes, la clonación de tarjetas, las estafas piramidales, el ciberacoso y otras formas de fraude. La aplicación requerirá investigación técnica y preservación adecuada de evidencias.

Para la ciudadanía, la primera protección sigue siendo preventiva: verificar identidades, proteger cuentas, conservar pruebas y acudir a las autoridades cuando exista amenaza, extorsión o uso no autorizado de información.

${sourceLine("Diario Libre", "https://www.diariolibre.com/politica/gobierno/2025/08/04/abinader-promulga-el-codigo-penal-y-rompe-letargo-de-mas-20-anos/3202972")}`,
    categorySlug: "politica",
    heroImageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T17:30:00.000Z",
  },
  {
    title: "La Expo de los Juegos abre una ventana a cien años de historia deportiva",
    slug: "expo-juegos-cien-anos-historia-deportiva-caribe",
    summary: "El Museo del Deporte Dominicano presenta piezas, fotografías y documentos del movimiento centroamericano y caribeño.",
    body: `Una exposición permanente dedicada a la historia de los Juegos Centroamericanos y del Caribe abrió sus puertas en el Museo del Deporte Dominicano.

La muestra reúne objetos, documentos, fotografías y piezas conmemorativas que recorren la evolución del evento regional y el papel de Centro Caribe Sports durante un siglo.

La iniciativa suma una dimensión cultural a Santo Domingo 2026 y permite que estudiantes, atletas y visitantes conozcan el pasado que sostiene la competencia actual.

${sourceLine("Centro Caribe Sports", "https://centrocaribesports.org/en/news/expo-santo-domingo-2026-officially-opens/")}`,
    categorySlug: "nacionales",
    heroImageUrl: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T17:20:00.000Z",
  },
  {
    title: "El 12 de agosto llegará un eclipse total visible en parte del hemisferio norte",
    slug: "eclipse-total-solar-12-agosto-2026-guia-segura",
    summary: "La sombra de la Luna cruzará Groenlandia, Islandia, el norte de España y una pequeña zona de Portugal.",
    body: `Un eclipse total de Sol recorrerá el 12 de agosto una franja que incluye Groenlandia, Islandia, el norte de España, Rusia y una pequeña zona de Portugal.

Otras regiones de Europa, África y América del Norte observarán un eclipse parcial. La totalidad durará menos de dos minutos y medio en la mayoría de los puntos de la trayectoria.

NASA recuerda que durante las fases parciales se deben usar visores solares certificados. Las gafas de sol comunes no ofrecen protección suficiente y nunca se debe mirar el Sol mediante cámaras o telescopios sin filtros apropiados.

${sourceLine("NASA", "https://science.nasa.gov/eclipses/future-eclipses/total-solar-eclipse-on-august-12-2026/")}`,
    categorySlug: "planeta",
    heroImageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T17:10:00.000Z",
  },
  {
    title: "The Voice prepara una edición con celebridades y Keke Palmer como anfitriona",
    slug: "the-voice-celebrity-keke-palmer-nueva-edicion",
    summary: "La franquicia cambiará concursantes desconocidos por figuras del deporte, la música, la actuación y las redes.",
    body: `NBC prepara para 2027 una nueva versión de su competencia musical bajo el nombre The Voice: Celebrity.

Keke Palmer asumirá la conducción y el panel de entrenadores incluirá a Queen Latifah, Riley Green y Joe Jonas. La lista de concursantes todavía no ha sido anunciada.

El formato refleja la búsqueda de las cadenas tradicionales por crear eventos capaces de circular al mismo tiempo en televisión, plataformas y redes sociales.

${sourceLine("People", "https://people.com/the-voice-celebrity-everything-to-know-12034529")}`,
    categorySlug: "entretenimiento",
    heroImageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T17:00:00.000Z",
  },

  {
    title: "La tasa de política monetaria se mantiene en 5.25 %",
    slug: "tasa-politica-monetaria-rd-525-julio-2026",
    summary: "El Banco Central pondera la recuperación económica, la inflación y el impacto de los precios internacionales de la energía.",
    body: `La tasa de política monetaria de República Dominicana se mantiene en 5.25 % anual, mientras la facilidad de expansión de liquidez permanece en 5.75 % y los depósitos remunerados en 4.50 %.

La autoridad monetaria tomó en cuenta la recuperación gradual de la economía y las presiones inflacionarias asociadas al choque petrolero internacional.

La decisión influye sobre el costo del crédito, el ahorro y el ritmo de actividad. Su efecto final dependerá también de las tasas bancarias, la liquidez y la evolución de los precios.

${sourceLine("Banco Central de la República Dominicana", "https://www.bancentral.gov.do/a/d/6606-bcrd-mantiene-su-tasa-de-politica-monetaria-en-525--anual")}`,
    categorySlug: "economia",
    heroImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T16:50:00.000Z",
  },
  {
    title: "Los medallistas dominicanos recibirán incentivos económicos por sus resultados",
    slug: "incentivos-medallistas-dominicanos-santo-domingo-2026",
    summary: "El oro individual será premiado con RD$300,000; también habrá montos definidos para plata, bronce y deportes de equipo.",
    body: `El Gobierno anunció incentivos para los atletas dominicanos que conquisten medallas en Santo Domingo 2026.

En deportes individuales, el oro recibirá RD$300,000, la plata RD$150,000 y el bronce RD$100,000. Para las disciplinas por equipos se establecieron premios de RD$3.2 millones, RD$2.8 millones y RD$1.6 millones.

El reconocimiento económico acompaña el valor deportivo de cada resultado. El reto permanente es sostener el apoyo durante todo el ciclo de preparación y no solo después del podio.

${sourceLine("Presidencia de la República Dominicana", "https://presidencia.gob.do/noticias/gobierno-anuncia-incentivos-economicos-para-medallistas-dominicanos-en-los-juegos")}`,
    categorySlug: "deportes",
    heroImageUrl: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T16:40:00.000Z",
  },
  {
    title: "El cobre alcanza un récord impulsado por la demanda tecnológica",
    slug: "cobre-record-demanda-tecnologica-inteligencia-artificial",
    summary: "La expansión de centros de datos y las restricciones de oferta elevan el precio de un metal esencial para la electrificación.",
    body: `El cobre alcanzó nuevos máximos en los mercados internacionales en medio de una fuerte demanda asociada con infraestructura digital, redes eléctricas y centros de datos.

La interrupción de producción en algunas minas y la reducción de inventarios fuera de Estados Unidos aumentaron la presión sobre la oferta.

El movimiento muestra la relación entre el crecimiento de la inteligencia artificial y los recursos físicos que la hacen posible. Más computación también significa más energía, cableado, minerales y capacidad industrial.

${sourceLine("The Wall Street Journal", "https://www.wsj.com/finance/commodities-futures/gold-rises-as-markets-weigh-middle-east-uncertainty-bd032b9b")}`,
    categorySlug: "mundo",
    heroImageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T16:30:00.000Z",
  },
  {
    title: "Gobierno y Congreso enfrentan el reto de explicar una reforma de 393 artículos",
    slug: "gobierno-congreso-explicar-reforma-penal-393-articulos",
    summary: "La complejidad del nuevo Código Penal exige capacitación para operadores de justicia y una guía comprensible para la ciudadanía.",
    body: `La reforma penal dominicana contiene 393 artículos y sustituye un marco legal que no respondía a muchas formas actuales de criminalidad.

La magnitud del cambio obliga a jueces, fiscales, defensores, policías, abogados y periodistas a actualizar criterios y prácticas. También requiere información pública que evite interpretaciones incorrectas.

Una ley puede ser moderna en el papel y fallar en la práctica si no existen formación, protocolos, recursos técnicos y supervisión. La implementación será tan importante como el texto aprobado.

${sourceLine("Diario Libre", "https://www.diariolibre.com/politica/congreso-nacional/2026/07/09/el-nuevo-codigo-penal-ya-tiene-sus-primeras-propuestas-de-cambio/3593841")}`,
    categorySlug: "politica",
    heroImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T16:20:00.000Z",
  },
  {
    title: "Las instalaciones de los Juegos abren una conversación sobre el legado",
    slug: "instalaciones-juegos-conversacion-legado-santo-domingo-2026",
    summary: "La inversión deportiva será evaluada por su uso futuro, mantenimiento y acceso para atletas y comunidades.",
    body: `La celebración de Santo Domingo 2026 ha concentrado obras, remodelaciones y equipamiento en instalaciones deportivas del país.

Los recintos permiten desarrollar competencias internacionales y mejorar las condiciones para atletas y público. Sin embargo, su valor no termina con la clausura.

El verdadero legado dependerá de planes de mantenimiento, calendarios de uso, acceso comunitario y programas de formación que mantengan activas las instalaciones durante los próximos años.

${sourceLine("Presidencia de la República Dominicana", "https://presidencia.gob.do/noticias/gobierno-fortalece-proyeccion-internacional-y-preparacion-para-santo-domingo-2026")}`,
    categorySlug: "nacionales",
    heroImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T16:10:00.000Z",
  },
  {
    title: "Un antiguo cohete impactará la Luna y científicos intentarán observarlo",
    slug: "etapa-cohete-impacta-luna-observacion-cientifica-2026",
    summary: "El choque previsto cerca del cráter Einstein ofrece una oportunidad para estudiar polvo, destellos e impactos artificiales.",
    body: `Una etapa superior de un cohete Falcon 9 tiene previsto impactar la superficie lunar cerca del cráter Einstein.

Investigadores prepararon una campaña de observación para intentar registrar el destello y la nube de material expulsado. Las características exactas del evento tienen un margen importante de incertidumbre.

El experimento permitirá probar métodos para localizar impactos, estudiar la dinámica del polvo lunar y preparar futuras investigaciones sísmicas en la Luna.

${sourceLine("arXiv / equipo internacional de investigación", "https://arxiv.org/abs/2607.14625")}`,
    categorySlug: "planeta",
    heroImageUrl: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T16:00:00.000Z",
  },
  {
    title: "ZZ Top cancela su concierto en Hollywood Bowl por asuntos de personal",
    slug: "zz-top-cancela-concierto-hollywood-bowl-2026",
    summary: "La banda anunció que no podría superar los obstáculos logísticos; los reembolsos serán automáticos.",
    body: `ZZ Top canceló la presentación que tenía programada en el Hollywood Bowl para el 5 de agosto.

La organización atribuyó la decisión a asuntos imprevistos relacionados con el personal y explicó que los reembolsos se procesarán en el punto de compra. No se ha confirmado una nueva fecha.

Cheap Trick, que formaba parte del cartel, anunció una presentación alternativa en The Troubadour. El resto de la gira de ZZ Top permanece en agenda por el momento.

${sourceLine("Entertainment Weekly", "https://ew.com/zz-top-abruptly-cancel-hollywood-bowl-concert-12035435")}`,
    categorySlug: "entretenimiento",
    heroImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T15:50:00.000Z",
  },
  {
    title: "La ruta de la antorcha conectó los Juegos con todo el territorio nacional",
    slug: "ruta-antorcha-juegos-conecto-territorio-nacional",
    summary: "El fuego centroamericano inició en el Palacio Nacional y llevó el mensaje de Santo Domingo 2026 a las provincias del país.",
    body: `Antes de la apertura de Santo Domingo 2026, la antorcha de los Juegos inició un recorrido nacional desde el Palacio Nacional.

Los medallistas olímpicos Gabriel Mercedes y Crismery Santana participaron en el comienzo de la ruta, concebida para acercar el evento a comunidades fuera de las sedes de competencia.

El recorrido convirtió la preparación deportiva en una celebración territorial y recordó que la condición de anfitrión pertenece a todo el país, no únicamente a la capital.

${sourceLine("Listín Diario", "https://listindiario.com/el-deporte/olimpismo/20260506/inicia-recorrido-antorcha-juegos-centroamericanos-caribe_904713.html")}`,
    categorySlug: "nacionales",
    heroImageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T15:45:00.000Z",
  },

  {
    title: "Crecer más no basta: el desafío es convertir el repunte en bienestar",
    slug: "opinion-crecimiento-repunte-bienestar-rd-2026",
    summary: "El avance del IMAE es una buena señal, pero la calidad del crecimiento se mide en empleo, productividad y poder adquisitivo.",
    body: `El crecimiento de 6.4 % registrado en junio demuestra que la economía dominicana puede recuperar velocidad incluso en un entorno internacional difícil.

Sin embargo, el indicador agregado no responde por sí solo las preguntas de cada familia: cuánto rinde el salario, qué tan estable es el empleo y si los servicios públicos acompañan el desarrollo.

La próxima meta debe ser conectar inversión, capacitación y productividad con mejores ingresos. Esa es la diferencia entre una expansión estadística y una prosperidad que la gente puede sentir.

${sourceLine("Análisis de VD Noticias con datos del Banco Central", "https://www.bancentral.gov.do/a/d/6618-economia-dominicana-registra-expansion-de-64--en-junio-2026")}`,
    categorySlug: "opinion",
    heroImageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T15:40:00.000Z",
  },
  {
    title: "El legado deportivo comienza el día después de la clausura",
    slug: "opinion-legado-deportivo-dia-despues-clausura",
    summary: "Santo Domingo 2026 será realmente exitoso si sus instalaciones y aprendizajes siguen al servicio del país.",
    body: `Las medallas y las ceremonias concentran la atención, pero el verdadero examen de unos juegos comienza cuando se apagan las luces.

República Dominicana debe convertir la inversión en instalaciones, equipos y capacidad organizativa en escuelas deportivas, competencias regulares y oportunidades para jóvenes.

El legado no puede depender de la memoria del evento. Necesita presupuesto, mantenimiento, responsables identificados y metas públicas que permitan medir resultados.

${sourceLine("Editorial VD Noticias con información de Santo Domingo 2026", "https://centrocaribesports.org/en/news/expo-santo-domingo-2026-officially-opens/")}`,
    categorySlug: "opinion",
    heroImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T15:30:00.000Z",
  },
  {
    title: "La inteligencia artificial necesita inversión, pero también confianza",
    slug: "opinion-inteligencia-artificial-inversion-confianza",
    summary: "El crecimiento de la IA será sostenible solo si protege datos, identifica contenidos sintéticos y responde por sus errores.",
    body: `La carrera por construir centros de datos y modelos más potentes está moviendo mercados, energía, minerales y talento a una escala extraordinaria.

Pero la adopción no depende únicamente de velocidad o capacidad. Personas y empresas necesitan saber cómo se usan sus datos, quién responde ante un daño y cuándo un contenido fue generado artificialmente.

La confianza no frena la innovación: la vuelve utilizable. Las reglas claras, la seguridad y la transparencia son infraestructura tan importante como los chips.

${sourceLine("Análisis VD Noticias con información de AP", "https://apnews.com/article/f4fcee1f9750e2b32cdf26ad73ee5ec2")}`,
    categorySlug: "opinion",
    heroImageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T15:20:00.000Z",
  },
  {
    title: "Reformar la justicia exige seguridad y garantías al mismo tiempo",
    slug: "opinion-reforma-justicia-seguridad-garantias",
    summary: "La discusión del Código Penal no debería obligar al país a escoger entre enfrentar el crimen y proteger derechos.",
    body: `Un sistema penal moderno debe responder al crimen organizado, los fraudes digitales, la violencia y las nuevas formas de extorsión.

Al mismo tiempo, una democracia no puede reducir las garantías que protegen la libertad de expresión, el debido proceso y la responsabilidad proporcional.

La calidad de la reforma se medirá precisamente por su capacidad de hacer ambas cosas. Seguridad sin garantías abre la puerta al abuso; garantías sin capacidad institucional dejan indefensas a las víctimas.

${sourceLine("Editorial VD Noticias con información de Diario Libre", "https://www.diariolibre.com/politica/congreso-nacional/2026/07/08/el-congreso-se-ve-forzado-a-corregir-el-codigo-penal/3592524")}`,
    categorySlug: "opinion",
    heroImageUrl: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1600&q=88",
    publishedAt: "2026-08-05T15:10:00.000Z",
  },
];

const articleExpansions: Record<string, string> = {
  "economia-dominicana-crece-64-por-ciento-junio-2026": `El crecimiento de junio no se concentró en una sola actividad. Los servicios financieros, la enseñanza, el transporte, la salud y los hoteles también registraron avances, lo que ofrece una fotografía más amplia del movimiento productivo.

La construcción explicó una parte importante del resultado mensual por el avance simultáneo de proyectos privados y de la inversión pública. Esa combinación tiene capacidad para mover cadenas de proveedores, empleos técnicos y demanda de materiales.

El siguiente dato clave será la inflación. Una economía que crece con precios controlados genera un entorno más favorable para el consumo y la inversión; si los costos externos vuelven a subir, el Banco Central deberá equilibrar el impulso económico con la estabilidad de los hogares.`,

  "marileidy-paulino-oro-relevo-mixto-santo-domingo-2026": `La final exigió coordinación en las entregas, lectura de carrera y capacidad para sostener el ritmo frente a selecciones que llegaron con el mismo objetivo. En los relevos, una falla mínima puede borrar la ventaja construida durante toda la prueba.

Paulino aportó su experiencia como campeona olímpica, mientras sus compañeros respondieron a la presión de competir ante el público dominicano. La combinación de experiencia y juventud fue una de las claves del resultado.

El oro también fortalece la confianza del atletismo nacional para las pruebas restantes. El equipo técnico deberá administrar la recuperación de los corredores y decidir las próximas alineaciones según el calendario competitivo.`,

  "wall-street-maximos-petroleo-atencion-mundial-agosto-2026": `La sesión mostró un mercado dividido. Algunas empresas recibieron apoyo por sus resultados y proyecciones, mientras varias tecnológicas retrocedieron después de semanas de fuertes valorizaciones.

El estrecho de Ormuz continúa siendo un punto crítico porque por esa ruta circula una parte relevante de la energía mundial. Cualquier avance diplomático reduce temores de suministro; una nueva escalada puede provocar el efecto contrario en cuestión de horas.

Los inversionistas ahora observan los próximos datos de empleo y las señales de la Reserva Federal. Ambos elementos ayudarán a definir si el crecimiento estadounidense puede sostenerse sin reactivar presiones inflacionarias.`,

  "codigo-penal-etapa-decisiva-aplicacion-reformas-2026": `El nuevo texto reemplaza una legislación concebida para una realidad social completamente distinta. Su aplicación obliga a revisar procedimientos, capacitación y coordinación entre el Ministerio Público, el Poder Judicial, la Defensa Pública y los cuerpos investigadores.

Uno de los debates centrales es cómo castigar conductas modernas sin crear disposiciones ambiguas. Los artículos relacionados con expresión, plataformas digitales y actividad profesional necesitan interpretaciones claras para evitar decisiones contradictorias.

La implementación será gradual en la práctica, aunque la ley tenga una fecha formal de entrada en vigor. Los primeros procesos judiciales, los criterios de los tribunales y las eventuales revisiones legislativas terminarán definiendo su verdadero alcance.`,

  "santo-domingo-2026-capital-deportiva-caribe": `La organización moviliza jueces, federaciones, personal médico, seguridad, transporte, voluntarios y equipos técnicos. Cada competencia depende de una operación que comienza mucho antes de que los atletas entren al escenario.

Para República Dominicana, la justa representa exposición internacional y una oportunidad de fortalecer el turismo deportivo. Hoteles, transporte, comercios y servicios reciben parte del movimiento generado por delegaciones y visitantes.

El balance final incluirá el rendimiento de los atletas, pero también la calidad de la organización y el estado en que queden las instalaciones. Mantener los recintos activos será fundamental para que la inversión produzca beneficios durante años.`,

  "inteligencia-artificial-impulsa-optimismo-mercados-agosto-2026": `Los grandes grupos tecnológicos están aumentando el gasto en centros de datos, procesadores, redes y energía. La magnitud de esas inversiones ha convertido la infraestructura de inteligencia artificial en uno de los motores del mercado.

El entusiasmo, sin embargo, viene acompañado de exigencias. Los accionistas quieren resultados concretos: nuevos productos, reducción de costos, crecimiento de ingresos y una ruta creíble para recuperar el capital invertido.

Fuera de Wall Street, la expansión tendrá efectos sobre el empleo y la educación. Empresas y gobiernos necesitarán formar profesionales capaces de implementar estas herramientas, evaluar riesgos y proteger información sensible.`,

  "outside-lands-2026-transmision-directo-cartelera": `La transmisión permitirá seguir actuaciones seleccionadas sin estar en San Francisco. La programación se distribuirá en dos señales y comenzará cada jornada en horas de la tarde para el público de Estados Unidos.

La cartelera combina figuras de gran convocatoria con proyectos alternativos. Esa mezcla ha sido parte de la identidad de Outside Lands y permite que el evento conecte públicos de distintas edades y géneros musicales.

Para la industria, el formato híbrido amplía patrocinio, conversación social y alcance internacional. El reto es conservar el valor de la experiencia presencial sin convertir la emisión digital en una simple repetición del escenario.`,

  "turismo-supera-49-millones-visitantes-primer-semestre-2026": `El aumento de visitantes fortalece las entradas de divisas y sostiene actividades vinculadas con alojamiento, alimentos, excursiones, comercio y transporte. También crea presión para mejorar infraestructura y calidad del servicio.

La diversificación sigue siendo una tarea estratégica. El país busca que más viajeros conozcan destinos culturales, urbanos y ecológicos, además de los polos tradicionales de sol y playa.

El crecimiento debe acompañarse de planificación ambiental y participación comunitaria. Un destino competitivo necesita proteger playas, agua, patrimonio y espacios naturales, porque esos recursos forman parte esencial del producto turístico.`,

  "christopher-melenciano-historia-oro-regional-relevo": `Su evolución deportiva ha requerido adaptar la comunicación durante entrenamientos y competencias, pero nunca reducir las expectativas de rendimiento. Las marcas obtenidas lo colocaron en condiciones de integrar la selección absoluta.

En el relevo, Melenciano compitió como atleta de alto nivel y no como una figura simbólica. Su tramo fue parte de una estrategia colectiva que necesitaba precisión y velocidad para sostener las posibilidades de oro.

La historia deja una responsabilidad para el sistema deportivo: identificar talento con discapacidad, garantizar entrenadores preparados y facilitar competencias. La inclusión se vuelve real cuando ofrece las mismas oportunidades de desarrollo y exigencia.`,

  "brasil-decision-tasas-inflacion-agosto-2026": `La Selic continúa en un nivel elevado incluso después de los recortes realizados durante el año. El banco central intenta aliviar gradualmente las condiciones financieras sin enviar una señal de relajación excesiva.

El mercado laboral resistente y las expectativas fiscales forman parte de la cautela. Si la demanda se mantiene fuerte, una reducción acelerada podría dificultar el regreso de la inflación hacia la meta.

La decisión también será leída por otros bancos centrales de la región. Brasil es una referencia por el tamaño de su economía y por su peso en los movimientos de monedas, bonos e inversión latinoamericana.`,

  "reformas-codigo-penal-calidad-debate-publico": `Las propuestas de cambio no tienen el mismo alcance. Algunas buscan correcciones técnicas y otras plantean diferencias de fondo sobre derechos, sanciones y límites del poder penal.

Por eso, la discusión necesita documentos comparativos y explicaciones públicas. Aprobar artículos bajo presión de tiempo sin mostrar su efecto puede crear nuevos conflictos en tribunales y aumentar la desconfianza ciudadana.

La revisión tampoco debe convertirse en una excusa para paralizar indefinidamente la modernización. El Congreso tiene que identificar los puntos críticos, justificar cada decisión y establecer un mecanismo de evaluación después de la aplicación.`,

  "santo-domingo-2026-agenda-movilidad-seguridad-servicios": `Las sedes no funcionan de manera aislada. Los horarios de competencias, las rutas de delegaciones y el acceso del público obligan a coordinar tránsito, estacionamientos y transporte colectivo.

La atención médica es otro componente esencial. Cada recinto necesita protocolos para atletas y espectadores, rutas de evacuación y comunicación rápida con centros asistenciales.

Cuando termine el evento, las autoridades podrán revisar qué soluciones funcionaron y cuáles deben corregirse. Ese aprendizaje puede aplicarse a conciertos, torneos, actividades culturales y otras concentraciones masivas.`,

  "europa-vigilancia-deepfakes-abusos-inteligencia-artificial": `El nuevo equipo tendrá la tarea de recibir información, investigar incumplimientos y coordinar la aplicación de las normas. Las obligaciones varían según el nivel de riesgo de cada sistema.

El etiquetado de contenido sintético busca que los ciudadanos puedan distinguir una pieza real de una manipulación. Esa medida adquiere mayor importancia en campañas electorales, fraudes y suplantaciones de identidad.

Las empresas que operan en Europa deberán revisar productos y procesos, aunque tengan su sede en otro continente. La capacidad europea para aplicar sanciones determinará si la regulación se convierte en un modelo efectivo o queda limitada al papel.`,

  "bts-regresa-nueva-york-concierto-2026": `El espectáculo recorrió distintas etapas de la discografía del grupo y aprovechó la producción de estadio para acompañar cada bloque musical. Los seguidores respondieron con proyectos coordinados y una presencia internacional visible.

El vínculo entre BTS y ARMY se ha construido tanto en conciertos como en plataformas digitales. Durante la pausa de las presentaciones completas, esa comunidad mantuvo activa la conversación y acompañó los proyectos individuales.

El regreso abre una nueva fase para el grupo. La industria observará cómo BTS combina lanzamientos, giras y actividades personales después de una espera que elevó las expectativas del público.`,

  "construccion-mineria-repunte-productivo-rd-2026": `La construcción tiene un efecto multiplicador porque demanda cemento, acero, transporte, servicios profesionales y mano de obra. Por esa razón, su recuperación puede reflejarse rápidamente en otras actividades.

El avance de la minería aporta valor al indicador, pero requiere seguimiento ambiental y transparencia sobre sus beneficios. El crecimiento de un sector extractivo debe evaluarse junto con el manejo del territorio y los compromisos con las comunidades.

Para sostener el repunte, será importante observar el crédito, la inversión pública y el costo de los insumos. Una subida prolongada de tasas o materiales podría reducir el ritmo de nuevos proyectos.`,

  "wilfrido-de-la-cruz-primer-oro-taekwondo-santo-domingo-2026": `De la Cruz manejó la final con disciplina táctica y evitó que su rival cambiara el curso del combate. El resultado confirmó el trabajo realizado durante la preparación previa a los Juegos.

Competir como anfitrión ofrece respaldo, pero también aumenta la presión. El dominicano respondió ante una grada pendiente de cada acción y cerró la jornada con el título regional.

La medalla suma puntos al balance de la delegación y sirve de referencia para los atletas que continúan en competencia. El equipo deberá mantener la concentración mientras avanza el calendario de categorías.`,

  "petroleo-mide-resistencia-economia-mundial-agosto-2026": `El precio no depende únicamente de la cantidad disponible. Las expectativas sobre rutas marítimas, decisiones de productores y negociaciones diplomáticas pueden mover el mercado antes de que cambie el suministro físico.

Cuando el crudo sube, las economías importadoras enfrentan mayores costos de transporte y generación. Parte de ese aumento puede llegar a alimentos, materiales y servicios por medio de la cadena logística.

Los gobiernos tienen opciones limitadas: absorber una parte del impacto, ajustar precios internos o reducir otros gastos. Cada alternativa tiene consecuencias fiscales y sociales, por lo que la duración de la volatilidad será determinante.`,

  "guia-ciudadana-nuevos-delitos-digitales-codigo-penal": `La evidencia digital exige cuidados específicos. Capturas, mensajes, archivos y registros deben conservarse sin alteraciones y entregarse por los canales adecuados para que puedan ser evaluados durante una investigación.

También es importante diferenciar una conducta desagradable de un hecho penal. La aplicación concreta dependerá de los elementos de cada delito, la intención, el daño y las pruebas disponibles.

Las instituciones deberán publicar guías y capacitar al personal que recibe denuncias. Una ley moderna pierde eficacia si la víctima no sabe dónde acudir o si las autoridades no pueden preservar y analizar la evidencia.`,

  "expo-juegos-cien-anos-historia-deportiva-caribe": `La exposición permite observar cómo cambiaron las disciplinas, las sedes y la participación de los países a lo largo de un siglo. También reconoce a quienes construyeron el movimiento regional fuera de los grandes titulares.

Su ubicación dentro del Centro Olímpico facilita que delegaciones y público incorporen la visita a la experiencia de los Juegos. El museo añade contexto a las medallas que se disputan actualmente.

Al ser permanente, la muestra podrá servir como recurso educativo después de la clausura. Escuelas, clubes y federaciones tendrán un espacio para conectar nuevas generaciones con la memoria deportiva del Caribe.`,

  "eclipse-total-solar-12-agosto-2026-guia-segura": `En la franja de totalidad, el cielo se oscurecerá durante un breve período y será posible observar la corona solar. Fuera de esa zona, la Luna cubrirá solo una parte del disco del Sol.

La protección debe utilizarse durante toda la fase parcial. Los visores tienen que cumplir la norma correspondiente, estar en buen estado y usarse según las indicaciones del fabricante.

Quienes no dispongan de protección certificada pueden recurrir a métodos de proyección indirecta. La seguridad visual debe estar por encima de cualquier fotografía o intento de observación improvisada.`,

  "the-voice-celebrity-keke-palmer-nueva-edicion": `La producción conserva la competencia por equipos y el acompañamiento de entrenadores, pero cambia la naturaleza de los participantes. Las celebridades llegarán con experiencia pública, aunque no necesariamente con formación vocal profesional.

La elección de Keke Palmer aporta una figura con experiencia en actuación, música y conducción. Queen Latifah, Riley Green y Joe Jonas representarán perfiles diferentes dentro del panel.

La respuesta dependerá de que el programa logre mantener la tensión competitiva. El atractivo inicial de los nombres conocidos tendrá que sostenerse con actuaciones, evolución y una narrativa convincente.`,

  "tasa-politica-monetaria-rd-525-julio-2026": `La tasa de referencia no se traslada de manera automática a todos los préstamos, pero orienta el costo general del dinero. Las entidades financieras también consideran liquidez, riesgo y plazos al fijar sus condiciones.

La inflación interanual permanece cerca del límite superior del rango meta, lo que explica la prudencia del Banco Central. Al mismo tiempo, la recuperación económica reduce la necesidad de aplicar un estímulo acelerado.

Las próximas decisiones dependerán del petróleo, el tipo de cambio, la demanda interna y las expectativas de precios. Hogares y empresas deberán observar no solo la tasa oficial, sino la evolución efectiva del crédito y el ahorro.`,

  "incentivos-medallistas-dominicanos-santo-domingo-2026": `Los premios distinguen el resultado alcanzado, pero la preparación de un atleta comienza años antes. Equipamiento, alimentación, viajes, medicina deportiva y entrenadores forman parte de un proceso costoso y continuo.

En los deportes colectivos, el monto se distribuye entre integrantes y personal según los criterios establecidos. La estructura reconoce que una medalla de equipo depende de una preparación compartida.

Después de los Juegos será necesario evaluar el impacto de estos incentivos y el apoyo previo. La política deportiva debe premiar la excelencia sin abandonar a quienes están construyendo el próximo ciclo competitivo.`,

  "cobre-record-demanda-tecnologica-inteligencia-artificial": `El cobre es indispensable para redes eléctricas, motores, centros de datos y proyectos de energía renovable. El crecimiento simultáneo de esas industrias aumenta la competencia por el metal.

La oferta minera tarda años en responder porque un nuevo proyecto requiere permisos, inversión e infraestructura. Cuando los inventarios bajan, cualquier interrupción puede provocar movimientos fuertes de precio.

El encarecimiento puede trasladarse a equipos, construcción y sistemas energéticos. La transición digital no depende solo de software: necesita una cadena física de minerales, fabricación y electricidad.`,

  "gobierno-congreso-explicar-reforma-penal-393-articulos": `La capacitación no puede limitarse a conferencias generales. Cada institución necesita manuales, protocolos y ejercicios prácticos sobre las figuras que utilizará en su trabajo cotidiano.

La ciudadanía también requiere una versión comprensible de la ley. Explicar derechos, obligaciones y vías de denuncia reduce rumores y ayuda a prevenir conductas antes de que lleguen a los tribunales.

El seguimiento debe incluir datos sobre casos, decisiones y dificultades de aplicación. Esa información permitirá corregir problemas reales en lugar de modificar la norma únicamente por presión coyuntural.`,

  "instalaciones-juegos-conversacion-legado-santo-domingo-2026": `Un plan de legado debe asignar responsables y recursos para cada recinto. Sin mantenimiento preventivo, una instalación moderna puede deteriorarse rápidamente después de una gran competencia.

Las federaciones necesitan horarios de entrenamiento y eventos que mantengan activo el equipamiento. Las comunidades cercanas también pueden beneficiarse mediante programas juveniles y actividades abiertas.

La rendición de cuentas será esencial. Publicar el uso, costo y estado de las instalaciones ayudará a medir si el evento fortaleció de manera permanente el sistema deportivo dominicano.`,

  "etapa-cohete-impacta-luna-observacion-cientifica-2026": `El punto previsto se encuentra cerca del borde lunar visto desde la Tierra, una ubicación que dificulta la observación. Los equipos deberán coordinar tiempos e instrumentos para aumentar la posibilidad de registrar el evento.

Aunque el destello podría ser débil, cualquier dato ayudará a comparar modelos sobre velocidad, energía y material expulsado. Incluso una observación incompleta puede mejorar futuras campañas.

El estudio también recuerda el crecimiento de los objetos artificiales fuera de la Tierra. Con más misiones previstas, localizar y comprender impactos será importante para la investigación y la seguridad de futuros equipos científicos.`,

  "zz-top-cancela-concierto-hollywood-bowl-2026": `La cancelación se produjo a pocas horas de la fecha prevista, lo que obligó a reorganizar planes de asistentes, personal y artistas invitados. La banda no ofreció detalles adicionales sobre la situación interna.

Los boletos serán reembolsados automáticamente por los canales de compra. Los seguidores deberán evitar enlaces no oficiales que prometan cambios o devoluciones fuera del proceso anunciado.

Por el momento, las fechas siguientes permanecen publicadas. La continuidad dependerá de que el grupo pueda resolver los asuntos que hicieron imposible la presentación de Los Ángeles.`,

  "ruta-antorcha-juegos-conecto-territorio-nacional": `La ruta fue diseñada para que el símbolo llegara a comunidades que no recibirían competencias. Actos locales, atletas y organizaciones territoriales acompañaron el recorrido.

La presencia de figuras olímpicas en la salida vinculó la memoria de logros anteriores con la generación que compite en 2026. El mensaje buscó presentar los Juegos como un proyecto nacional.

Esa conexión puede mantenerse después del evento mediante clínicas, visitas escolares y programas federativos en las provincias. Llevar el deporte al territorio será una forma concreta de prolongar el significado de la antorcha.`,

  "opinion-crecimiento-repunte-bienestar-rd-2026": `El dato ofrece una base para el optimismo, pero no debe utilizarse como punto final de la conversación. La distribución territorial y sectorial del avance permite saber quiénes están recibiendo sus beneficios.

La productividad es el puente entre crecimiento y mejores salarios. Para elevarla se necesita educación pertinente, infraestructura funcional, competencia y empresas capaces de incorporar tecnología.

El país tiene la oportunidad de convertir la recuperación en una etapa de transformación. Eso requiere medir el éxito con indicadores económicos y también con la experiencia cotidiana de las familias.`,

  "opinion-legado-deportivo-dia-despues-clausura": `El entusiasmo de estas semanas puede atraer a miles de niños y jóvenes. Sin una estructura que los reciba, esa motivación desaparecerá tan rápido como la ceremonia final.

Las federaciones, escuelas y gobiernos locales deben coordinar una oferta continua. El deporte de alto rendimiento necesita una base amplia de formación, competencia y detección de talento.

La mejor celebración del éxito dominicano será cuidar lo construido. Un recinto lleno de actividad dentro de cinco años valdrá más que cualquier discurso pronunciado durante los Juegos.`,

  "opinion-inteligencia-artificial-inversion-confianza": `La transparencia debe comenzar antes de que exista un problema. Los usuarios necesitan avisos comprensibles, opciones de control y canales para cuestionar decisiones automatizadas.

Las organizaciones también deben reconocer los límites de sus herramientas. Un modelo puede producir resultados convincentes y aun así equivocarse, discriminar o exponer información que debía permanecer protegida.

El liderazgo tecnológico no pertenecerá únicamente a quien construya el sistema más grande. También dependerá de quién logre demostrar que su tecnología es segura, responsable y útil para la sociedad.`,

  "opinion-reforma-justicia-seguridad-garantias": `La presión por responder a la delincuencia puede conducir a soluciones rápidas, pero el derecho penal exige precisión. Una norma ambigua puede terminar afectando a personas que no eran el objetivo anunciado.

Del otro lado, mantener herramientas obsoletas limita la capacidad para investigar delitos complejos y proteger a las víctimas. Modernizar no es opcional; hacerlo con equilibrio sí es una obligación democrática.

El país necesita evaluar la reforma con evidencia. Las decisiones de los tribunales, el trato a las víctimas y el respeto al debido proceso mostrarán si el nuevo sistema cumple lo prometido.`,
};

export const currentEditionArticles: CurrentEditionArticle[] = baseCurrentEditionArticles.map((article) => {
  const expansion = articleExpansions[article.slug];
  if (!expansion) return article;
  const sourceIndex = article.body.lastIndexOf("\n\nFuente consultada:");
  if (sourceIndex < 0) return { ...article, body: `${article.body}\n\n${expansion}` };
  return {
    ...article,
    body: `${article.body.slice(0, sourceIndex)}\n\n${expansion}${article.body.slice(sourceIndex)}`,
  };
});
