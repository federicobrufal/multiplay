/**
 * Curated MCQ banks for the sciences tracks (1° grado).
 * Each theme is a list of facts; the question generator shuffles and
 * picks N per level. Same bank shared across all levels of a theme;
 * the dedup + size keeps each level varied.
 */

export interface Fact {
  prompt: string;
  context?: string;
  answer: string;
  distractors: string[];
}

// =================================================================
//                       CIENCIAS SOCIALES
// =================================================================

export const FAMILY_AND_ROLES_BANK: Fact[] = [
  { prompt: "¿Quién es el papá de tu papá?", answer: "tu abuelo", distractors: ["tu tío", "tu primo", "tu hermano"] },
  { prompt: "¿Quién es la mamá de tu mamá?", answer: "tu abuela", distractors: ["tu tía", "tu prima", "tu hermana"] },
  { prompt: "¿Quién es el hijo de tus papás (que no sos vos)?", answer: "tu hermano o hermana", distractors: ["tu primo", "tu tío", "tu abuelo"] },
  { prompt: "¿Quién es el hermano de tu papá?", answer: "tu tío", distractors: ["tu abuelo", "tu primo", "tu hermano"] },
  { prompt: "¿Quién es el hijo de tu tío?", answer: "tu primo", distractors: ["tu hermano", "tu abuelo", "tu tío"] },
  { prompt: "¿Quién cuida a los chicos en la familia?", answer: "los papás", distractors: ["los amigos", "los vecinos", "los maestros"] },
  { prompt: "¿Cómo le decís a la hermana de tu papá?", answer: "tía", distractors: ["abuela", "prima", "mamá"] },
  { prompt: "Tu mamá y tu papá juntos son tus...", answer: "papás", distractors: ["abuelos", "tíos", "primos"] },
];

export const SCHOOL_BANK: Fact[] = [
  { prompt: "¿Quién enseña en la escuela?", answer: "la maestra", distractors: ["el doctor", "el bombero", "el panadero"] },
  { prompt: "¿En qué lugar de la escuela aprendés?", answer: "en el aula", distractors: ["en la cocina", "en el baño", "en la calle"] },
  { prompt: "¿Dónde jugás en el recreo?", answer: "en el patio", distractors: ["en el aula", "en la calle", "en mi casa"] },
  { prompt: "¿Qué llevás a la escuela para escribir?", answer: "lápiz y cuaderno", distractors: ["pelota", "comida", "juguetes"] },
  { prompt: "¿Cómo se llama el lugar donde guardás tus cosas?", answer: "mochila", distractors: ["caja", "bolsa", "plato"] },
  { prompt: "¿Quién es el jefe de la escuela?", answer: "la directora", distractors: ["el portero", "la maestra", "los alumnos"] },
  { prompt: "¿Dónde te sentás en el aula?", answer: "en la silla", distractors: ["en el piso", "en la cama", "en la mesada"] },
  { prompt: "¿En qué se sienta el maestro?", answer: "en una silla", distractors: ["en la pizarra", "en el suelo", "en la mochila"] },
];

export const COEXISTENCE_RULES_BANK: Fact[] = [
  { prompt: "¿Está bien compartir con los amigos?", answer: "sí", distractors: ["no"] },
  { prompt: "¿Está bien pegar?", answer: "no", distractors: ["sí"] },
  { prompt: "¿Qué decís cuando alguien te ayuda?", answer: "gracias", distractors: ["adiós", "no", "sí"] },
  { prompt: "¿Qué decís cuando llegás?", answer: "hola", distractors: ["chau", "no", "gracias"] },
  { prompt: "¿Qué decís cuando te vas?", answer: "chau", distractors: ["hola", "gracias", "no"] },
  { prompt: "¿Está bien gritar mientras la maestra habla?", answer: "no", distractors: ["sí"] },
  { prompt: "¿Qué hay que hacer antes de comer?", answer: "lavarse las manos", distractors: ["dormir", "correr", "saltar"] },
  { prompt: "Si alguien está triste, ¿qué hacés?", answer: "lo ayudo", distractors: ["lo ignoro", "le pego", "le grito"] },
];

export const NEARBY_SPACES_BANK: Fact[] = [
  { prompt: "¿Dónde dormís de noche?", answer: "en mi casa", distractors: ["en la escuela", "en el hospital", "en el parque"] },
  { prompt: "¿Dónde se compra pan?", answer: "en la panadería", distractors: ["en el banco", "en la farmacia", "en la escuela"] },
  { prompt: "¿Dónde se compran remedios?", answer: "en la farmacia", distractors: ["en la panadería", "en la juguetería", "en la escuela"] },
  { prompt: "¿Dónde vas cuando estás enfermo?", answer: "al hospital", distractors: ["a la escuela", "a la plaza", "al cine"] },
  { prompt: "¿Dónde se va a jugar al aire libre?", answer: "a la plaza", distractors: ["al baño", "al hospital", "al banco"] },
  { prompt: "¿Cómo se llama el conjunto de casas alrededor de la tuya?", answer: "el barrio", distractors: ["la escuela", "el campo", "el mar"] },
  { prompt: "¿Dónde se lava la ropa generalmente?", answer: "en mi casa", distractors: ["en la plaza", "en la calle", "en la escuela"] },
];

