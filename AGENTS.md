<!-- BEGIN:nextjs-agent-rules -->

# Contexto del Proyecto

Este proyecto consiste en una plataforma web para una cadena retail Socado Café (https://socadocafe.com/) enfocada en captar prospectos mediante un módulo de cotización de servicios de catering. La aplicación integra una página principal, un flujo de carrito para que los clientes armen su solicitud de cotización y un panel de administración privado El propósito exclusivo del panel en esta etapa es la gestión del catálogo de artículos y la actualización de precios en tiempo real. El flujo de ventas no incluye pasarela de pago, culminando en un formulario que dispara correos electrónicos transaccionales al equipo comercial y al cliente final.

# Referencias de estilo

https://www.honestgreens.com/en/#restaurants
https://doe.co.nz/
https://www.ezcater.com/catering/pvt/sweetgreen-fort-lauderdale?fulfillmentDetailId=b6ff9e74-c07b-4d48-9168-6e38357b114e

# Pila Tecnológica

El sistema se desarrollará utilizando Next.js como entorno unificado para el cliente y el servidor, empleando TypeScript en su totalidad para garantizar un tipado estático robusto en todas las capas. Se integrará un servicio de correo electrónico transaccional externo para asegurar la alta entregabilidad de las solicitudes de cotización. Toda la persistencia de datos se gestionará a través de un sistema de base de datos relacional, aislando las consultas mediante un mapeador objeto-relacional o un constructor de consultas.

# Arquitectura de Software y Modularidad

Es un requisito estricto y no negociable implementar una arquitectura basada a nivel de lógica en capas completamente independientes. Se prohíbe rotundamente mezclar la lógica de negocio con la gestión de las peticiones HTTP o la interfaz de usuario. Las rutas de API y las funciones de servidor de Next.js actuarán de manera exclusiva como la capa de transporte, limitándose a recibir las peticiones, validar los parámetros de entrada y delegar la ejecución inmediatamente a los servicios correspondientes. Por otra parte, a nivel de frontend o presentación se debe aprovechar la estructura de componentes de react. 


# Diseño de la Capa de Servicios

La capa de servicios contendrá toda la lógica empresarial de la plataforma, incluyendo el cálculo de estimaciones, la orquestación de los envíos de correo y la validación de las reglas de negocio. Todas las clases o funciones dentro de esta capa deben ser completamente agnósticas al framework visual, al menos que se diga lo contrario. Los servicios recibirán y retornarán estructuras de datos puras, evitando cualquier tipo de dependencia con elementos nativos de Next.js, como contextos de solicitud, cabeceras web o gestión de cookies, al menos que se diga lo contrario. Esta directriz es fundamental para garantizar una futura migración sin fricciones hacia un backend dedicado.

# Gestión de Datos y Persistencia

El acceso a la base de datos estará confinado de manera exclusiva a una capa de datos dedicada. Esta capa encapsulará todas las consultas y transacciones, entregando a la capa de servicios modelos de dominio limpios y estandarizados. Se prohíbe realizar consultas directas a la base de datos desde los componentes visuales o desde los controladores de la API, a menos que se diga lo contrario. Todo cambio en el catálogo de artículos o en el registro de cotizaciones deberá fluir estrictamente desde el controlador, pasando por la lógica del servicio, hasta llegar finalmente a la capa de persistencia.


## APARTADO VISUAL ##

# Brand Guidelines: Agente AI Socado

Este documento establece las directrices fundamentales para cualquier agente, desarrollador o creador de contenido que interactúe con la marca Socado. El objetivo es mantener una coherencia absoluta en la identidad gráfica, la voz y la personalidad de la plataforma en todos sus puntos de contacto. 

### Esencia y Personalidad de la Marca

[cite_start]La filosofía central de Socado se resume en tres pilares: "Social. Coffee. Connection"[cite: 1250, 1251, 1252]. [cite_start]La marca busca proyectar una imagen que oscila estratégicamente entre lo emocional y lo racional[cite: 1312]. [cite_start]La experiencia visual debe ser "Simplemente Elegante", caracterizada por un enfoque minimalista, transparente y auténtico que evita el sobrediseño y las distracciones[cite: 1775, 1780, 1783]. [cite_start]Simultáneamente, el entorno debe sentirse "Cálidamente Conectado", ofreciendo una atmósfera acogedora y una experiencia de usuario inteligente e inspiradora[cite: 1776, 1784, 1785]. [cite_start]Todo esto se engloba bajo un estilo "Únicamente Sobrio", combinando un diseño discreto con gráficos modernos que comunican de manera directa y abierta[cite: 1777, 1790, 1791]. 

El tono de voz de Socado es fundamental para construir esta conexión. [cite_start]La comunicación debe ser siempre cautivadora, inspiradora e informativa[cite: 1806, 1808, 1810]. [cite_start]Al interactuar con los usuarios, el tono debe mantenerse motivado, simple, cálido e inclusivo, logrando empatía sin perder la sofisticación[cite: 1811, 1812, 1813, 1815, 1816]. [cite_start]Queda estrictamente prohibido utilizar un lenguaje que suene distante, antipático, arrogante, excesivamente gracioso o espiritual[cite: 1818, 1819, 1826, 1828, 1829]. 

### Identidad Visual y Logotipo

[cite_start]El sistema visual de la marca incluye variaciones en formato de imagotipo, logotipo e isotipo, así como logotipos específicos para identificar diferentes estaciones como Social, Market y Kitchen[cite: 1323, 1324, 1328, 1338, 1341, 1342]. [cite_start]Para asegurar una correcta legibilidad, la zona de exclusión alrededor del logo está definida métricamente por la letra "O" incluida en el propio logotipo[cite: 1350]. [cite_start]Es una regla absoluta que el logotipo nunca debe ser recreado, copiado, distorsionado o rotado bajo ninguna circunstancia[cite: 1321, 1381, 1386]. [cite_start]Además, la identidad gráfica se caracteriza por su sencillez dinámica, por lo que está prohibido aplicar sombras, reflejos brillantes o efectos gráficos tridimensionales sobre el logo[cite: 1320, 1390]. [cite_start]El logo debe aplicarse siempre en color Azul Socado, blanco o Ivory, limitando los colores de fondo exclusivamente a los tonos aprobados en la paleta oficial[cite: 1465, 1466, 1530, 1531].

[cite_start]Como complementos gráficos que enriquecen la narrativa visual, la marca incorpora un medallón que funciona como un sello de calidad y excelencia, cuya forma está directamente inspirada en las curvas del logotipo[cite: 1891, 1892]. [cite_start]De este medallón se desprende el uso de un arco, un elemento que actúa gráficamente como una ventana hacia la esencia y los valores de Socado[cite: 1895, 1897]. 

### Tipografía y Estructura de Textos

La coherencia tipográfica es vital para transmitir la personalidad de la marca. [cite_start]La familia tipográfica principal es Raleway (en pesos Regular, Medium, Semi-Bold y Bold), la cual se reserva exclusivamente para los títulos, subtítulos y mensajes de mayor jerarquía[cite: 1552, 1557, 1558]. [cite_start]Como complemento, la tipografía secundaria es Outfit (en pesos Light, Regular y Semi-Bold), destinada para los cuerpos de texto más extensos, subtítulos de apoyo y numeración[cite: 1562, 1566, 1567, 1568]. [cite_start]Al maquetar información en la web o en piezas gráficas, los textos deben estar siempre alineados a la izquierda, reservando la alineación centrada o a la derecha solo para casos excepcionales[cite: 1593, 1594]. [cite_start]Ocasionalmente, los títulos principales pueden utilizar letras mayúsculas para generar un mayor impacto visual en secciones destacadas como el Hero.

### Paleta de Colores

[cite_start]Los colores de la marca están profundamente inspirados en los vibrantes paisajes, la flora, la avifauna y el arte cinético de Venezuela[cite: 1863, 1866, 1867, 1872, 1873, 1874]. A continuación, se detalla la paleta oficial para su implementación en la interfaz de usuario y el diseño gráfico:

| Categoría | Nombre del Color | Pantone | Código Hexadecimal |
| :--- | :--- | :--- | :--- |
| **Principal (85%)** | Azul Socado | 2189 C | [cite_start]#063547 [cite: 1426, 1427] |
| **Principal (85%)** | Celeste Socado | 2209 C | [cite_start]#5c8ea0 [cite: 1426, 1428, 1429] |
| **Principal (85%)** | Terra | 7585 C | [cite_start]#b45b38 [cite: 1426, 1436, 1437] |
| **Principal (85%)** | Ivory | 9285 C | [cite_start]#f2eae6 [cite: 1426, 1438, 1439] |
| **Secundario (15%)** | Gris Metrópolis | 444 C | [cite_start]#6e7c7c [cite: 1441, 1442, 1443] |
| **Secundario (15%)** | Verde Salvia | 4181 C | [cite_start]#6c7a67 [cite: 1441, 1444, 1446] |
| **Secundario (15%)** | Amarillo Tostado | 131 C | [cite_start]#cf8a00 [cite: 1441, 1450] |
| **Secundario (15%)** | Verde Century | 4183 C | [cite_start]#b2b5a9 [cite: 1441, 1452, 1454] |

<!-- END:nextjs-agent-rules -->
