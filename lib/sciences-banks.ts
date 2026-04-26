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
//                          REGISTRY
// =================================================================

export const SCIENCE_BANKS: Record<string, Fact[]> = {
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
};