export const SPATIAL_ORIENTATION_BANK: Fact[] = [
  { prompt: "¿Dónde están las nubes?", answer: "arriba", distractors: ["abajo", "atrás", "adentro"] },
  { prompt: "¿Dónde está el piso?", answer: "abajo", distractors: ["arriba", "atrás", "afuera"] },
  { prompt: "Si está al lado tuyo, ¿está...?", answer: "cerca", distractors: ["lejos", "arriba", "abajo"] },
  { prompt: "Si tenés que caminar mucho para llegar, está...", answer: "lejos", distractors: ["cerca", "arriba", "abajo"] },
  { prompt: "Lo que está dentro de la caja está...", answer: "adentro", distractors: ["afuera", "arriba", "atrás"] },
  { prompt: "Lo que está fuera de la caja está...", answer: "afuera", distractors: ["adentro", "abajo", "atrás"] },
  { prompt: "Cuando algo está detrás tuyo, está...", answer: "atrás", distractors: ["adelante", "arriba", "abajo"] },
  { prompt: "Cuando algo está delante tuyo, está...", answer: "adelante", distractors: ["atrás", "abajo", "arriba"] },
];

export const TRANSPORTATION_BANK: Fact[] = [
  { prompt: "¿Cómo se llama el transporte que vuela?", answer: "avión", distractors: ["barco", "auto", "tren"] },
  { prompt: "¿Cómo se llama el transporte que va por el agua?", answer: "barco", distractors: ["avión", "tren", "bicicleta"] },
  { prompt: "¿Cuántas ruedas tiene una bicicleta?", answer: "2", distractors: ["4", "1", "3"] },
  { prompt: "¿Cuántas ruedas tiene un auto?", answer: "4", distractors: ["2", "6", "8"] },
  { prompt: "¿Qué transporte va por las vías?", answer: "el tren", distractors: ["el auto", "el avión", "el barco"] },
  { prompt: "¿Quién maneja el avión?", answer: "el piloto", distractors: ["el chofer", "el capitán", "el maquinista"] },
  { prompt: "¿Quién maneja el barco?", answer: "el capitán", distractors: ["el piloto", "el chofer", "el doctor"] },
  { prompt: "¿Cuál no es un medio de transporte?", answer: "la silla", distractors: ["el auto", "la bicicleta", "el barco"] },
  { prompt: "¿Cuál es el más rápido?", answer: "el avión", distractors: ["la bicicleta", "el barco", "caminar"] },
];

export const JOBS_AND_PROFESSIONS_BANK: Fact[] = [
  { prompt: "¿Quién apaga el fuego?", answer: "el bombero", distractors: ["el doctor", "el panadero", "el maestro"] },
  { prompt: "¿Quién cuida a los enfermos?", answer: "el doctor", distractors: ["el bombero", "el cocinero", "el chofer"] },
  { prompt: "¿Quién hace el pan?", answer: "el panadero", distractors: ["el doctor", "el bombero", "el maestro"] },
  { prompt: "¿Quién enseña en la escuela?", answer: "el maestro", distractors: ["el bombero", "el panadero", "el doctor"] },
  { prompt: "¿Quién corta el pelo?", answer: "el peluquero", distractors: ["el doctor", "el bombero", "el panadero"] },
  { prompt: "¿Quién maneja el camión?", answer: "el camionero", distractors: ["el bombero", "el doctor", "el maestro"] },
  { prompt: "¿Quién cocina en un restaurante?", answer: "el cocinero", distractors: ["el doctor", "el panadero", "el peluquero"] },
  { prompt: "¿Qué usa el doctor para escuchar el corazón?", answer: "el estetoscopio", distractors: ["el lápiz", "el martillo", "la pala"] },
  { prompt: "¿Qué usa el bombero para apagar el fuego?", answer: "agua", distractors: ["fuego", "viento", "papel"] },
];

// =================================================================
//                       CIENCIAS NATURALES
// =================================================================

export const HUMAN_BODY_BANK: Fact[] = [
  { prompt: "¿Con qué vemos?", answer: "los ojos", distractors: ["la nariz", "la boca", "las orejas"] },
  { prompt: "¿Con qué oímos?", answer: "las orejas", distractors: ["los ojos", "la boca", "las manos"] },
  { prompt: "¿Con qué olemos?", answer: "la nariz", distractors: ["los ojos", "las orejas", "los pies"] },
  { prompt: "¿Con qué hablamos?", answer: "la boca", distractors: ["las orejas", "los pies", "las manos"] },
  { prompt: "¿Con qué caminamos?", answer: "las piernas", distractors: ["las manos", "la cabeza", "la espalda"] },
  { prompt: "¿Cuántos dedos hay en una mano?", answer: "5", distractors: ["4", "6", "10"] },
  { prompt: "¿Cuántos ojos tenemos?", answer: "2", distractors: ["1", "3", "4"] },
  { prompt: "¿Dónde están los pelos?", answer: "en la cabeza", distractors: ["en los pies", "en las manos", "en la espalda"] },
  { prompt: "¿Qué parte usás para sostener la cuchara?", answer: "la mano", distractors: ["el pie", "la oreja", "el ojo"] },
  { prompt: "¿En qué parte del cuerpo está el corazón?", answer: "en el pecho", distractors: ["en la cabeza", "en el pie", "en la mano"] },
];

