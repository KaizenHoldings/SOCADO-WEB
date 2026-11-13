# Sticker Bolsa v2 · B — "Pide aquí" holográfico

Botón-sticker de la bolsa de café con efecto holográfico, listo para integrar.
Es un componente web (`<sticker-bolsa>`) en un solo archivo, sin dependencias y con
las imágenes embebidas: no hay rutas de assets que configurar.

## Contenido

| Archivo | Para qué |
|---|---|
| `sticker-bolsa.js` | **El componente.** Es lo único que necesitas copiar a tu proyecto. |
| `demo.html` | Ejemplo mínimo. Ábrelo con doble clic para verlo funcionando. |
| `assets/` | Los SVG por separado (bolsa, isotipo, etiqueta, máscara), por si los quieres editar. |
| `fuente-claude-design/` | El diseño original (`.dc.html`) con tus tweaks guardados como valores por defecto. |

## Uso

```html
<script src="sticker-bolsa.js"></script>

<sticker-bolsa id="pedir"></sticker-bolsa>

<script>
  document.getElementById('pedir').addEventListener('click', () => {
    // tu acción: abrir el pedido, navegar, etc.
  });
</script>
```

Si solo debe llevar a una página, usa `href` y el sticker pasa a ser un enlace:

```html
<sticker-bolsa href="/pedir"></sticker-bolsa>
```

## Opciones

Sin atributos, el sticker sale exactamente con los tweaks que elegiste.
Cada atributo se puede cambiar en cualquier momento y el sticker se actualiza solo.

| Atributo | Tu valor (por defecto) | Rango / opciones |
|---|---|---|
| `holo` | `cromo` | `aurora`, `arcoiris`, `prisma`, `disco`, `destellos`, `nacar`, `cromo`, `oro` |
| `intensity` | `0.75` | 0 – 1.5 |
| `glare` | `true` | `true` / `false` — reflejo de luz que sigue al cursor |
| `tilt` | `16` | 0 – 24 (grados de inclinación) |
| `float` | `true` | `true` / `false` — flotación en reposo |
| `attention` | `true` | `true` / `false` — meneo + destello periódico |
| `attention-interval` | `6.5` | 3 – 60 (segundos) |
| `entrance` | `true` | `true` / `false` — animación de entrada |
| `shadow-opacity` | `0.4` | 0 – 1 |
| `scale` | `1.4` | 1 = 300 × 328 px; con 1.4 mide 420 × 459 px |
| `label` | `Pide aquí` | texto para lectores de pantalla |
| `href`, `target`, `rel` | — | convierten el sticker en enlace |

El fondo era `transparent` en el diseño: el componente no pinta fondo, toma el de tu página.

Desde código también puedes lanzar el destello del clic:

```js
document.querySelector('sticker-bolsa').flash();
```

## En frameworks

- **React / Svelte / Astro / HTML plano:** importa o enlaza `sticker-bolsa.js` una vez y usa la etiqueta.
- **Vue:** indícale que es un elemento nativo para que no lo busque como componente:

  ```js
  // vite.config.js
  vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === 'sticker-bolsa' } } })
  ```

- Con bundler: `import './sticker-bolsa.js'` (se registra solo, una única vez).

## A tener en cuenta

- **Deja aire alrededor.** Al inclinarse y con la sombra, el sticker sobresale de su caja
  unos 30–40 px. Evita `overflow: hidden` pegado a sus bordes.
- **La entrada se dispara cuando el sticker aparece en pantalla** por primera vez (no al cargar la página).
- **Táctil:** responde al toque (se inclina hacia el dedo y lanza el destello al soltar).
- **Accesibilidad:** es un `<button>` (o `<a>` con `href`), se enfoca con Tab y se activa con Enter/Espacio.
  Con "reducir movimiento" activado en el sistema se desactivan la flotación, el meneo, la entrada
  y la inclinación; el holográfico sigue respondiendo al cursor.
- **Navegadores:** Chrome, Edge, Safari y Firefox actuales.

## Editar el diseño

`fuente-claude-design/BolsaV2-Propuesta.dc.html` es el artboard tal como quedó en el canvas,
con tus tweaks como valores por defecto. Sirve para volver a importarlo en Claude Design
y seguir iterando. `sticker-bolsa.js` es una traducción fiel de ese artboard a un componente
independiente: si cambias el diseño, hay que trasladar el cambio al componente.