export const SENSES_BANK: Fact[] = [
  { prompt: "¿Con qué sentido vemos los colores?", answer: "la vista", distractors: ["el oído", "el olfato", "el gusto"] },
  { prompt: "¿Con qué sentido escuchamos la música?", answer: "el oído", distractors: ["la vista", "el olfato", "el tacto"] },
  { prompt: "¿Con qué sentido sentimos el perfume?", answer: "el olfato", distractors: ["el oído", "el gusto", "el tacto"] },
  { prompt: "¿Con qué sentido sabemos si algo es dulce?", answer: "el gusto", distractors: ["la vista", "el oído", "el olfato"] },
  { prompt: "¿Con qué sentido sentimos si algo es suave?", answer: "el tacto", distractors: ["la vista", "el oído", "el gusto"] },
  { prompt: "¿Cuántos sentidos tenemos?", answer: "5", distractors: ["3", "4", "6"] },
  { prompt: "Para sentir el calor del sol usamos...", answer: "el tacto", distractors: ["la vista", "el oído", "el gusto"] },
  { prompt: "Para escuchar a tu mamá usás...", answer: "el oído", distractors: ["la vista", "el olfato", "el gusto"] },
];

export const HEALTHY_EATING_BANK: Fact[] = [
  { prompt: "¿Es sano comer fruta?", answer: "sí", distractors: ["no"] },
  { prompt: "¿Es sano comer mucho dulce todos los días?", answer: "no", distractors: ["sí"] },
  { prompt: "¿Qué se debe tomar para hidratarse?", answer: "agua", distractors: ["gaseosa", "jugo con azúcar", "café"] },
  { prompt: "¿Cuál es una fruta?", answer: "manzana", distractors: ["pizza", "hamburguesa", "papa frita"] },
  { prompt: "¿Cuál es una verdura?", answer: "zanahoria", distractors: ["caramelo", "torta", "papa frita"] },
  { prompt: "¿Cuál es la comida más saludable?", answer: "ensalada", distractors: ["papas fritas", "alfajor", "gaseosa"] },
  { prompt: "¿Cuántas comidas se hacen al día?", answer: "4", distractors: ["1", "2", "10"] },
  { prompt: "¿Está bien comer todos los días golosinas?", answer: "no", distractors: ["sí"] },
  { prompt: "Antes de comer hay que...", answer: "lavarse las manos", distractors: ["correr", "dormir", "saltar"] },
];

export const MATERIALS_AND_OBJECTS_BANK: Fact[] = [
  { prompt: "¿De qué está hecho el libro?", answer: "papel", distractors: ["metal", "vidrio", "plástico"] },
  { prompt: "¿De qué está hecho el vaso?", answer: "vidrio", distractors: ["papel", "tela", "madera"] },
  { prompt: "¿De qué está hecha la silla de madera?", answer: "madera", distractors: ["vidrio", "papel", "agua"] },
  { prompt: "¿De qué está hecha una pelota?", answer: "goma", distractors: ["papel", "vidrio", "metal"] },
  { prompt: "¿De qué es el cuchillo?", answer: "metal", distractors: ["papel", "vidrio", "tela"] },
  { prompt: "¿Qué pasa si tiro un vaso de vidrio?", answer: "se rompe", distractors: ["se infla", "se derrite", "vuela"] },
  { prompt: "¿Qué objeto sirve para escribir?", answer: "lápiz", distractors: ["plato", "almohada", "ventana"] },
  { prompt: "¿Qué material es transparente?", answer: "vidrio", distractors: ["madera", "tela", "metal"] },
  { prompt: "¿Qué material es blando?", answer: "tela", distractors: ["metal", "vidrio", "madera"] },
];

export const PLANTS_BANK: Fact[] = [
  { prompt: "¿Qué necesita una planta para crecer?", answer: "agua y sol", distractors: ["solo arena", "solo viento", "nada"] },
  { prompt: "¿Cuál parte de la planta está abajo de la tierra?", answer: "la raíz", distractors: ["la flor", "la hoja", "el tallo"] },
  { prompt: "¿De dónde sale la flor?", answer: "del tallo", distractors: ["de la raíz", "del aire", "del agua"] },
  { prompt: "¿Las hojas son generalmente de qué color?", answer: "verdes", distractors: ["azules", "rojas", "negras"] },
  { prompt: "¿Qué le pasa a la planta si no se la riega?", answer: "se seca", distractors: ["crece más", "florece", "se enfría"] },
  { prompt: "¿De dónde sacan los frutos su comida?", answer: "del suelo y del sol", distractors: ["de la lluvia solamente", "del viento", "de los animales"] },
  { prompt: "¿Cuál es una planta?", answer: "el árbol", distractors: ["el perro", "la piedra", "el auto"] },
  { prompt: "¿Las plantas son seres vivos?", answer: "sí", distractors: ["no"] },
  { prompt: "¿De qué planta sale la manzana?", answer: "del manzano", distractors: ["del rosal", "del cactus", "del pasto"] },
];

export const ANIMALS_BANK: Fact[] = [
  { prompt: "¿Cuántas patas tiene un perro?", answer: "4", distractors: ["2", "6", "8"] },
  { prompt: "¿Qué come la vaca?", answer: "pasto", distractors: ["carne", "pescado", "metal"] },
  { prompt: "¿Qué animal vive en el agua?", answer: "el pez", distractors: ["el perro", "la jirafa", "el león"] },
  { prompt: "¿Qué animal vuela?", answer: "el pájaro", distractors: ["el pez", "la vaca", "el perro"] },
  { prompt: "¿Qué animal da leche?", answer: "la vaca", distractors: ["el león", "el pez", "la mariposa"] },
  { prompt: "¿Cuál es un animal salvaje?", answer: "el león", distractors: ["el perro", "el gato", "la gallina"] },
  { prompt: "¿Cuál es un animal doméstico?", answer: "el perro", distractors: ["el león", "el tigre", "la jirafa"] },
  { prompt: "¿Qué pone la gallina?", answer: "huevos", distractors: ["leche", "queso", "pan"] },
  { prompt: "¿Qué animal tiene cuello largo?", answer: "la jirafa", distractors: ["el perro", "el ratón", "el pez"] },
  { prompt: "¿Cuál es el rey de la selva?", answer: "el león", distractors: ["el perro", "la vaca", "la gallina"] },
];

export const WATER_BANK: Fact[] = [
  { prompt: "¿Hay que cuidar el agua?", answer: "sí", distractors: ["no"] },
  { prompt: "¿Está bien dejar la canilla abierta?", answer: "no", distractors: ["sí"] },
  { prompt: "¿De dónde sale el agua de la lluvia?", answer: "de las nubes", distractors: ["del piso", "de los árboles", "del sol"] },
  { prompt: "¿Para qué sirve el agua?", answer: "para tomar y limpiar", distractors: ["para ensuciar", "para gastar", "para tirar"] },
  { prompt: "¿Cuándo el agua se vuelve sólida?", answer: "cuando se congela", distractors: ["cuando hierve", "cuando se evapora", "nunca"] },
  { prompt: "¿Qué necesita la planta para vivir?", answer: "agua", distractors: ["azúcar", "sal", "humo"] },
  { prompt: "¿De dónde sale el agua para tomar en casa?", answer: "de la canilla", distractors: ["del aire", "del fuego", "del piso"] },
  { prompt: "El hielo es agua...", answer: "sólida", distractors: ["caliente", "salada", "dulce"] },
];

export const CLIMATE_BANK: Fact[] = [
  { prompt: "Cuando hay nubes oscuras, suele...", answer: "llover", distractors: ["hacer mucho sol", "hacer calor", "nevar siempre"] },
  { prompt: "¿En qué estación hace mucho calor?", answer: "verano", distractors: ["invierno", "otoño", "primavera"] },
  { prompt: "¿En qué estación hace mucho frío?", answer: "invierno", distractors: ["verano", "otoño", "primavera"] },
  { prompt: "¿Qué ropa usás cuando hace frío?", answer: "abrigo", distractors: ["malla", "remera fina", "ojotas"] },
  { prompt: "¿Qué ropa usás cuando hace calor?", answer: "remera", distractors: ["abrigo", "guantes", "bufanda"] },
  { prompt: "Cuando llueve, llevás...", answer: "paraguas", distractors: ["malla", "lentes de sol", "guantes"] },
  { prompt: "Cuando hay sol y calor, te ponés...", answer: "lentes de sol", distractors: ["abrigo", "paraguas", "bufanda"] },
  { prompt: "¿Cuántas estaciones del año hay?", answer: "4", distractors: ["2", "3", "12"] },
];

// =================================================================
//          GRADE 4 — CIENCIAS SOCIALES (7 temas)
// =================================================================

export const CARDINAL_ORIENTATION_BANK: Fact[] = [
  { prompt: "¿Cuáles son los puntos cardinales?", answer: "Norte, Sur, Este, Oeste", distractors: ["Arriba, Abajo, Adelante, Atrás", "1, 2, 3, 4", "Izquierda, Derecha, Centro, Borde"] },
  { prompt: "¿Por dónde sale el sol?", answer: "por el Este", distractors: ["por el Oeste", "por el Norte", "por el Sur"] },
  { prompt: "¿Por dónde se pone el sol?", answer: "por el Oeste", distractors: ["por el Este", "por el Norte", "por el Sur"] },
  { prompt: "Si mirás al norte, ¿qué tenés a la derecha?", answer: "Este", distractors: ["Oeste", "Sur", "Norte"] },
  { prompt: "¿Qué punto cardinal está opuesto al Norte?", answer: "Sur", distractors: ["Este", "Oeste", "Centro"] },
  { prompt: "¿Qué punto cardinal está opuesto al Este?", answer: "Oeste", distractors: ["Norte", "Sur", "Sureste"] },
  { prompt: "Una rosa de los vientos sirve para...", answer: "ubicar puntos cardinales", distractors: ["medir tiempo", "pesar cosas", "leer un libro"] },
  { prompt: "Argentina está en el hemisferio...", answer: "Sur", distractors: ["Norte", "Este", "Oeste"] },
  { prompt: "Para ubicarte en un mapa usás...", answer: "los puntos cardinales", distractors: ["los colores", "las nubes", "el reloj"] },
  { prompt: "¿Qué herramienta indica el norte?", answer: "la brújula", distractors: ["el reloj", "el termómetro", "la regla"] },
];

export const COMMUNITY_INSTITUTIONS_BANK: Fact[] = [
  { prompt: "¿Qué función cumple el hospital?", answer: "atender la salud de las personas", distractors: ["enseñar a leer", "cocinar comida", "vender ropa"] },
  { prompt: "¿Qué función cumple la escuela?", answer: "enseñar y educar", distractors: ["curar enfermos", "vender pan", "apagar incendios"] },
  { prompt: "¿Qué hace la policía?", answer: "cuidar la seguridad", distractors: ["enseñar matemática", "cocinar", "construir casas"] },
  { prompt: "¿Para qué sirve una biblioteca?", answer: "leer y prestar libros", distractors: ["jugar al fútbol", "vender comida", "cortarse el pelo"] },
  { prompt: "¿Quién apaga incendios?", answer: "los bomberos", distractors: ["los doctores", "los maestros", "los policías"] },
  { prompt: "¿Dónde se vacuna a la gente?", answer: "en el hospital o centro de salud", distractors: ["en el cine", "en la panadería", "en el banco"] },
  { prompt: "¿Qué hace la municipalidad?", answer: "administrar el municipio", distractors: ["enseñar inglés", "vender autos", "viajar al espacio"] },
  { prompt: "¿Qué institución cuida el patrimonio?", answer: "el museo", distractors: ["la panadería", "la heladería", "la pizzería"] },
  { prompt: "¿Quiénes nos representan en el gobierno?", answer: "los funcionarios elegidos", distractors: ["los doctores", "los bomberos", "los chefs"] },
  { prompt: "¿Qué institución te enseña a leer?", answer: "la escuela", distractors: ["el hospital", "la municipalidad", "el supermercado"] },
];

export const SOCIAL_NORMS_BANK: Fact[] = [
  { prompt: "¿Por qué hacemos fila?", answer: "para respetar el turno de cada uno", distractors: ["para perder tiempo", "para hacer ruido", "porque sí"] },
  { prompt: "¿Está bien interrumpir cuando alguien habla?", answer: "no", distractors: ["sí"] },
  { prompt: "Cuando alguien te ayuda, decís...", answer: "gracias", distractors: ["chau", "no", "después"] },
  { prompt: "Si rompés algo de un compañero, ¿qué hacés?", answer: "le pido disculpas", distractors: ["lo escondo", "no digo nada", "lo culpo a otro"] },
  { prompt: "¿Por qué hay normas de convivencia?", answer: "para vivir en armonía", distractors: ["para aburrirnos", "para pelear", "porque sí"] },
  { prompt: "En clase, ¿está bien gritar?", answer: "no", distractors: ["sí"] },
  { prompt: "¿Está bien burlarse de los compañeros?", answer: "no", distractors: ["sí"] },
  { prompt: "Cuando alguien está triste, lo correcto es...", answer: "ayudarlo", distractors: ["ignorarlo", "burlarse", "pegarle"] },
  { prompt: "Para usar algo de un compañero, primero...", answer: "le pido permiso", distractors: ["se lo saco", "lo escondo", "lo rompo"] },
  { prompt: "El respeto a los demás se demuestra con...", answer: "palabras y acciones", distractors: ["gritos", "golpes", "insultos"] },
];

export const TRANSPORTATION_TYPES_BANK: Fact[] = [
  { prompt: "¿Qué tipo de transporte es el avión?", answer: "aéreo", distractors: ["terrestre", "acuático", "subterráneo"] },
  { prompt: "¿Qué tipo de transporte es el barco?", answer: "acuático", distractors: ["aéreo", "terrestre", "espacial"] },
  { prompt: "¿Qué tipo de transporte es el auto?", answer: "terrestre", distractors: ["aéreo", "acuático", "espacial"] },
  { prompt: "¿Qué transporte usa rieles?", answer: "el tren", distractors: ["el avión", "el barco", "la bicicleta"] },
  { prompt: "¿Qué transporte navega bajo el agua?", answer: "el submarino", distractors: ["el avión", "el auto", "el helicóptero"] },
  { prompt: "¿Qué transporte usa hélices y vuela bajo?", answer: "el helicóptero", distractors: ["el barco", "el tren", "el submarino"] },
  { prompt: "¿Cuál es transporte público de varios pasajeros?", answer: "el colectivo", distractors: ["la bicicleta", "el monopatín", "la moto"] },
  { prompt: "¿Cuál es el transporte más rápido?", answer: "el avión", distractors: ["la bicicleta", "el barco", "caminar"] },
  { prompt: "Una bicicleta es transporte...", answer: "terrestre", distractors: ["aéreo", "acuático", "espacial"] },
  { prompt: "¿Qué transporte aéreo no tiene motor?", answer: "el globo aerostático", distractors: ["el avión", "el helicóptero", "el cohete"] },
];

export const TIME_CHANGES_BANK: Fact[] = [
  { prompt: "¿Cómo se iluminaban las casas antes de la electricidad?", answer: "con velas y faroles", distractors: ["con celulares", "con lámparas LED", "con TV"] },
  { prompt: "¿Cómo se comunicaban antes del teléfono?", answer: "con cartas", distractors: ["con email", "con videollamadas", "con mensajes de texto"] },
  { prompt: "Antes del auto, ¿en qué se transportaban?", answer: "en caballos o carruajes", distractors: ["en aviones", "en bicicletas eléctricas", "en monopatines"] },
  { prompt: "¿Cómo escuchaban música antes?", answer: "en discos de vinilo", distractors: ["en Spotify", "en celulares", "en YouTube"] },
  { prompt: "¿Cómo se enviaban mensajes urgentes hace 100 años?", answer: "por telégrafo", distractors: ["por WhatsApp", "por email", "por video"] },
  { prompt: "¿Cómo se lavaba la ropa antes de la máquina?", answer: "a mano", distractors: ["con secadora", "con lavavajillas", "con microondas"] },
  { prompt: "¿Cómo se conservaba la comida antes de la heladera?", answer: "con sal o hielo", distractors: ["en el celular", "con WhatsApp", "con luces LED"] },
  { prompt: "Las casas de antes solían ser de...", answer: "adobe o madera", distractors: ["plástico", "metal", "vidrio entero"] },
  { prompt: "Las primeras computadoras eran...", answer: "enormes", distractors: ["muy chiquitas", "del tamaño de un celular", "invisibles"] },
  { prompt: "¿Qué inventó cambiar la forma de viajar?", answer: "el motor", distractors: ["el lápiz", "el reloj", "el papel"] },
];

export const ARGENTINA_BASICS_BANK: Fact[] = [
  { prompt: "¿Cuál es la capital de Argentina?", answer: "Buenos Aires", distractors: ["Córdoba", "Rosario", "Mendoza"] },
  { prompt: "¿Cuáles son los colores de la bandera argentina?", answer: "celeste y blanco", distractors: ["rojo y blanco", "verde y blanco", "azul y amarillo"] },
  { prompt: "¿Cómo se llama el himno argentino?", answer: "Himno Nacional Argentino", distractors: ["Aurora", "Marcha de San Lorenzo", "La Cumparsita"] },
  { prompt: "¿Quién declaró la independencia argentina?", answer: "el Congreso de Tucumán", distractors: ["el rey de España", "Napoleón", "los aztecas"] },
  { prompt: "¿Qué día se celebra la independencia?", answer: "9 de julio", distractors: ["25 de mayo", "1 de enero", "20 de junio"] },
  { prompt: "¿Quién creó la bandera argentina?", answer: "Manuel Belgrano", distractors: ["José de San Martín", "Domingo Sarmiento", "Mariano Moreno"] },
  { prompt: "¿Qué se festeja el 25 de mayo?", answer: "la Revolución de Mayo", distractors: ["la independencia", "Navidad", "el día de la bandera"] },
  { prompt: "¿Cómo se llama la moneda argentina?", answer: "el peso", distractors: ["el dólar", "el euro", "el real"] },
  { prompt: "¿Cuál es el animal nacional argentino?", answer: "el hornero", distractors: ["el león", "el elefante", "el tigre"] },
  { prompt: "¿Qué cordillera atraviesa Argentina?", answer: "los Andes", distractors: ["los Pirineos", "los Alpes", "los Himalayas"] },
  { prompt: "¿Qué océano baña la costa argentina?", answer: "el Atlántico", distractors: ["el Pacífico", "el Índico", "el Ártico"] },
];

export const ECONOMIC_ACTIVITIES_BANK: Fact[] = [
  { prompt: "¿Qué hace un agricultor?", answer: "cultiva la tierra", distractors: ["cura enfermos", "cocina", "vende autos"] },
  { prompt: "¿Qué actividad es la ganadería?", answer: "criar animales", distractors: ["plantar semillas", "construir casas", "vender ropa"] },
  { prompt: "¿En qué consiste la pesca?", answer: "atrapar peces", distractors: ["cazar pájaros", "ordeñar vacas", "plantar árboles"] },
  { prompt: "¿Qué hace un comerciante?", answer: "vende productos", distractors: ["fabrica autos", "cura enfermos", "enseña inglés"] },
  { prompt: "Una fábrica produce...", answer: "objetos en serie", distractors: ["alimentos solo", "música", "películas"] },
  { prompt: "¿Qué actividad tiene que ver con el turismo?", answer: "atender turistas", distractors: ["arar la tierra", "fabricar autos", "pescar"] },
  { prompt: "¿Qué se hace en una panadería?", answer: "se hace pan", distractors: ["se cura", "se enseña", "se construyen casas"] },
  { prompt: "¿Quién hace muebles?", answer: "el carpintero", distractors: ["el panadero", "el doctor", "el bombero"] },
  { prompt: "Sectores económicos: ¿cuál es primario?", answer: "agricultura y ganadería", distractors: ["fábricas", "comercio", "internet"] },
  { prompt: "Sectores económicos: ¿cuál es secundario?", answer: "industria y fábricas", distractors: ["agricultura", "turismo", "venta"] },
];

// =================================================================
//          GRADE 4 — CIENCIAS NATURALES (7 temas)
// =================================================================

export const LIVING_NONLIVING_BANK: Fact[] = [
  { prompt: "¿Cuál es un ser vivo?", answer: "un perro", distractors: ["una piedra", "una silla", "un lápiz"] },
  { prompt: "¿Cuál NO es un ser vivo?", answer: "una piedra", distractors: ["una planta", "un perro", "una persona"] },
  { prompt: "¿Qué hacen los seres vivos?", answer: "nacen, crecen y se reproducen", distractors: ["solo crecen", "solo brillan", "no cambian"] },
  { prompt: "¿La planta es un ser vivo?", answer: "sí", distractors: ["no"] },
  { prompt: "¿El sol es un ser vivo?", answer: "no", distractors: ["sí"] },
  { prompt: "¿Cuál NO es característica de un ser vivo?", answer: "permanece igual para siempre", distractors: ["nace", "crece", "se reproduce"] },
  { prompt: "¿Qué necesitan los seres vivos para vivir?", answer: "agua y alimento", distractors: ["solo viento", "solo arena", "nada"] },
  { prompt: "Un río es un ser...", answer: "no vivo", distractors: ["vivo", "vivo a veces"] },
  { prompt: "Un árbol crece, ¿es vivo?", answer: "sí", distractors: ["no"] },
  { prompt: "¿Las nubes son seres vivos?", answer: "no", distractors: ["sí"] },
];

export const BODY_ORGANS_BANK: Fact[] = [
  { prompt: "¿Para qué sirve el corazón?", answer: "bombea la sangre", distractors: ["digiere comida", "produce voz", "respira aire"] },
  { prompt: "¿Para qué sirven los pulmones?", answer: "respirar", distractors: ["digerir", "bombear sangre", "ver"] },
  { prompt: "¿Para qué sirve el estómago?", answer: "digerir la comida", distractors: ["respirar", "bombear sangre", "pensar"] },
  { prompt: "¿Para qué sirve el cerebro?", answer: "pensar y controlar el cuerpo", distractors: ["respirar", "digerir", "bombear sangre"] },
  { prompt: "¿Cuántos pulmones tenemos?", answer: "2", distractors: ["1", "3", "4"] },
  { prompt: "¿Dónde está el corazón?", answer: "en el pecho", distractors: ["en la cabeza", "en el pie", "en la mano"] },
  { prompt: "¿Para qué sirven los riñones?", answer: "filtran la sangre", distractors: ["respiran", "digieren", "piensan"] },
  { prompt: "¿Cuál es el órgano más grande del cuerpo?", answer: "la piel", distractors: ["el cerebro", "el corazón", "el estómago"] },
  { prompt: "¿Qué órgano hace la digestión?", answer: "el estómago", distractors: ["el pulmón", "el cerebro", "el corazón"] },
  { prompt: "¿Cuál es el sistema que mueve la sangre?", answer: "el sistema circulatorio", distractors: ["el sistema respiratorio", "el sistema nervioso", "el sistema digestivo"] },
];

export const NUTRITION_BANK: Fact[] = [
  { prompt: "¿Cuántas comidas conviene hacer al día?", answer: "4", distractors: ["1", "2", "10"] },
  { prompt: "¿Qué da energía: cereales o caramelos?", answer: "cereales", distractors: ["caramelos", "ninguno", "ambos igual"] },
  { prompt: "¿Las frutas son alimentos saludables?", answer: "sí", distractors: ["no"] },
  { prompt: "¿Qué nutriente da la carne?", answer: "proteínas", distractors: ["azúcar", "papas", "agua"] },
  { prompt: "¿Cuál es una bebida saludable?", answer: "el agua", distractors: ["la gaseosa", "el café cargado", "el alcohol"] },
  { prompt: "¿Qué tienen las verduras?", answer: "vitaminas y fibra", distractors: ["solo grasa", "solo azúcar", "nada"] },
  { prompt: "¿Comer mucho dulce es saludable?", answer: "no", distractors: ["sí"] },
  { prompt: "¿Qué grupo de alimentos NO debe faltar?", answer: "frutas y verduras", distractors: ["solo dulces", "solo papas fritas", "solo helados"] },
  { prompt: "Una dieta variada significa...", answer: "comer de todos los grupos", distractors: ["comer un solo alimento", "no comer nada", "comer solo carne"] },
  { prompt: "Antes de comer hay que...", answer: "lavarse las manos", distractors: ["correr una hora", "dormir", "saltar"] },
];

export const MATTER_STATES_BANK: Fact[] = [
  { prompt: "¿En qué estado está el agua del vaso?", answer: "líquido", distractors: ["sólido", "gaseoso", "plasma"] },
  { prompt: "¿En qué estado está el hielo?", answer: "sólido", distractors: ["líquido", "gaseoso", "ninguno"] },
  { prompt: "¿En qué estado está el vapor?", answer: "gaseoso", distractors: ["sólido", "líquido", "plasma"] },
  { prompt: "¿Cuántos estados básicos tiene la materia?", answer: "3", distractors: ["1", "2", "5"] },
  { prompt: "¿El aire es un...?", answer: "gas", distractors: ["sólido", "líquido", "plasma"] },
  { prompt: "¿Una piedra es un...?", answer: "sólido", distractors: ["líquido", "gas", "plasma"] },
  { prompt: "¿La leche es un...?", answer: "líquido", distractors: ["sólido", "gas", "plasma"] },
  { prompt: "Los sólidos tienen forma...", answer: "definida", distractors: ["cambiante", "ninguna", "líquida"] },
  { prompt: "Los líquidos toman la forma...", answer: "del recipiente", distractors: ["de un cubo siempre", "de un círculo", "de nadie"] },
  { prompt: "Los gases ocupan...", answer: "todo el espacio disponible", distractors: ["solo el fondo", "solo la mitad", "nada"] },
];

export const MATERIAL_CHANGES_BANK: Fact[] = [
  { prompt: "Cocinar un huevo es un cambio...", answer: "irreversible", distractors: ["reversible", "ninguno", "muy lento"] },
  { prompt: "Derretir hielo es un cambio...", answer: "reversible", distractors: ["irreversible", "ninguno"] },
  { prompt: "Cuando el agua se evapora, ¿se puede volver a juntar?", answer: "sí, condensándola", distractors: ["no, nunca", "depende del clima", "solo en invierno"] },
  { prompt: "Quemar papel es un cambio...", answer: "irreversible", distractors: ["reversible"] },
  { prompt: "Romper un vaso es un cambio...", answer: "irreversible", distractors: ["reversible"] },
  { prompt: "Estirar un elástico es un cambio...", answer: "reversible", distractors: ["irreversible"] },
  { prompt: "Hervir agua: ¿se puede recuperar el agua?", answer: "sí", distractors: ["no"] },
  { prompt: "Una vela encendida cambia...", answer: "irreversiblemente", distractors: ["reversiblemente", "no cambia"] },
  { prompt: "Plegar un papel es un cambio...", answer: "reversible", distractors: ["irreversible"] },
  { prompt: "Cocinar carne es un cambio...", answer: "irreversible", distractors: ["reversible"] },
];

export const WATER_IMPORTANCE_BANK: Fact[] = [
  { prompt: "¿Qué porcentaje del cuerpo humano es agua aproximadamente?", answer: "60%", distractors: ["10%", "30%", "90%"] },
  { prompt: "¿Cuál NO es un uso del agua?", answer: "construir paredes", distractors: ["beber", "cocinar", "lavar"] },
  { prompt: "¿De dónde viene el agua de lluvia?", answer: "de las nubes", distractors: ["del fuego", "del piso", "del sol"] },
  { prompt: "¿Por qué hay que cuidar el agua?", answer: "porque es un recurso vital", distractors: ["porque sí", "porque cuesta dinero", "porque está fría"] },
  { prompt: "¿Qué pasa si no se cuida el agua?", answer: "puede faltar", distractors: ["llueve más", "nada", "hace más calor"] },
  { prompt: "¿Cuánta agua tiene la Tierra que es dulce?", answer: "menos del 3%", distractors: ["50%", "90%", "100%"] },
  { prompt: "Los seres vivos necesitan agua para...", answer: "vivir", distractors: ["dormir", "ver TV", "jugar"] },
  { prompt: "Una forma de cuidar el agua es...", answer: "cerrar la canilla cuando no se usa", distractors: ["dejarla abierta", "tirar agua a la calle", "lavar mucho"] },
  { prompt: "¿Cuál es el ciclo del agua?", answer: "evaporación, condensación y precipitación", distractors: ["solo lluvia", "solo evaporación", "no existe"] },
  { prompt: "¿De dónde sale el agua potable de la canilla?", answer: "es tratada y depurada", distractors: ["aparece sola", "viene del cielo directo", "se hace en casa"] },
];

export const ENVIRONMENT_CARE_BANK: Fact[] = [
  { prompt: "¿Qué significa reciclar?", answer: "reutilizar materiales", distractors: ["tirar todo", "comprar más", "perder cosas"] },
  { prompt: "¿Qué materiales se pueden reciclar?", answer: "papel, plástico, vidrio", distractors: ["solo comida", "solo agua", "ninguno"] },
  { prompt: "¿Está bien tirar basura en la calle?", answer: "no", distractors: ["sí"] },
  { prompt: "¿Qué hace un árbol por el ambiente?", answer: "produce oxígeno", distractors: ["produce humo", "no hace nada", "rompe casas"] },
  { prompt: "¿Cómo cuidamos el aire?", answer: "no contaminando", distractors: ["fumando más", "quemando basura", "tirando humo"] },
  { prompt: "¿Está bien usar mucho plástico de un solo uso?", answer: "no", distractors: ["sí"] },
  { prompt: "Los pilas usadas se tiran en...", answer: "puntos especiales de reciclado", distractors: ["la calle", "el inodoro", "el jardín"] },
  { prompt: "¿Qué pasa si contaminamos el río?", answer: "afecta a animales y plantas", distractors: ["nada", "se vuelve más limpio", "queda igual"] },
  { prompt: "¿Para qué se separa la basura?", answer: "para reciclar lo aprovechable", distractors: ["para perder tiempo", "porque sí", "para comprar más"] },
  { prompt: "Una acción para cuidar el ambiente es...", answer: "ahorrar energía y agua", distractors: ["dejar luces prendidas", "tirar basura", "talar árboles"] },
];

// =================================================================
//                          REGISTRY
// =================================================================

export const SCIENCE_BANKS: Record<string, Fact[]> = {
  // Grade 1
  "family-and-roles": FAMILY_AND_ROLES_BANK,
  "school": SCHOOL_BANK,
  "coexistence-rules": COEXISTENCE_RULES_BANK,
  "nearby-spaces": NEARBY_SPACES_BANK,
  "spatial-orientation": SPATIAL_ORIENTATION_BANK,
  "transportation": TRANSPORTATION_BANK,
  "jobs-and-professions": JOBS_AND_PROFESSIONS_BANK,
  "human-body": HUMAN_BODY_BANK,
  "senses": SENSES_BANK,
  "healthy-eating": HEALTHY_EATING_BANK,
  "materials-and-objects": MATERIALS_AND_OBJECTS_BANK,
  "plants": PLANTS_BANK,
  "animals": ANIMALS_BANK,
  "water": WATER_BANK,
  "climate": CLIMATE_BANK,
  // Grade 4 — Sociales
  "cardinal-orientation": CARDINAL_ORIENTATION_BANK,
  "community-institutions": COMMUNITY_INSTITUTIONS_BANK,
  "social-norms": SOCIAL_NORMS_BANK,
  "transportation-types": TRANSPORTATION_TYPES_BANK,
  "time-changes": TIME_CHANGES_BANK,
  "argentina-basics": ARGENTINA_BASICS_BANK,
  "economic-activities": ECONOMIC_ACTIVITIES_BANK,
  // Grade 4 — Naturales
  "living-nonliving": LIVING_NONLIVING_BANK,
  "body-organs": BODY_ORGANS_BANK,
  "nutrition": NUTRITION_BANK,
  "matter-states": MATTER_STATES_BANK,
  "material-changes": MATERIAL_CHANGES_BANK,
  "water-importance": WATER_IMPORTANCE_BANK,
  "environment-care": ENVIRONMENT_CARE_BANK,
};
