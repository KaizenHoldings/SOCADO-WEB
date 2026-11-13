/*!
 * <sticker-bolsa> — Sticker "Pide aquí" con efecto holográfico (Bolsa v2 · B)
 *
 * Componente web autocontenido: sin dependencias, sin archivos externos
 * (las imágenes van embebidas). Funciona en HTML plano, Vue, React, Svelte, etc.
 *
 *   <script src="sticker-bolsa.js"></script>
 *   <sticker-bolsa></sticker-bolsa>
 *
 * Atributos (todos opcionales; los valores por defecto son los tweaks elegidos):
 *   holo               aurora | arcoiris | prisma | disco | destellos | nacar | cromo | oro   (cromo)
 *   intensity          0 – 1.5      intensidad del holográfico                                (0.75)
 *   glare              true|false   reflejo de luz que sigue al cursor                        (true)
 *   tilt               0 – 24       inclinación máxima en grados                              (16)
 *   float              true|false   flotación en reposo                                       (true)
 *   attention          true|false   "llamado" periódico: meneo + destello                     (true)
 *   attention-interval segundos entre llamados                                                (6.5)
 *   entrance           true|false   animación de entrada al aparecer en pantalla              (true)
 *   shadow-opacity     0 – 1        opacidad de la sombra                                     (0.4)
 *   scale              tamaño; 1 = 300×328 px                                                 (1.4)
 *   label              texto accesible del botón                                              ("Pide aquí")
 *   href               si se define, el sticker es un enlace <a> en vez de un <button>
 *
 * Eventos: el clic normal del DOM ->  el.addEventListener('click', ...)
 * Métodos: el.flash()  lanza el destello del clic desde código.
 */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.customElements || customElements.get('sticker-bolsa')) return;

  var IMG = {
    bolsa: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NTAiIGhlaWdodD0iNjAxIiB2aWV3Qm94PSIwIDAgMTgzLjQ0IDIwMC40MyI+PHBhdGggZD0iTTM0OS4yNCw0MzUuMzNhMTQuMTgsMTQuMTgsMCwwLDEtNy4zLTJsLTY5LjA4LTQxLjQ5LTAuMzUtLjIxYTE0LjE3LDE0LjE3LDAsMCwxLTUuOTQtMTcuNDlsMTMtMzIuMjYsMC4xNy0uNDMsMjEuODEtNTQuMjVxMC4xOS0uNDYuNC0wLjkxbDExLjI0LTIzLjEzLDkuNDEtMTkuNTgsMC4yMS0uNDVhMTQuMTYsMTQuMTYsMCwwLDEsMTguNzUtNi45NGwzOC43MSwxNy42OGExNC4zLDE0LjMsMCwwLDEsMS42Ny45bDI5LjU2LDE1LjA4QTE0LjE3LDE0LjE3LDAsMCwxLDQxOCwyODguMjFsMC4xLDkuNTVhMTQuMTMsMTQuMTMsMCwwLDEtMi44Niw4LjY4TDQxNiwzNDMuMjJxMCwwLjE2LDAsLjMxQTE0Ljg5LDE0Ljg5LDAsMCwxLDQxNiwzNDVsLTQsMzgtMy4wOCwyOS42NGExNC4xNywxNC4xNywwLDAsMS0xMS4xOCwxMi4zOWwtNDIuNjUsOWMtMC4zNC4xNi0uNjksMC4zLTEsMC40MmExNC4xNSwxNC4xNSwwLDAsMS00LjgxLjg0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzQ5LjI0LDQyOS42NmE4LjUxLDguNTEsMCwwLDEtNC4zOC0xLjIxbC02OS40Ny00MS43MmE4LjUsOC41LDAsMCwxLTMuNTYtMTAuNDlsMzUtODYuOTRjMC4wNy0uMTguMTUtMC4zNywwLjI0LTAuNTRsMTEuMjQtMjMuMTNMMzI3LjcsMjQ2bDAuMjMtLjQ4YTguNSw4LjUsMCwwLDEsMTEuMjUtNC4xNkwzNzcuODgsMjU5YTguNjQsOC42NCwwLDAsMSwxLjE5LjY2bDI5LjgyLDE1LjIxYTguNTEsOC41MSwwLDAsMSwzLjczLDExLjRsLTAuMzIuNjQsMC4xMSwxMC44OWE4LjUsOC41LDAsMCwxLTIuOTEsNi40OXMwLjg2LDM5LjE2Ljg2LDM5LjIyYzAsMC4yOSwwLC42MywwLDAuOTJsLTQsMzgtMy4wOCwyOS42M2E4LjUxLDguNTEsMCwwLDEtNi43MSw3LjQzbC00My4zMyw5LjExYTguNTIsOC41MiwwLDAsMS00LDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjxwYXRoIGQ9Ik00MDMuNTMsMjg1LjE5bDEuMjUtMi40OEwzNzQuMDcsMjY3bDAtLjA1LTM4LjcxLTE3LjY4LTAuMjUuNTQtOS40OCwxOS43Mi0xMS4yNCwyMy4xM0wyOTIuNjEsMzQ3bC0wLjE1LjM4LTEzLDMyLjMxLDAuNDQsMC4yNkwzNDksNDIxLjRsMC4xMy0uMzcsNDUuNDUtOS41NiwwLjE2LTEuNTIsMi45Mi0yOC4xLDQtMzh2MGwtMS00NS4zOCwzLS4yNVpNMzQ4LjM1LDQxOS42MkwyODEsMzc5LjE1bDEyLjM1LTMwLjc0LDY3LDM3LjI1Wk0zNjcuMTksMzgxbC0wLjY4LDIuODktMTIuOCwyNEwzNjIsMzg0LjQzWm0tNC41NywxLjU1LDEyLjY5LTM2LjE0LTcuNzIsMzIuOVptMzAuODUsMjcuOS00My44OSw5LjIzLDEuNTEtNC4yOCwxNi0zMCwyNi40NiwyNC42N1ptMC4xOS0xLjg1LTI2LTI0LjI2LDAuOTEtMy45MSwyNy44NSwxLjg4Wm0yLjg2LTI3LjQ4LTI3LjY5LTEuODdMMzc5LDMzNS44OGwyLjItNi4yNiwxOC4wOC0zNiwxLjExLDUwLjE2Wm00LjA2LTg0LTAuMTMtNS44NywxLjkxLTMuOCwwLjA5LDkuNTJabS0yMC40OCwzMi0xOS40Myw1NS4zMi0wLjIzLS4xMy02Ni42Ny0zNy4wOSwyMS43NS01NC4xMSwxMS4yMi0yMy4wOEwzMzYsMjUwLjlsMzcuMjgsMTdhMC41NSwwLjU1LDAsMCwwLC4xNy4xM2wyOS43NiwxNS4xOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTM2LjkxIDYyLjE1IDEzNS4wNCA2Mi4zIDEzNC45MSA1Ni40MyAxMzYuODIgNTIuNjMgMTM2LjkxIDYyLjE1IiBmaWxsPSIjMDYzNzQ3Ii8+PHBvbHlnb24gcG9pbnRzPSIxMjcuOTcgMTc1LjIyIDEyNy45MyAxNzUuNTggODQuMDQgMTg0LjgxIDg1LjU1IDE4MC41MyAxMDEuNTEgMTUwLjU1IDEyNy45NyAxNzUuMjIiIGZpbGw9IiMwNjM3NDciLz48cG9seWdvbiBwb2ludHM9IjEwOS43NyAxMTEuNTQgMTAyLjA1IDE0NC40NCA5Ny4wOCAxNDcuNjggMTA5Ljc3IDExMS41NCIgZmlsbD0iIzA2Mzc0NyIvPjxwb2x5Z29uIHBvaW50cz0iMTMwLjg2IDE0Ny40NCAxMjguMTIgMTczLjczIDEwMi4xIDE0OS40NyAxMDMuMDEgMTQ1LjU2IDEzMC44NiAxNDcuNDQiIGZpbGw9IiMwNjM3NDciLz48cG9seWdvbiBwb2ludHM9IjEzNC44NyAxMDguODcgMTMwLjk4IDE0Ni4yNSAxMDMuMjkgMTQ0LjM4IDExMy40OCAxMDAuOTggMTE1LjY4IDk0LjcyIDEzMy43NiA1OC43MSAxMzQuODcgMTA4Ljg3IiBmaWxsPSIjMDYzNzQ3Ii8+PHBvbHlnb24gcG9pbnRzPSIxMDEuNjUgMTQ2LjEzIDEwMC45NyAxNDkuMDIgODguMTcgMTczLjA2IDk2LjQzIDE0OS41MyAxMDEuNjUgMTQ2LjEzIiBmaWxsPSIjMDYzNzQ3Ii8+PHBvbHlnb24gcG9pbnRzPSI5NC43MyAxNTAuNzYgODIuODEgMTg0LjcyIDE1LjQyIDE0NC4yNSAyNy43NyAxMTMuNTEgOTQuNzMgMTUwLjc2IiBmaWxsPSIjMDYzNzQ3Ii8+PHBhdGggZD0iTTQwMy4xOCwyODMuMjRMMzgwLjEsMzI5LjE5bC0xOS40Myw1NS4zMi0wLjIzLS4xMy02Ni42Ny0zNy4wOSwyMS43NS01NC4xMSwxMS4yMi0yMy4wOEwzMzYsMjUwLjlsMzcuMjgsMTdhMC41NSwwLjU1LDAsMCwwLC4xNy4xM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjxwYXRoIGQ9Ik0zMzkuNzcsMzI1LjM5YTEuMDUsMS4wNSwwLDAsMS0xLjI5LS44MiwxOS41NiwxOS41NiwwLDAsMSwyLTEyLjY2QTE4LjI4LDE4LjI4LDAsMCwxLDM1MSwzMDIuNzhhMS4wNiwxLjA2LDAsMCwxLDEuMzYuNzVsMC4xOCwwLjc0YTEsMSwwLDAsMS0uNjksMS4yMywxNS40NSwxNS40NSwwLDAsMC04Ljg4LDcuNzNBMTYuNzQsMTYuNzQsMCwwLDAsMzQxLjMsMzI0YTEsMSwwLDAsMS0uNzgsMS4yMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMzYuNCwzMzYuMzVsLTAuMTgtLjc1YTEsMSwwLDAsMSwuNjgtMS4yMywxNS40NSwxNS40NSwwLDAsMCw4Ljg4LTcuNzMsMTYuNzUsMTYuNzUsMCwwLDAsMS43MS0xMC43NiwxLDEsMCwwLDEsLjc4LTEuMjFsMC43NS0uMThhMS4wNSwxLjA1LDAsMCwxLDEuMjkuODIsMTkuNTcsMTkuNTcsMCwwLDEtMiwxMi42NiwxOC4yOSwxOC4yOSwwLDAsMS0xMC41OCw5LjEzLDEuMDYsMS4wNiwwLDAsMS0xLjM2LS43NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjZmZmIi8+PC9zdmc+Cg==',
    base: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NTAiIGhlaWdodD0iNjAxIiB2aWV3Qm94PSIwIDAgMTgzLjQ0IDIwMC40MyI+PHBhdGggZD0iTTM0OS4yNCw0MzUuMzNhMTQuMTgsMTQuMTgsMCwwLDEtNy4zLTJsLTY5LjA4LTQxLjQ5LTAuMzUtLjIxYTE0LjE3LDE0LjE3LDAsMCwxLTUuOTQtMTcuNDlsMTMtMzIuMjYsMC4xNy0uNDMsMjEuODEtNTQuMjVxMC4xOS0uNDYuNC0wLjkxbDExLjI0LTIzLjEzLDkuNDEtMTkuNTgsMC4yMS0uNDVhMTQuMTYsMTQuMTYsMCwwLDEsMTguNzUtNi45NGwzOC43MSwxNy42OGExNC4zLDE0LjMsMCwwLDEsMS42Ny45bDI5LjU2LDE1LjA4QTE0LjE3LDE0LjE3LDAsMCwxLDQxOCwyODguMjFsMC4xLDkuNTVhMTQuMTMsMTQuMTMsMCwwLDEtMi44Niw4LjY4TDQxNiwzNDMuMjJxMCwwLjE2LDAsLjMxQTE0Ljg5LDE0Ljg5LDAsMCwxLDQxNiwzNDVsLTQsMzgtMy4wOCwyOS42NGExNC4xNywxNC4xNywwLDAsMS0xMS4xOCwxMi4zOWwtNDIuNjUsOWMtMC4zNC4xNi0uNjksMC4zLTEsMC40MmExNC4xNSwxNC4xNSwwLDAsMS00LjgxLjg0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzQ5LjI0LDQyOS42NmE4LjUxLDguNTEsMCwwLDEtNC4zOC0xLjIxbC02OS40Ny00MS43MmE4LjUsOC41LDAsMCwxLTMuNTYtMTAuNDlsMzUtODYuOTRjMC4wNy0uMTguMTUtMC4zNywwLjI0LTAuNTRsMTEuMjQtMjMuMTNMMzI3LjcsMjQ2bDAuMjMtLjQ4YTguNSw4LjUsMCwwLDEsMTEuMjUtNC4xNkwzNzcuODgsMjU5YTguNjQsOC42NCwwLDAsMSwxLjE5LjY2bDI5LjgyLDE1LjIxYTguNTEsOC41MSwwLDAsMSwzLjczLDExLjRsLTAuMzIuNjQsMC4xMSwxMC44OWE4LjUsOC41LDAsMCwxLTIuOTEsNi40OXMwLjg2LDM5LjE2Ljg2LDM5LjIyYzAsMC4yOSwwLC42MywwLDAuOTJsLTQsMzgtMy4wOCwyOS42M2E4LjUxLDguNTEsMCwwLDEtNi43MSw3LjQzbC00My4zMyw5LjExYTguNTIsOC41MiwwLDAsMS00LDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjxwYXRoIGQ9Ik00MDMuNTMsMjg1LjE5bDEuMjUtMi40OEwzNzQuMDcsMjY3bDAtLjA1LTM4LjcxLTE3LjY4LTAuMjUuNTQtOS40OCwxOS43Mi0xMS4yNCwyMy4xM0wyOTIuNjEsMzQ3bC0wLjE1LjM4LTEzLDMyLjMxLDAuNDQsMC4yNkwzNDksNDIxLjRsMC4xMy0uMzcsNDUuNDUtOS41NiwwLjE2LTEuNTIsMi45Mi0yOC4xLDQtMzh2MGwtMS00NS4zOCwzLS4yNVpNMzQ4LjM1LDQxOS42MkwyODEsMzc5LjE1bDEyLjM1LTMwLjc0LDY3LDM3LjI1Wk0zNjcuMTksMzgxbC0wLjY4LDIuODktMTIuOCwyNEwzNjIsMzg0LjQzWm0tNC41NywxLjU1LDEyLjY5LTM2LjE0LTcuNzIsMzIuOVptMzAuODUsMjcuOS00My44OSw5LjIzLDEuNTEtNC4yOCwxNi0zMCwyNi40NiwyNC42N1ptMC4xOS0xLjg1LTI2LTI0LjI2LDAuOTEtMy45MSwyNy44NSwxLjg4Wm0yLjg2LTI3LjQ4LTI3LjY5LTEuODdMMzc5LDMzNS44OGwyLjItNi4yNiwxOC4wOC0zNiwxLjExLDUwLjE2Wm00LjA2LTg0LTAuMTMtNS44NywxLjkxLTMuOCwwLjA5LDkuNTJabS0yMC40OCwzMi0xOS40Myw1NS4zMi0wLjIzLS4xMy02Ni42Ny0zNy4wOSwyMS43NS01NC4xMSwxMS4yMi0yMy4wOEwzMzYsMjUwLjlsMzcuMjgsMTdhMC41NSwwLjU1LDAsMCwwLC4xNy4xM2wyOS43NiwxNS4xOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTM2LjkxIDYyLjE1IDEzNS4wNCA2Mi4zIDEzNC45MSA1Ni40MyAxMzYuODIgNTIuNjMgMTM2LjkxIDYyLjE1IiBmaWxsPSIjMDYzNzQ3Ii8+PHBvbHlnb24gcG9pbnRzPSIxMjcuOTcgMTc1LjIyIDEyNy45MyAxNzUuNTggODQuMDQgMTg0LjgxIDg1LjU1IDE4MC41MyAxMDEuNTEgMTUwLjU1IDEyNy45NyAxNzUuMjIiIGZpbGw9IiMwNjM3NDciLz48cG9seWdvbiBwb2ludHM9IjEwOS43NyAxMTEuNTQgMTAyLjA1IDE0NC40NCA5Ny4wOCAxNDcuNjggMTA5Ljc3IDExMS41NCIgZmlsbD0iIzA2Mzc0NyIvPjxwb2x5Z29uIHBvaW50cz0iMTMwLjg2IDE0Ny40NCAxMjguMTIgMTczLjczIDEwMi4xIDE0OS40NyAxMDMuMDEgMTQ1LjU2IDEzMC44NiAxNDcuNDQiIGZpbGw9IiMwNjM3NDciLz48cG9seWdvbiBwb2ludHM9IjEzNC44NyAxMDguODcgMTMwLjk4IDE0Ni4yNSAxMDMuMjkgMTQ0LjM4IDExMy40OCAxMDAuOTggMTE1LjY4IDk0LjcyIDEzMy43NiA1OC43MSAxMzQuODcgMTA4Ljg3IiBmaWxsPSIjMDYzNzQ3Ii8+PHBvbHlnb24gcG9pbnRzPSIxMDEuNjUgMTQ2LjEzIDEwMC45NyAxNDkuMDIgODguMTcgMTczLjA2IDk2LjQzIDE0OS41MyAxMDEuNjUgMTQ2LjEzIiBmaWxsPSIjMDYzNzQ3Ii8+PHBvbHlnb24gcG9pbnRzPSI5NC43MyAxNTAuNzYgODIuODEgMTg0LjcyIDE1LjQyIDE0NC4yNSAyNy43NyAxMTMuNTEgOTQuNzMgMTUwLjc2IiBmaWxsPSIjMDYzNzQ3Ii8+PHBhdGggZD0iTTQwMy4xOCwyODMuMjRMMzgwLjEsMzI5LjE5bC0xOS40Myw1NS4zMi0wLjIzLS4xMy02Ni42Ny0zNy4wOSwyMS43NS01NC4xMSwxMS4yMi0yMy4wOEwzMzYsMjUwLjlsMzcuMjgsMTdhMC41NSwwLjU1LDAsMCwwLC4xNy4xM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjwvc3ZnPgo=',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NTAiIGhlaWdodD0iNjAxIiB2aWV3Qm94PSIwIDAgMTgzLjQ0IDIwMC40MyI+PHBhdGggZD0iTTMzOS43NywzMjUuMzlhMS4wNSwxLjA1LDAsMCwxLTEuMjktLjgyLDE5LjU2LDE5LjU2LDAsMCwxLDItMTIuNjZBMTguMjgsMTguMjgsMCwwLDEsMzUxLDMwMi43OGExLjA2LDEuMDYsMCwwLDEsMS4zNi43NWwwLjE4LDAuNzRhMSwxLDAsMCwxLS42OSwxLjIzLDE1LjQ1LDE1LjQ1LDAsMCwwLTguODgsNy43M0ExNi43NCwxNi43NCwwLDAsMCwzNDEuMywzMjRhMSwxLDAsMCwxLS43OCwxLjIxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTMzNi40LDMzNi4zNWwtMC4xOC0uNzVhMSwxLDAsMCwxLC42OC0xLjIzLDE1LjQ1LDE1LjQ1LDAsMCwwLDguODgtNy43MywxNi43NSwxNi43NSwwLDAsMCwxLjcxLTEwLjc2LDEsMSwwLDAsMSwuNzgtMS4yMWwwLjc1LS4xOGExLjA1LDEuMDUsMCwwLDEsMS4yOS44MiwxOS41NywxOS41NywwLDAsMS0yLDEyLjY2LDE4LjI5LDE4LjI5LDAsMCwxLTEwLjU4LDkuMTMsMS4wNiwxLjA2LDAsMCwxLTEuMzYtLjc1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48L3N2Zz4K',
    mask: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NTAiIGhlaWdodD0iNjAxIiB2aWV3Qm94PSIwIDAgMTgzLjQ0IDIwMC40MyI+PGRlZnM+PG1hc2sgaWQ9Im0iIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxODMuNDQiIGhlaWdodD0iMjAwLjQzIj48cmVjdCB3aWR0aD0iMTgzLjQ0IiBoZWlnaHQ9IjIwMC40MyIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0zNDkuMjQsNDM1LjMzYTE0LjE4LDE0LjE4LDAsMCwxLTcuMy0ybC02OS4wOC00MS40OS0wLjM1LS4yMWExNC4xNywxNC4xNywwLDAsMS01Ljk0LTE3LjQ5bDEzLTMyLjI2LDAuMTctLjQzLDIxLjgxLTU0LjI1cTAuMTktLjQ2LjQtMC45MWwxMS4yNC0yMy4xMyw5LjQxLTE5LjU4LDAuMjEtLjQ1YTE0LjE2LDE0LjE2LDAsMCwxLDE4Ljc1LTYuOTRsMzguNzEsMTcuNjhhMTQuMywxNC4zLDAsMCwxLDEuNjcuOWwyOS41NiwxNS4wOEExNC4xNywxNC4xNywwLDAsMSw0MTgsMjg4LjIxbDAuMSw5LjU1YTE0LjEzLDE0LjEzLDAsMCwxLTIuODYsOC42OEw0MTYsMzQzLjIycTAsMC4xNiwwLC4zMUExNC44OSwxNC44OSwwLDAsMSw0MTYsMzQ1bC00LDM4LTMuMDgsMjkuNjRhMTQuMTcsMTQuMTcsMCwwLDEtMTEuMTgsMTIuMzlsLTQyLjY1LDljLTAuMzQuMTYtLjY5LDAuMy0xLDAuNDJhMTQuMTUsMTQuMTUsMCwwLDEtNC44MS44NCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTM0OS4yNCw0MjkuNjZhOC41MSw4LjUxLDAsMCwxLTQuMzgtMS4yMWwtNjkuNDctNDEuNzJhOC41LDguNSwwLDAsMS0zLjU2LTEwLjQ5bDM1LTg2Ljk0YzAuMDctLjE4LjE1LTAuMzcsMC4yNC0wLjU0bDExLjI0LTIzLjEzTDMyNy43LDI0NmwwLjIzLS40OGE4LjUsOC41LDAsMCwxLDExLjI1LTQuMTZMMzc3Ljg4LDI1OWE4LjY0LDguNjQsMCwwLDEsMS4xOS42NmwyOS44MiwxNS4yMWE4LjUxLDguNTEsMCwwLDEsMy43MywxMS40bC0wLjMyLjY0LDAuMTEsMTAuODlhOC41LDguNSwwLDAsMS0yLjkxLDYuNDlzMC44NiwzOS4xNi44NiwzOS4yMmMwLDAuMjksMCwuNjMsMCwwLjkybC00LDM4LTMuMDgsMjkuNjNhOC41MSw4LjUxLDAsMCwxLTYuNzEsNy40M2wtNDMuMzMsOS4xMWE4LjUyLDguNTIsMCwwLDEtNCwxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDAzLjUzLDI4NS4xOWwxLjI1LTIuNDhMMzc0LjA3LDI2N2wwLS4wNS0zOC43MS0xNy42OC0wLjI1LjU0LTkuNDgsMTkuNzItMTEuMjQsMjMuMTNMMjkyLjYxLDM0N2wtMC4xNS4zOC0xMywzMi4zMSwwLjQ0LDAuMjZMMzQ5LDQyMS40bDAuMTMtLjM3LDQ1LjQ1LTkuNTYsMC4xNi0xLjUyLDIuOTItMjguMSw0LTM4djBsLTEtNDUuMzgsMy0uMjVaTTM0OC4zNSw0MTkuNjJMMjgxLDM3OS4xNWwxMi4zNS0zMC43NCw2NywzNy4yNVpNMzY3LjE5LDM4MWwtMC42OCwyLjg5LTEyLjgsMjRMMzYyLDM4NC40M1ptLTQuNTcsMS41NSwxMi42OS0zNi4xNC03LjcyLDMyLjlabTMwLjg1LDI3LjktNDMuODksOS4yMywxLjUxLTQuMjgsMTYtMzAsMjYuNDYsMjQuNjdabTAuMTktMS44NS0yNi0yNC4yNiwwLjkxLTMuOTEsMjcuODUsMS44OFptMi44Ni0yNy40OC0yNy42OS0xLjg3TDM3OSwzMzUuODhsMi4yLTYuMjYsMTguMDgtMzYsMS4xMSw1MC4xNlptNC4wNi04NC0wLjEzLTUuODcsMS45MS0zLjgsMC4wOSw5LjUyWm0tMjAuNDgsMzItMTkuNDMsNTUuMzItMC4yMy0uMTMtNjYuNjctMzcuMDksMjEuNzUtNTQuMTEsMTEuMjItMjMuMDhMMzM2LDI1MC45bDM3LjI4LDE3YTAuNTUsMC41NSwwLDAsMCwuMTcuMTNsMjkuNzYsMTUuMThaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiMwMDAiLz48cG9seWdvbiBwb2ludHM9IjEzNi45MSA2Mi4xNSAxMzUuMDQgNjIuMyAxMzQuOTEgNTYuNDMgMTM2LjgyIDUyLjYzIDEzNi45MSA2Mi4xNSIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTI3Ljk3IDE3NS4yMiAxMjcuOTMgMTc1LjU4IDg0LjA0IDE4NC44MSA4NS41NSAxODAuNTMgMTAxLjUxIDE1MC41NSAxMjcuOTcgMTc1LjIyIiBmaWxsPSIjZmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMDkuNzcgMTExLjU0IDEwMi4wNSAxNDQuNDQgOTcuMDggMTQ3LjY4IDEwOS43NyAxMTEuNTQiIGZpbGw9IiNmZmYiLz48cG9seWdvbiBwb2ludHM9IjEzMC44NiAxNDcuNDQgMTI4LjEyIDE3My43MyAxMDIuMSAxNDkuNDcgMTAzLjAxIDE0NS41NiAxMzAuODYgMTQ3LjQ0IiBmaWxsPSIjZmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMzQuODcgMTA4Ljg3IDEzMC45OCAxNDYuMjUgMTAzLjI5IDE0NC4zOCAxMTMuNDggMTAwLjk4IDExNS42OCA5NC43MiAxMzMuNzYgNTguNzEgMTM0Ljg3IDEwOC44NyIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTAxLjY1IDE0Ni4xMyAxMDAuOTcgMTQ5LjAyIDg4LjE3IDE3My4wNiA5Ni40MyAxNDkuNTMgMTAxLjY1IDE0Ni4xMyIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iOTQuNzMgMTUwLjc2IDgyLjgxIDE4NC43MiAxNS40MiAxNDQuMjUgMjcuNzcgMTEzLjUxIDk0LjczIDE1MC43NiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MDMuMTgsMjgzLjI0TDM4MC4xLDMyOS4xOWwtMTkuNDMsNTUuMzItMC4yMy0uMTMtNjYuNjctMzcuMDksMjEuNzUtNTQuMTEsMTEuMjItMjMuMDhMMzM2LDI1MC45bDM3LjI4LDE3YTAuNTUsMC41NSwwLDAsMCwuMTcuMTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48L21hc2s+PC9kZWZzPjxyZWN0IHdpZHRoPSIxODMuNDQiIGhlaWdodD0iMjAwLjQzIiBmaWxsPSIjMDAwIiBtYXNrPSJ1cmwoI20pIi8+PC9zdmc+Cg==',
    etiqueta: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NTAiIGhlaWdodD0iNjAxIiB2aWV3Qm94PSIwIDAgMTgzLjQ0IDIwMC40MyI+PHBhdGggZD0iTTQ0Ny4xOCwzNzkuMjJhMTQuMzMsMTQuMzMsMCwwLDAtMTIuODgtNy41MSwxNS4xNSwxNS4xNSwwLDAsMC01Ljg5LDEuMTNWMzcxLjRhNi4xOCw2LjE4LDAsMCwwLTYuMTctNi4xN2gtMy41MWE2LjE4LDYuMTgsMCwwLDAtNi4xNyw2LjE3djAuMzJhMTMuMTIsMTMuMTIsMCwwLDAtNC4yMS43NlYzNzEuNGE2LjE4LDYuMTgsMCwwLDAtNi4xNy02LjE3aC0zLjUxYTYuMTcsNi4xNywwLDAsMC02LjE3LDYuMTd2MS4yMWExMy41MiwxMy41MiwwLDAsMC00Ljg4LS45LDEzLDEzLDAsMCwwLTMuOTIuNTksNS45NCw1Ljk0LDAsMCwwLTItLjMzaC0zLjA5YTYuMTcsNi4xNywwLDAsMC02LjE3LDYuMTd2MjMuMzVhNi4yMiw2LjIyLDAsMCwwLC41OSwyLjYyLDYuMTYsNi4xNiwwLDAsMC0uMjUsNS45NGwwLjQsMC44MmExMC41NiwxMC41NiwwLDAsMC0xLjk1LDYuMjEsMTAuOTQsMTAuOTQsMCwwLDAsMS42OCw1LjksMTEuMzQsMTEuMzQsMCwwLDAsNC40Miw0LDEyLjQ0LDEyLjQ0LDAsMCwwLDUuODEsMS4zNywxNC4yLDE0LjIsMCwwLDAsNS0uOSw5LjA4LDkuMDgsMCwwLDAsMy42OS43NGMwLjMxLDAsLjY5LDAsMS4xNS0wLjA2YTEyLjI0LDEyLjI0LDAsMCwwLDEuNTYtLjIyLDYuMjYsNi4yNiwwLDAsMCwyLjQxLTEuMDhjMC4xLDAuMDUuMiwwLjEzLDAuMywwLjE5YTEyLjgxLDEyLjgxLDAsMCwwLDUuNTQsMS4zM3YwLjMxYTYuMTcsNi4xNywwLDAsMCw2LjE3LDYuMTdoMy41MmE2LjE3LDYuMTcsMCwwLDAsNi4xNi02LjE3VjQyOGExMi42MywxMi42MywwLDAsMCwzLjE4LjQxLDE0LjY4LDE0LjY4LDAsMCwwLDUuNC0xLDguODQsOC44NCwwLDAsMCwzLjgyLjg0LDEyLDEyLDAsMCwwLDEuMjMtLjA2cTAuNTUsMCwxLjQtLjJhNS4zMyw1LjMzLDAsMCwwLC42NC0wLjE3LDYuMiw2LjIsMCwwLDAsMS44LjI3aDMuNTJhNi4xNyw2LjE3LDAsMCwwLDYuMTYtNi4xN1Y0MDUuMzZhNS42OCw1LjY4LDAsMCwwLS4xMi0xLjIzbDEuMzgtMmE2LjIsNi4yLDAsMCwwLC4zNi02LjM3LDYuNjksNi42OSwwLDAsMC0uNzQtMS4wNywxMS42MSwxMS42MSwwLDAsMCwuNzUtMS40LDYuMjUsNi4yNSwwLDAsMCwuNTQtMi4zNyw2LjMzLDYuMzMsMCwwLDAsLjg5LTIuNDNjMC0uMjMuMDctMC41LDAuMS0wLjg0YTEyLjQ3LDEyLjQ3LDAsMCwwLC4wNS0xLjMxLDE0LjU1LDE0LjU1LDAsMCwwLTEuODEtNy4xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzg4LjA5LDM5NWE2LjU4LDYuNTgsMCwwLDEtMy41NC0uOTUsNy4wOSw3LjA5LDAsMCwxLTIuNDMtMi40N3Y5Ljg5aC0zLjUxVjM3OC4xNGgzLjF2M2E3LjIxLDcuMjEsMCwwLDEsMi40OS0yLjM3LDYuNjksNi42OSwwLDAsMSwzLjQxLS44OSw3LjI4LDcuMjgsMCwwLDEsMy4xNi42OCw3LjYsNy42LDAsMCwxLDIuNDksMS44OCw5LDksMCwwLDEsMi4yMyw2LDkuODksOS44OSwwLDAsMS0uOTQsNC4zMyw3Ljc5LDcuNzksMCwwLDEtMi42MiwzLjExLDYuNjEsNi42MSwwLDAsMS0zLjg1LDEuMTVtLTEuMTUtM2E0LjMyLDQuMzIsMCwwLDAsMi0uNDcsNSw1LDAsMCwwLDEuNTctMS4yNiw1Ljc1LDUuNzUsMCwwLDAsMS0xLjc5LDYuMjYsNi4yNiwwLDAsMCwuMzUtMi4wOCw2LDYsMCwwLDAtLjM4LTIuMTQsNS4yMiw1LjIyLDAsMCwwLTEuMS0xLjc2LDUuNDUsNS40NSwwLDAsMC0xLjY2LTEuMTksNC43OSw0Ljc5LDAsMCwwLTIuMDYtLjQ0LDQuMzQsNC4zNCwwLDAsMC0xLjQuMjUsNS42Miw1LjYyLDAsMCwwLTEuMzcuNjksNS4yLDUuMiwwLDAsMC0xLjEyLDEsMy42MSwzLjYxLDAsMCwwLS42NywxLjI1djQuMzNhNi42NSw2LjY1LDAsMCwwLDEuMTgsMS44LDUuOTEsNS45MSwwLDAsMCwxLjY5LDEuMjksNC4yNiw0LjI2LDAsMCwwLDEuOTUuNDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjxwYXRoIGQ9Ik0zOTguNjYsMzcxLjRoMy41MXYzLjg2aC0zLjUxVjM3MS40Wm0wLDYuNjFoMy41MVYzOTQuN2gtMy41MVYzNzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiMwNjM3NDciLz48cGF0aCBkPSJNNDA1LjMyLDM4Ni40NWE5LjQ5LDkuNDksMCwwLDEsMS00LjMyQTgsOCwwLDAsMSw0MDksMzc5YTYuNzQsNi43NCwwLDAsMSwzLjg5LTEuMTUsNi4zLDYuMywwLDAsMSwzLjQ2LDEsNy4yOSw3LjI5LDAsMCwxLDIuNDEsMi40NlYzNzEuNGgzLjUxdjE5LjM0YTEuMzEsMS4zMSwwLDAsMCwuMjIuODYsMSwxLDAsMCwwLC43My4yOXYyLjgxYTEwLjQyLDEwLjQyLDAsMCwxLTEuNTMuMTYsMi41MiwyLjUyLDAsMCwxLTEuNjgtLjU4LDEuODQsMS44NCwwLDAsMS0uNzItMS4zN2wwLTEuMjRhNi42NCw2LjY0LDAsMCwxLTIuNTgsMi40Nyw3LDcsMCwwLDEtMy4zOC44OCw3LjQ1LDcuNDUsMCwwLDEtNS43LTIuNTMsOC44LDguOCwwLDAsMS0xLjY2LTIuNzUsOS4xNCw5LjE0LDAsMCwxLS41OS0zLjI5bTEzLjQsMi4zdi00LjMxYTQuODYsNC44NiwwLDAsMC0xLjEzLTEuODEsNi4yNCw2LjI0LDAsMCwwLTEuNzYtMS4yNyw0LjM5LDQuMzksMCwwLDAtMS45My0uNDcsNC4zMiw0LjMyLDAsMCwwLTIsLjQ3LDUsNSwwLDAsMC0xLjU2LDEuMjYsNS43Miw1LjcyLDAsMCwwLTEsMS43OSw2LjMzLDYuMzMsMCwwLDAtLjM1LDIuMTEsNS44NCw1Ljg0LDAsMCwwLC4zOCwyLjEyLDUuNDQsNS40NCwwLDAsMCwxLjEsMS43Niw1LjE2LDUuMTYsMCwwLDAsMS42NiwxLjE5LDUsNSwwLDAsMCwyLjA2LjQyLDQuMjcsNC4yNywwLDAsMCwxLjQyLS4yNSw2LDYsMCwwLDAsMS4zNy0uNjksNC43Nyw0Ljc3LDAsMCwwLDEuMTItMSwzLjcyLDMuNzIsMCwwLDAsLjY1LTEuMjkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjxwYXRoIGQ9Ik00MzQuMjcsMzk1YTguODIsOC44MiwwLDAsMS0zLjUzLS42OCw4LjM3LDguMzcsMCwwLDEtNC41LTQuNTksOSw5LDAsMCwxLC40Ni03LjU1LDguNDEsOC40MSwwLDAsMSwzLTMuMTIsOC42MSw4LjYxLDAsMCwxLDQuNTYtMS4xOCw4LjE4LDguMTgsMCwwLDEsNy40Nyw0LjMsOC41LDguNSwwLDAsMSwxLjA1LDQuMTRxMCwwLjM4LDAsLjcxdC0wLjA2LjU1SDQyOS4zNWE1LjA5LDUuMDksMCwwLDAsMi42NSw0LjI0LDQuODksNC44OSwwLDAsMCwyLjM5LjYxLDUuMzksNS4zOSwwLDAsMCwyLjY2LS43LDMuNjMsMy42MywwLDAsMCwxLjcxLTEuODVsMywwLjg2YTYuNCw2LjQsMCwwLDEtMS42NCwyLjE5LDguMTYsOC4xNiwwLDAsMS0yLjYsMS41Myw5LjI3LDkuMjcsMCwwLDEtMy4yNi41Nm0tNS05Ljc2aDEwLjA4YTUsNSwwLDAsMC0uODEtMi40OSw1LjE3LDUuMTcsMCwwLDAtMS44Mi0xLjY5LDUsNSwwLDAsMC0yLjQ0LS42MSw0Ljg4LDQuODgsMCwwLDAtMi40MS42MSw1LDUsMCwwLDAtMS44LDEuNjksNS4xMiw1LjEyLDAsMCwwLS44LDIuNDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjxwYXRoIGQ9Ik0zNzcuNCw0MTcuMDhhNC40Miw0LjQyLDAsMCwxLC45MS0yLjc3LDUuODUsNS44NSwwLDAsMSwyLjUtMS44Myw5LjgxLDkuODEsMCwwLDEsMy43LS42NSwxNi44OCwxNi44OCwwLDAsMSwyLjI4LjE2LDksOSwwLDAsMSwyLjA2LjUxdi0xYTMuNSwzLjUsMCwwLDAtMS4wNS0yLjcsNC4zMSw0LjMxLDAsMCwwLTMtMSw3LjA5LDcuMDksMCwwLDAtMi42NS40OSwxNS45NCwxNS45NCwwLDAsMC0yLjY1LDEuMzlsLTEuMTgtMi4zNmExMy4zOCwxMy4zOCwwLDAsMSwzLjMzLTEuNjYsMTEuMzksMTEuMzksMCwwLDEsMy41My0uNTQsNy41Nyw3LjU3LDAsMCwxLDUuMjgsMS43NSw2LjM2LDYuMzYsMCwwLDEsMS45Myw1VjQxOGExLjM1LDEuMzUsMCwwLDAsLjIxLjg1LDEsMSwwLDAsMCwuNzIuMjh2Mi44MWE3LjgsNy44LDAsMCwxLS44Ni4xM2wtMC42NCwwYTIuMzcsMi4zNywwLDAsMS0xLjY5LS41NCwyLjEsMi4xLDAsMCwxLS42Ny0xLjI4bC0wLjEtMWE3LjE5LDcuMTksMCwwLDEtMi43OCwyLjE3LDguMjEsOC4yMSwwLDAsMS0zLjQxLjc3LDYuMzUsNi4zNSwwLDAsMS0zLS42OCw1LjE2LDUuMTYsMCwwLDEtMi0xLjg1LDQuODIsNC44MiwwLDAsMS0uNzQtMi42Mm0xMC42MywxYTQsNCwwLDAsMCwuNjEtMC44MiwxLjU0LDEuNTQsMCwwLDAsLjIyLTAuNzJ2LTEuODhhOS44Niw5Ljg2LDAsMCwwLTEuODgtLjUyQTExLjMyLDExLjMyLDAsMCwwLDM4NSw0MTRhNS43NSw1Ljc1LDAsMCwwLTMuMTEuNzUsMi4zMywyLjMzLDAsMCwwLTEuMiwyLjA3LDIuNjIsMi42MiwwLDAsMCwuNCwxLjM4LDMsMywwLDAsMCwxLjE1LDEuMDcsMy44NywzLjg3LDAsMCwwLDEuODcuNDEsNS42NSw1LjY1LDAsMCwwLDIuMi0uNDQsNC43NCw0Ljc0LDAsMCwwLDEuNjktMS4xMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjMDYzNzQ3Ii8+PHBhdGggZD0iTTQwMyw0MjIuMjNhNi41Niw2LjU2LDAsMCwxLTMtLjY4LDcuMjYsNy4yNiwwLDAsMS0yLjM1LTEuODYsOC40Niw4LjQ2LDAsMCwxLTEuNTEtMi43NSwxMC4yNiwxMC4yNiwwLDAsMS0uNTMtMy4zLDkuMjEsOS4yMSwwLDAsMSwuNTktMy4zMiw4LjQ1LDguNDUsMCwwLDEsMS42Ni0yLjcyLDcuNzksNy43OSwwLDAsMSwyLjUxLTEuODMsNy4yOCw3LjI4LDAsMCwxLDMuMS0uNjcsNi42Niw2LjY2LDAsMCwxLDMuNDYuOTIsNyw3LDAsMCwxLDIuNDQsMi4zN3YtM2gzLjF2MjMuMzZoLTMuNTF2LTkuODlhNi42NCw2LjY0LDAsMCwxLTYsMy40MW0xLjI4LTNhNC41NCw0LjU0LDAsMCwwLDEuOTMtLjQxLDUuMjUsNS4yNSwwLDAsMCwxLjU2LTEuMTEsNy43Miw3LjcyLDAsMCwwLDEuMi0xLjYxdi00LjM2YTMuNjcsMy42NywwLDAsMC0uNjItMS40LDUuNiw1LjYsMCwwLDAtMS4xMy0xLjE2LDUuMzksNS4zOSwwLDAsMC0xLjQ0LS44LDQuMzIsNC4zMiwwLDAsMC0xLjUtLjI4LDQuNDIsNC40MiwwLDAsMC0yLC40Nyw1LjIsNS4yLDAsMCwwLTEuNjEsMS4yNyw1Ljg1LDUuODUsMCwwLDAtMS4wNSwxLjgxLDYsNiwwLDAsMC0uMzcsMi4wOCw1LjgxLDUuODEsMCwwLDAsLjY1LDIuNzUsNS4zNSw1LjM1LDAsMCwwLDEuNzksMiw0LjYzLDQuNjMsMCwwLDAsMi42My43NiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjMDYzNzQ3Ii8+PHBhdGggZD0iTTQxNi40OSw0MTUuNDlWNDA1LjM1SDQyMHY5LjQyYTUuNjcsNS42NywwLDAsMCwuODEsMy4zNCwyLjc1LDIuNzUsMCwwLDAsMi4zOCwxLjEyLDQuODEsNC44MSwwLDAsMCwxLjkzLS40MSw1LjQsNS40LDAsMCwwLDEuNzItMS4yMSw2LjE4LDYuMTgsMCwwLDAsMS4yNi0xLjk0VjQwNS4zNWgzLjUxVjQxOGExLjI5LDEuMjksMCwwLDAsLjIyLjg1LDEsMSwwLDAsMCwuNzMuMjh2Mi44MXEtMC41NC4xLS44OSwwLjEzYy0wLjIzLDAtLjQ2LDAtMC42NywwYTIuNDQsMi40NCwwLDAsMS0xLjYtLjUyLDIsMiwwLDAsMS0uNzMtMS4zNWwtMC4wNi0xLjY1YTcuNDMsNy40MywwLDAsMS0yLjksMi43NCw4LjM1LDguMzUsMCwwLDEtMy45My45Myw0LjcyLDQuNzIsMCwwLDEtNC0xLjcxLDguMDUsOC4wNSwwLDAsMS0xLjM0LTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjUuNTQgLTIzNC45KSIgZmlsbD0iIzA2Mzc0NyIvPjxwYXRoIGQ9Ik00MzYuMDgsNDA1LjM2aDMuNTF2MTYuNTZoLTMuNTFWNDA1LjM2Wm0zLTIuNTItMi4zLS43LDEuODItMy41MWgzLjM1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjMDYzNzQ3Ii8+PC9zdmc+Cg=='
  };

  var DEFAULTS = {
    holo: 'cromo',
    intensity: 0.75,
    glare: true,
    tilt: 16,
    float: true,
    attention: true,
    attentionInterval: 6.5,
    entrance: true,
    shadowOpacity: 0.4,
    scale: 1.4,
    label: 'Pide aquí'
  };

  var HOLO_TYPES = ['aurora', 'arcoiris', 'prisma', 'disco', 'destellos', 'nacar', 'cromo', 'oro'];

  // Resortes [rigidez, amortiguación]: cursor, hover, presión del clic y destello del holográfico
  var SPRINGS = { px: [130, 13], py: [130, 13], h: [140, 24], pr: [520, 19], fl: [38, 13] };
  var KEYS = ['px', 'py', 'h', 'pr', 'fl'];

  var CSS = [
    ':host { display: inline-block; vertical-align: middle; -webkit-tap-highlight-color: transparent; }',
    ':host([hidden]) { display: none; }',
    '.sb-root { position: relative; width: calc(300px * var(--scale)); height: calc(328px * var(--scale));',
    '  --px: 0; --py: 0; --h: 0; --pr: 0; --fl: 0; --mag: 0; --gx: 0px; --gy: 0px; }',
    '.sb-btn { position: absolute; left: 0; top: 0; display: block; width: 300px; height: 328px; margin: 0; padding: 0; border: 0;',
    '  background: transparent; color: inherit; font: inherit; text-decoration: none; cursor: pointer;',
    '  transform: scale(var(--scale)); transform-origin: 0 0; touch-action: manipulation; }',
    '.sb-btn:focus { outline: none; }',
    '.sb-btn:focus-visible { outline: 3px solid hsl(196 90% 62%); outline-offset: 8px; border-radius: 28px; }',
    '.sb-fill, .sb-fill > img, .sb-label { position: absolute; inset: 0; }',
    'img { display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none; -webkit-user-drag: none; }',

    /* Capa holográfica: recortada a las zonas oscuras de la bolsa y fundida en "screen" sobre ella */
    '.sb-mask { position: absolute; inset: 0; overflow: hidden; mix-blend-mode: screen;',
    '  -webkit-mask: url("' + 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NTAiIGhlaWdodD0iNjAxIiB2aWV3Qm94PSIwIDAgMTgzLjQ0IDIwMC40MyI+PGRlZnM+PG1hc2sgaWQ9Im0iIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxODMuNDQiIGhlaWdodD0iMjAwLjQzIj48cmVjdCB3aWR0aD0iMTgzLjQ0IiBoZWlnaHQ9IjIwMC40MyIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0zNDkuMjQsNDM1LjMzYTE0LjE4LDE0LjE4LDAsMCwxLTcuMy0ybC02OS4wOC00MS40OS0wLjM1LS4yMWExNC4xNywxNC4xNywwLDAsMS01Ljk0LTE3LjQ5bDEzLTMyLjI2LDAuMTctLjQzLDIxLjgxLTU0LjI1cTAuMTktLjQ2LjQtMC45MWwxMS4yNC0yMy4xMyw5LjQxLTE5LjU4LDAuMjEtLjQ1YTE0LjE2LDE0LjE2LDAsMCwxLDE4Ljc1LTYuOTRsMzguNzEsMTcuNjhhMTQuMywxNC4zLDAsMCwxLDEuNjcuOWwyOS41NiwxNS4wOEExNC4xNywxNC4xNywwLDAsMSw0MTgsMjg4LjIxbDAuMSw5LjU1YTE0LjEzLDE0LjEzLDAsMCwxLTIuODYsOC42OEw0MTYsMzQzLjIycTAsMC4xNiwwLC4zMUExNC44OSwxNC44OSwwLDAsMSw0MTYsMzQ1bC00LDM4LTMuMDgsMjkuNjRhMTQuMTcsMTQuMTcsMCwwLDEtMTEuMTgsMTIuMzlsLTQyLjY1LDljLTAuMzQuMTYtLjY5LDAuMy0xLDAuNDJhMTQuMTUsMTQuMTUsMCwwLDEtNC44MS44NCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTM0OS4yNCw0MjkuNjZhOC41MSw4LjUxLDAsMCwxLTQuMzgtMS4yMWwtNjkuNDctNDEuNzJhOC41LDguNSwwLDAsMS0zLjU2LTEwLjQ5bDM1LTg2Ljk0YzAuMDctLjE4LjE1LTAuMzcsMC4yNC0wLjU0bDExLjI0LTIzLjEzTDMyNy43LDI0NmwwLjIzLS40OGE4LjUsOC41LDAsMCwxLDExLjI1LTQuMTZMMzc3Ljg4LDI1OWE4LjY0LDguNjQsMCwwLDEsMS4xOS42NmwyOS44MiwxNS4yMWE4LjUxLDguNTEsMCwwLDEsMy43MywxMS40bC0wLjMyLjY0LDAuMTEsMTAuODlhOC41LDguNSwwLDAsMS0yLjkxLDYuNDlzMC44NiwzOS4xNi44NiwzOS4yMmMwLDAuMjksMCwuNjMsMCwwLjkybC00LDM4LTMuMDgsMjkuNjNhOC41MSw4LjUxLDAsMCwxLTYuNzEsNy40M2wtNDMuMzMsOS4xMWE4LjUyLDguNTIsMCwwLDEtNCwxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDAzLjUzLDI4NS4xOWwxLjI1LTIuNDhMMzc0LjA3LDI2N2wwLS4wNS0zOC43MS0xNy42OC0wLjI1LjU0LTkuNDgsMTkuNzItMTEuMjQsMjMuMTNMMjkyLjYxLDM0N2wtMC4xNS4zOC0xMywzMi4zMSwwLjQ0LDAuMjZMMzQ5LDQyMS40bDAuMTMtLjM3LDQ1LjQ1LTkuNTYsMC4xNi0xLjUyLDIuOTItMjguMSw0LTM4djBsLTEtNDUuMzgsMy0uMjVaTTM0OC4zNSw0MTkuNjJMMjgxLDM3OS4xNWwxMi4zNS0zMC43NCw2NywzNy4yNVpNMzY3LjE5LDM4MWwtMC42OCwyLjg5LTEyLjgsMjRMMzYyLDM4NC40M1ptLTQuNTcsMS41NSwxMi42OS0zNi4xNC03LjcyLDMyLjlabTMwLjg1LDI3LjktNDMuODksOS4yMywxLjUxLTQuMjgsMTYtMzAsMjYuNDYsMjQuNjdabTAuMTktMS44NS0yNi0yNC4yNiwwLjkxLTMuOTEsMjcuODUsMS44OFptMi44Ni0yNy40OC0yNy42OS0xLjg3TDM3OSwzMzUuODhsMi4yLTYuMjYsMTguMDgtMzYsMS4xMSw1MC4xNlptNC4wNi04NC0wLjEzLTUuODcsMS45MS0zLjgsMC4wOSw5LjUyWm0tMjAuNDgsMzItMTkuNDMsNTUuMzItMC4yMy0uMTMtNjYuNjctMzcuMDksMjEuNzUtNTQuMTEsMTEuMjItMjMuMDhMMzM2LDI1MC45bDM3LjI4LDE3YTAuNTUsMC41NSwwLDAsMCwuMTcuMTNsMjkuNzYsMTUuMThaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiMwMDAiLz48cG9seWdvbiBwb2ludHM9IjEzNi45MSA2Mi4xNSAxMzUuMDQgNjIuMyAxMzQuOTEgNTYuNDMgMTM2LjgyIDUyLjYzIDEzNi45MSA2Mi4xNSIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTI3Ljk3IDE3NS4yMiAxMjcuOTMgMTc1LjU4IDg0LjA0IDE4NC44MSA4NS41NSAxODAuNTMgMTAxLjUxIDE1MC41NSAxMjcuOTcgMTc1LjIyIiBmaWxsPSIjZmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMDkuNzcgMTExLjU0IDEwMi4wNSAxNDQuNDQgOTcuMDggMTQ3LjY4IDEwOS43NyAxMTEuNTQiIGZpbGw9IiNmZmYiLz48cG9seWdvbiBwb2ludHM9IjEzMC44NiAxNDcuNDQgMTI4LjEyIDE3My43MyAxMDIuMSAxNDkuNDcgMTAzLjAxIDE0NS41NiAxMzAuODYgMTQ3LjQ0IiBmaWxsPSIjZmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMzQuODcgMTA4Ljg3IDEzMC45OCAxNDYuMjUgMTAzLjI5IDE0NC4zOCAxMTMuNDggMTAwLjk4IDExNS42OCA5NC43MiAxMzMuNzYgNTguNzEgMTM0Ljg3IDEwOC44NyIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTAxLjY1IDE0Ni4xMyAxMDAuOTcgMTQ5LjAyIDg4LjE3IDE3My4wNiA5Ni40MyAxNDkuNTMgMTAxLjY1IDE0Ni4xMyIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iOTQuNzMgMTUwLjc2IDgyLjgxIDE4NC43MiAxNS40MiAxNDQuMjUgMjcuNzcgMTEzLjUxIDk0LjczIDE1MC43NiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MDMuMTgsMjgzLjI0TDM4MC4xLDMyOS4xOWwtMTkuNDMsNTUuMzItMC4yMy0uMTMtNjYuNjctMzcuMDksMjEuNzUtNTQuMTEsMTEuMjItMjMuMDhMMzM2LDI1MC45bDM3LjI4LDE3YTAuNTUsMC41NSwwLDAsMCwuMTcuMTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48L21hc2s+PC9kZWZzPjxyZWN0IHdpZHRoPSIxODMuNDQiIGhlaWdodD0iMjAwLjQzIiBmaWxsPSIjMDAwIiBtYXNrPSJ1cmwoI20pIi8+PC9zdmc+Cg==' + '") center / contain no-repeat; mask: url("' + 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NTAiIGhlaWdodD0iNjAxIiB2aWV3Qm94PSIwIDAgMTgzLjQ0IDIwMC40MyI+PGRlZnM+PG1hc2sgaWQ9Im0iIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxODMuNDQiIGhlaWdodD0iMjAwLjQzIj48cmVjdCB3aWR0aD0iMTgzLjQ0IiBoZWlnaHQ9IjIwMC40MyIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0zNDkuMjQsNDM1LjMzYTE0LjE4LDE0LjE4LDAsMCwxLTcuMy0ybC02OS4wOC00MS40OS0wLjM1LS4yMWExNC4xNywxNC4xNywwLDAsMS01Ljk0LTE3LjQ5bDEzLTMyLjI2LDAuMTctLjQzLDIxLjgxLTU0LjI1cTAuMTktLjQ2LjQtMC45MWwxMS4yNC0yMy4xMyw5LjQxLTE5LjU4LDAuMjEtLjQ1YTE0LjE2LDE0LjE2LDAsMCwxLDE4Ljc1LTYuOTRsMzguNzEsMTcuNjhhMTQuMywxNC4zLDAsMCwxLDEuNjcuOWwyOS41NiwxNS4wOEExNC4xNywxNC4xNywwLDAsMSw0MTgsMjg4LjIxbDAuMSw5LjU1YTE0LjEzLDE0LjEzLDAsMCwxLTIuODYsOC42OEw0MTYsMzQzLjIycTAsMC4xNiwwLC4zMUExNC44OSwxNC44OSwwLDAsMSw0MTYsMzQ1bC00LDM4LTMuMDgsMjkuNjRhMTQuMTcsMTQuMTcsMCwwLDEtMTEuMTgsMTIuMzlsLTQyLjY1LDljLTAuMzQuMTYtLjY5LDAuMy0xLDAuNDJhMTQuMTUsMTQuMTUsMCwwLDEtNC44MS44NCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2NS41NCAtMjM0LjkpIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTM0OS4yNCw0MjkuNjZhOC41MSw4LjUxLDAsMCwxLTQuMzgtMS4yMWwtNjkuNDctNDEuNzJhOC41LDguNSwwLDAsMS0zLjU2LTEwLjQ5bDM1LTg2Ljk0YzAuMDctLjE4LjE1LTAuMzcsMC4yNC0wLjU0bDExLjI0LTIzLjEzTDMyNy43LDI0NmwwLjIzLS40OGE4LjUsOC41LDAsMCwxLDExLjI1LTQuMTZMMzc3Ljg4LDI1OWE4LjY0LDguNjQsMCwwLDEsMS4xOS42NmwyOS44MiwxNS4yMWE4LjUxLDguNTEsMCwwLDEsMy43MywxMS40bC0wLjMyLjY0LDAuMTEsMTAuODlhOC41LDguNSwwLDAsMS0yLjkxLDYuNDlzMC44NiwzOS4xNi44NiwzOS4yMmMwLDAuMjksMCwuNjMsMCwwLjkybC00LDM4LTMuMDgsMjkuNjNhOC41MSw4LjUxLDAsMCwxLTYuNzEsNy40M2wtNDMuMzMsOS4xMWE4LjUyLDguNTIsMCwwLDEtNCwxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDAzLjUzLDI4NS4xOWwxLjI1LTIuNDhMMzc0LjA3LDI2N2wwLS4wNS0zOC43MS0xNy42OC0wLjI1LjU0LTkuNDgsMTkuNzItMTEuMjQsMjMuMTNMMjkyLjYxLDM0N2wtMC4xNS4zOC0xMywzMi4zMSwwLjQ0LDAuMjZMMzQ5LDQyMS40bDAuMTMtLjM3LDQ1LjQ1LTkuNTYsMC4xNi0xLjUyLDIuOTItMjguMSw0LTM4djBsLTEtNDUuMzgsMy0uMjVaTTM0OC4zNSw0MTkuNjJMMjgxLDM3OS4xNWwxMi4zNS0zMC43NCw2NywzNy4yNVpNMzY3LjE5LDM4MWwtMC42OCwyLjg5LTEyLjgsMjRMMzYyLDM4NC40M1ptLTQuNTcsMS41NSwxMi42OS0zNi4xNC03LjcyLDMyLjlabTMwLjg1LDI3LjktNDMuODksOS4yMywxLjUxLTQuMjgsMTYtMzAsMjYuNDYsMjQuNjdabTAuMTktMS44NS0yNi0yNC4yNiwwLjkxLTMuOTEsMjcuODUsMS44OFptMi44Ni0yNy40OC0yNy42OS0xLjg3TDM3OSwzMzUuODhsMi4yLTYuMjYsMTguMDgtMzYsMS4xMSw1MC4xNlptNC4wNi04NC0wLjEzLTUuODcsMS45MS0zLjgsMC4wOSw5LjUyWm0tMjAuNDgsMzItMTkuNDMsNTUuMzItMC4yMy0uMTMtNjYuNjctMzcuMDksMjEuNzUtNTQuMTEsMTEuMjItMjMuMDhMMzM2LDI1MC45bDM3LjI4LDE3YTAuNTUsMC41NSwwLDAsMCwuMTcuMTNsMjkuNzYsMTUuMThaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiMwMDAiLz48cG9seWdvbiBwb2ludHM9IjEzNi45MSA2Mi4xNSAxMzUuMDQgNjIuMyAxMzQuOTEgNTYuNDMgMTM2LjgyIDUyLjYzIDEzNi45MSA2Mi4xNSIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTI3Ljk3IDE3NS4yMiAxMjcuOTMgMTc1LjU4IDg0LjA0IDE4NC44MSA4NS41NSAxODAuNTMgMTAxLjUxIDE1MC41NSAxMjcuOTcgMTc1LjIyIiBmaWxsPSIjZmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMDkuNzcgMTExLjU0IDEwMi4wNSAxNDQuNDQgOTcuMDggMTQ3LjY4IDEwOS43NyAxMTEuNTQiIGZpbGw9IiNmZmYiLz48cG9seWdvbiBwb2ludHM9IjEzMC44NiAxNDcuNDQgMTI4LjEyIDE3My43MyAxMDIuMSAxNDkuNDcgMTAzLjAxIDE0NS41NiAxMzAuODYgMTQ3LjQ0IiBmaWxsPSIjZmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMzQuODcgMTA4Ljg3IDEzMC45OCAxNDYuMjUgMTAzLjI5IDE0NC4zOCAxMTMuNDggMTAwLjk4IDExNS42OCA5NC43MiAxMzMuNzYgNTguNzEgMTM0Ljg3IDEwOC44NyIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iMTAxLjY1IDE0Ni4xMyAxMDAuOTcgMTQ5LjAyIDg4LjE3IDE3My4wNiA5Ni40MyAxNDkuNTMgMTAxLjY1IDE0Ni4xMyIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iOTQuNzMgMTUwLjc2IDgyLjgxIDE4NC43MiAxNS40MiAxNDQuMjUgMjcuNzcgMTEzLjUxIDk0LjczIDE1MC43NiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MDMuMTgsMjgzLjI0TDM4MC4xLDMyOS4xOWwtMTkuNDMsNTUuMzItMC4yMy0uMTMtNjYuNjctMzcuMDksMjEuNzUtNTQuMTEsMTEuMjItMjMuMDhMMzM2LDI1MC45bDM3LjI4LDE3YTAuNTUsMC41NSwwLDAsMCwuMTcuMTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY1LjU0IC0yMzQuOSkiIGZpbGw9IiNmZmYiLz48L21hc2s+PC9kZWZzPjxyZWN0IHdpZHRoPSIxODMuNDQiIGhlaWdodD0iMjAwLjQzIiBmaWxsPSIjMDAwIiBtYXNrPSJ1cmwoI20pIi8+PC9zdmc+Cg==' + '") center / contain no-repeat; }',
    '.sb-mask.h-cromo, .sb-mask.h-oro { mix-blend-mode: normal; }',

    /* Entrada: el sticker "se pega" con rebote; la etiqueta solo aparece, sin moverse */
    '.sb-root.has-entrance .sb-enter, .sb-root.has-entrance .sb-label { opacity: 0; }',
    '.sb-root.has-entrance.is-in .sb-enter { animation: sb-enter 900ms cubic-bezier(0.2, 1.35, 0.35, 1) both; }',
    '.sb-root.has-entrance.is-in .sb-label { animation: sb-label-in 450ms ease-out 520ms both; }',
    '@keyframes sb-enter { 0% { opacity: 0; transform: translateY(34px) scale(0.5) rotate(-18deg); } 45% { opacity: 1; } 100% { opacity: 1; transform: none; } }',
    '@keyframes sb-label-in { from { opacity: 0; } to { opacity: 1; } }',

    /* Reposo: flotación + llamado periódico. Se atenúan con --idle / --call (1 en reposo, 0 con el cursor encima) */
    '.sb-wiggle { transform-origin: 50% 86%; animation: sb-wiggle var(--interval) ease-in-out infinite; }',
    '.sb-float { animation: sb-float 5s ease-in-out infinite; }',
    '.sb-shadow-breathe { animation: sb-shadow-breathe 5s ease-in-out infinite; }',
    '@keyframes sb-float {',
    '  0%, 100% { transform: translateY(calc(var(--idle) * 3px)) rotate(calc(var(--idle) * -0.7deg)); }',
    '  50% { transform: translateY(calc(var(--idle) * -6px)) rotate(calc(var(--idle) * 0.7deg)); } }',
    '@keyframes sb-shadow-breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.965) translateY(3px); opacity: 0.78; } }',
    '@keyframes sb-wiggle {',
    '  0%, 70%, 100% { transform: rotate(0deg) scale(1); }',
    '  73.5% { transform: rotate(calc(var(--call) * -4.5deg)) scale(calc(1 + var(--call) * 0.04)); }',
    '  77.5% { transform: rotate(calc(var(--call) * 3.6deg)) scale(calc(1 + var(--call) * 0.04)); }',
    '  81.5% { transform: rotate(calc(var(--call) * -2.5deg)) scale(calc(1 + var(--call) * 0.025)); }',
    '  85.5% { transform: rotate(calc(var(--call) * 1.5deg)) scale(calc(1 + var(--call) * 0.012)); }',
    '  89.5% { transform: rotate(calc(var(--call) * -0.8deg)) scale(1); }',
    '  94% { transform: rotate(calc(var(--call) * 0.3deg)) scale(1); } }',

    /* Sombra: silueta desenfocada que se queda "en la mesa"; al levantar el sticker se aleja y se aclara */
    '.sb-shadow { transform: translate3d(calc(var(--px) * -12px), calc(12px + var(--h) * 10px - var(--pr) * 13px - var(--py) * 8px), 0) scale(calc(1 + var(--h) * 0.03 - var(--pr) * 0.05));',
    '  opacity: calc(var(--sh) * (1 - var(--h) * 0.3)); }',
    '.sb-shadow img { filter: brightness(0) blur(9px); }',

    /* Inclinación 3D con perspectiva: el lado bajo el cursor se hunde, el sticker se levanta y cede al presionar */
    '.sb-tilt { will-change: transform; filter: drop-shadow(0 1.5px 0 rgb(6 30 40 / 0.3));',
    '  transform: perspective(900px)',
    '    translate3d(calc(var(--px) * var(--mv) * 5px), calc(var(--py) * var(--mv) * 5px - var(--h) * var(--mv) * 4px), 0)',
    '    rotateX(calc(var(--py) * var(--tilt) * -1deg)) rotateY(calc(var(--px) * var(--tilt) * 1deg))',
    '    scale(calc(1 + var(--h) * 0.05 - var(--pr) * 0.08)); }',
    '.sb-logo { transform: translate3d(calc(var(--px) * var(--mv) * 3.5px), calc(var(--py) * var(--mv) * 3.5px), 0); }',
    '.sb-label { filter: drop-shadow(0 3px 5px rgb(4 20 30 / var(--lsh))); }',

    /* Lámina holográfica, reflejo y destellos */
    '.sb-tex, .sb-foil, .sb-glare, .sb-auto, .sb-burst { position: absolute; pointer-events: none; }',
    '.sb-tex { inset: 0; }',
    '.sb-foil { inset: -60%; will-change: transform; transform: translate3d(calc(var(--px) * -26%), calc(var(--py) * -26%), 0);',
    '  opacity: calc((0.26 + var(--h) * 0.2 + var(--mag) * 0.4 + var(--fl) * 0.35) * var(--int)); }',
    '.sb-glare { inset: -50%; transform: translate3d(var(--gx), var(--gy), 0); opacity: calc(var(--h) * var(--glare));',
    '  background: radial-gradient(circle at 50% 50%, rgb(255 255 255 / 0.62) 0%, rgb(255 255 255 / 0.22) 15%, rgb(255 255 255 / 0) 36%); }',
    '.sb-auto, .sb-burst { inset: -100%; opacity: 0;',
    '  background: linear-gradient(115deg, transparent 44%, rgb(255 255 255 / 0.28) 47.5%, rgb(255 255 255 / 0.85) 50%, rgb(255 255 255 / 0.28) 52.5%, transparent 56%); }',
    '.sb-auto { animation: sb-auto var(--interval) cubic-bezier(0.45, 0, 0.25, 1) infinite; }',
    '.sb-burst.is-on { animation: sb-burst 650ms cubic-bezier(0.3, 0, 0.2, 1) both; }',
    '@keyframes sb-auto { 0%, 66% { transform: translate3d(-34%, -34%, 0); opacity: 0; } 70% { opacity: var(--auto); } 84% { opacity: var(--auto); } 90%, 100% { transform: translate3d(34%, 34%, 0); opacity: 0; } }',
    '@keyframes sb-burst { 0% { transform: translate3d(-34%, -34%, 0); opacity: 0; } 15% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translate3d(34%, 34%, 0); opacity: 0; } }',

    /* Tipos de holográfico */
    '.h-aurora .sb-foil { background-image: repeating-linear-gradient(115deg, hsl(196 90% 62%) 0%, hsl(226 85% 70%) 8%, hsl(170 80% 58%) 17%, hsl(262 75% 72%) 26%, hsl(196 90% 62%) 34%); }',
    '.h-arcoiris .sb-foil { background-image: repeating-linear-gradient(115deg, hsl(0 92% 62%) 0%, hsl(40 96% 58%) 5.5%, hsl(92 85% 55%) 11%, hsl(165 90% 52%) 17%, hsl(205 96% 60%) 23%, hsl(265 92% 70%) 29%, hsl(320 92% 64%) 35%, hsl(360 92% 62%) 40%); }',
    '.h-prisma .sb-foil { background-image: repeating-linear-gradient(100deg, hsl(0 95% 62%) 0%, hsl(45 100% 58%) 3%, hsl(120 90% 55%) 6%, hsl(185 100% 55%) 9%, hsl(235 100% 68%) 12%, hsl(300 95% 65%) 15%, hsl(360 95% 62%) 18%); }',
    '.h-prisma .sb-tex { -webkit-mask-image: repeating-linear-gradient(-38deg, #000 0 1.4px, rgb(0 0 0 / 0.22) 1.4px 4.2px); mask-image: repeating-linear-gradient(-38deg, #000 0 1.4px, rgb(0 0 0 / 0.22) 1.4px 4.2px); }',
    '.h-disco .sb-foil { background-image: repeating-conic-gradient(from 20deg at 50% 50%, hsl(0 92% 62%) 0deg, hsl(48 98% 58%) 10deg, hsl(125 88% 55%) 20deg, hsl(188 98% 56%) 30deg, hsl(240 98% 70%) 40deg, hsl(305 92% 65%) 50deg, hsl(360 92% 62%) 60deg);',
    '  transform: translate3d(calc(var(--px) * 18%), calc(var(--py) * 18%), 0) rotate(calc(var(--px) * 50deg + var(--py) * 30deg)); }',
    '.h-disco .sb-tex { -webkit-mask-image: repeating-radial-gradient(circle at 42% 38%, #000 0 1.2px, rgb(0 0 0 / 0.38) 1.2px 4px); mask-image: repeating-radial-gradient(circle at 42% 38%, #000 0 1.2px, rgb(0 0 0 / 0.38) 1.2px 4px); }',
    '.h-destellos .sb-foil { background-image: repeating-linear-gradient(115deg, hsl(0 100% 72%) 0%, hsl(45 100% 68%) 4%, hsl(110 95% 64%) 8%, hsl(180 100% 64%) 12%, hsl(225 100% 76%) 16%, hsl(295 100% 74%) 20%, hsl(360 100% 72%) 24%); opacity: calc((0.6 + var(--h) * 0.4) * var(--int)); }',
    '.h-destellos .sb-tex {',
    '  --dots: radial-gradient(circle at 12% 18%, #000 0 1.2px, transparent 2px), radial-gradient(circle at 58% 41%, #000 0 1.8px, transparent 2.7px),',
    '    radial-gradient(circle at 83% 77%, #000 0 1px, transparent 1.7px), radial-gradient(circle at 31% 88%, #000 0 1.4px, transparent 2.2px),',
    '    radial-gradient(circle at 22% 61%, #000 0 2.2px, transparent 3.2px), radial-gradient(circle at 71% 14%, #000 0 1.2px, transparent 2px),',
    '    radial-gradient(circle at 47% 36%, #000 0 0.9px, transparent 1.6px), radial-gradient(circle at 90% 52%, #000 0 1.5px, transparent 2.3px),',
    '    radial-gradient(circle at 40% 25%, #000 0 1px, transparent 1.7px), radial-gradient(circle at 76% 70%, #000 0 1.3px, transparent 2.1px),',
    '    radial-gradient(circle at 10% 55%, #000 0 0.8px, transparent 1.5px), linear-gradient(rgb(0 0 0 / 0.13), rgb(0 0 0 / 0.13));',
    '  --dots-size: 67px 71px, 67px 71px, 67px 71px, 67px 71px, 97px 89px, 97px 89px, 97px 89px, 97px 89px, 53px 59px, 53px 59px, 53px 59px, auto;',
    '  -webkit-mask-image: var(--dots); mask-image: var(--dots); -webkit-mask-size: var(--dots-size); mask-size: var(--dots-size); }',
    '.h-destellos .sb-tex::before, .h-destellos .sb-tex::after { content: ""; position: absolute; inset: 0; opacity: 0;',
    '  background-image: radial-gradient(circle at 18% 30%, #fff 0 1.5px, transparent 2.6px), radial-gradient(circle at 64% 72%, #fff 0 1.1px, transparent 2px), radial-gradient(circle at 86% 22%, #fff 0 1.3px, transparent 2.3px);',
    '  background-size: 83px 79px, 83px 79px, 83px 79px; animation: sb-twinkle 2.8s ease-in-out infinite; }',
    '.h-destellos .sb-tex::after { background-size: 71px 91px, 71px 91px, 71px 91px; background-position: 37px 23px; animation-delay: -1.4s; }',
    '@keyframes sb-twinkle { 0%, 100% { opacity: 0; } 50% { opacity: var(--int); } }',
    '.h-nacar .sb-foil { background-image: repeating-linear-gradient(125deg, hsl(332 92% 72%) 0%, hsl(192 90% 64%) 12%, hsl(56 95% 70%) 24%, hsl(282 80% 72%) 36%, hsl(332 92% 72%) 48%); opacity: calc((0.2 + var(--h) * 0.14 + var(--mag) * 0.3 + var(--fl) * 0.3) * var(--int)); }',
    '.h-cromo .sb-foil { background-image: repeating-linear-gradient(115deg, hsl(210 30% 97% / 0.95) 0%, hsl(210 16% 60% / 0.3) 7%, hsl(205 30% 86% / 0.8) 13%, hsl(215 16% 50% / 0.18) 21%, hsl(210 24% 74% / 0.6) 27%, hsl(210 30% 97% / 0.95) 34%); opacity: calc((0.34 + var(--h) * 0.26 + var(--mag) * 0.4 + var(--fl) * 0.3) * var(--int)); }',
    '.h-oro .sb-foil { background-image: repeating-linear-gradient(115deg, hsl(48 100% 76% / 0.95) 0%, hsl(36 92% 48% / 0.35) 8%, hsl(44 98% 60% / 0.85) 15%, hsl(30 88% 40% / 0.2) 23%, hsl(50 100% 84% / 1) 30%, hsl(48 100% 76% / 0.95) 34%); opacity: calc((0.34 + var(--h) * 0.26 + var(--mag) * 0.4 + var(--fl) * 0.3) * var(--int)); }',

    '@media (prefers-reduced-motion: reduce) {',
    '  .sb-wiggle, .sb-float, .sb-shadow-breathe, .sb-auto, .sb-burst.is-on, .h-destellos .sb-tex::before, .h-destellos .sb-tex::after { animation: none; }',
    '  .sb-root.has-entrance .sb-enter, .sb-root.has-entrance .sb-label { opacity: 1; animation: none; } }'
  ].join('\n');

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function StickerBolsaFactory() {
    class StickerBolsa extends HTMLElement {
      static get observedAttributes() {
        return ['holo', 'intensity', 'glare', 'tilt', 'float', 'attention', 'attention-interval', 'entrance', 'shadow-opacity', 'scale', 'label', 'href', 'target', 'rel'];
      }

      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._cur = { px: 0, py: 0, h: 0, pr: 0, fl: 0 };
        this._vel = { px: 0, py: 0, h: 0, pr: 0, fl: 0 };
        this._tgt = { px: 0, py: 0, h: 0, pr: 0, fl: 0 };
        this._raf = 0;
        this._last = 0;
        this._built = false;
        this._reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        this._step = this._step.bind(this);
        this._onMove = this._onMove.bind(this);
        this._onLeave = this._onLeave.bind(this);
        this._onDown = this._onDown.bind(this);
        this._onUp = this._onUp.bind(this);
        this._onClick = this._onClick.bind(this);
      }

      connectedCallback() {
        if (!this._built) this._build();
        this.addEventListener('pointermove', this._onMove);
        this.addEventListener('pointerleave', this._onLeave);
        this.addEventListener('pointercancel', this._onLeave);
        this.addEventListener('pointerdown', this._onDown);
        this.addEventListener('pointerup', this._onUp);
        this.addEventListener('click', this._onClick);
        this._observe();
      }

      disconnectedCallback() {
        this.removeEventListener('pointermove', this._onMove);
        this.removeEventListener('pointerleave', this._onLeave);
        this.removeEventListener('pointercancel', this._onLeave);
        this.removeEventListener('pointerdown', this._onDown);
        this.removeEventListener('pointerup', this._onUp);
        this.removeEventListener('click', this._onClick);
        if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
        if (this._io) { this._io.disconnect(); this._io = null; }
      }

      attributeChangedCallback(name) {
        if (!this._built) return;
        if (name === 'href') this._build(); else this._apply();
      }

      /** Lanza el destello del clic desde código. */
      flash() {
        if (!this._built) return;
        this._cur.fl = 1;
        var burst = this._burst;
        burst.classList.remove('is-on');
        void burst.offsetWidth; // reinicia la animación
        burst.classList.add('is-on');
        this._kick();
      }

      /* ---------- configuración ---------- */

      _num(attr, def, min, max) {
        var raw = this.getAttribute(attr);
        var v = raw === null || raw.trim() === '' ? def : parseFloat(raw);
        if (!isFinite(v)) v = def;
        return clamp(v, min, max);
      }

      _bool(attr, def) {
        var raw = this.getAttribute(attr);
        if (raw === null) return def;
        raw = raw.trim().toLowerCase();
        return !(raw === 'false' || raw === '0' || raw === 'off' || raw === 'no');
      }

      _holo() {
        var raw = (this.getAttribute('holo') || DEFAULTS.holo).toLowerCase();
        raw = raw.normalize ? raw.normalize('NFD').replace(/[̀-ͯ]/g, '') : raw; // "Arcoíris" -> "arcoiris"
        return HOLO_TYPES.indexOf(raw) >= 0 ? raw : DEFAULTS.holo;
      }

      _build() {
        var href = this.getAttribute('href');
        var tag = href ? 'a' : 'button';
        this.shadowRoot.innerHTML =
          '<style>' + CSS + '</style>' +
          '<div class="sb-root" part="root">' +
            '<' + tag + ' class="sb-btn" part="button"' + (href ? '' : ' type="button"') + '>' +
              '<div class="sb-fill sb-enter">' +
                '<div class="sb-fill sb-wiggle">' +
                  '<div class="sb-fill sb-shadow"><div class="sb-fill sb-shadow-breathe"><img alt="" src="' + IMG.bolsa + '"></div></div>' +
                  '<div class="sb-fill sb-float">' +
                    '<div class="sb-fill sb-tilt">' +
                      '<img alt="" src="' + IMG.base + '">' +
                      '<div class="sb-mask"><div class="sb-tex"><div class="sb-foil"></div></div><div class="sb-glare"></div><div class="sb-auto"></div><div class="sb-burst"></div></div>' +
                      '<img class="sb-logo" alt="" src="' + IMG.logo + '">' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<img class="sb-label" alt="" src="' + IMG.etiqueta + '">' +
            '</' + tag + '>' +
          '</div>';
        this._root = this.shadowRoot.querySelector('.sb-root');
        this._btn = this.shadowRoot.querySelector('.sb-btn');
        this._mask = this.shadowRoot.querySelector('.sb-mask');
        this._burst = this.shadowRoot.querySelector('.sb-burst');
        this._built = true;
        this._apply();
        if (this._shown) this._root.classList.add('is-in');
      }

      _apply() {
        var s = this._root.style;
        var intensity = this._num('intensity', DEFAULTS.intensity, 0, 1.5);
        var shadow = this._num('shadow-opacity', DEFAULTS.shadowOpacity, 0, 1);
        var attention = this._bool('attention', DEFAULTS.attention) && !this._reduced;
        this._floatOn = this._bool('float', DEFAULTS.float) && !this._reduced;
        this._attention = attention;

        s.setProperty('--scale', String(this._num('scale', DEFAULTS.scale, 0.2, 4)));
        s.setProperty('--int', String(intensity));
        s.setProperty('--glare', this._bool('glare', DEFAULTS.glare) ? String(Math.min(1, 0.85 * intensity)) : '0');
        s.setProperty('--auto', attention ? String(Math.min(1, 0.9 * intensity)) : '0');
        s.setProperty('--tilt', this._reduced ? '0' : String(this._num('tilt', DEFAULTS.tilt, 0, 24)));
        s.setProperty('--mv', this._reduced ? '0' : '1');
        s.setProperty('--interval', this._num('attention-interval', DEFAULTS.attentionInterval, 3, 60) + 's');
        s.setProperty('--sh', String(shadow));
        s.setProperty('--lsh', (shadow * 0.8).toFixed(3));

        this._mask.className = 'sb-mask h-' + this._holo();
        this._root.classList.toggle('has-entrance', this._bool('entrance', DEFAULTS.entrance) && !this._reduced);

        var label = this.getAttribute('label') || DEFAULTS.label;
        this._btn.setAttribute('aria-label', label);
        var href = this.getAttribute('href');
        if (href) {
          this._btn.setAttribute('href', href);
          ['target', 'rel'].forEach(function (a) {
            var v = this.getAttribute(a);
            if (v) this._btn.setAttribute(a, v); else this._btn.removeAttribute(a);
          }, this);
        }
        this._paint();
      }

      /* La entrada se dispara la primera vez que el sticker entra en pantalla */
      _observe() {
        var self = this;
        if (this._shown) return;
        var show = function () { self._shown = true; if (self._root) self._root.classList.add('is-in'); };
        if (!('IntersectionObserver' in window)) { show(); return; }
        this._io = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { show(); self._io.disconnect(); self._io = null; }
        }, { threshold: 0.25 });
        this._io.observe(this);
      }

      /* ---------- interacción ---------- */

      _onMove(e) {
        var r = this._root.getBoundingClientRect();
        // Misma sensibilidad que en el diseño: el borde del sticker equivale a ~0.7 del recorrido
        this._tgt.px = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.714), -1, 1);
        this._tgt.py = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.719), -1, 1);
        this._tgt.h = 1;
        this._kick();
      }
      _onLeave() { this._tgt.px = 0; this._tgt.py = 0; this._tgt.h = 0; this._tgt.pr = 0; this._kick(); }
      _onDown() { this._tgt.pr = 1; this._kick(); }
      _onUp() { this._tgt.pr = 0; this._kick(); }
      _onClick() { this.flash(); }

      _kick() {
        if (this._raf) return;
        this._last = performance.now();
        this._raf = requestAnimationFrame(this._step);
      }

      _step(now) {
        var dt = clamp((now - this._last) / 1000, 0.001, 0.034);
        this._last = now;
        var moving = false;
        for (var i = 0; i < KEYS.length; i++) {
          var k = KEYS[i], sp = SPRINGS[k];
          var acc = (this._tgt[k] - this._cur[k]) * sp[0] - this._vel[k] * sp[1];
          this._vel[k] += acc * dt;
          this._cur[k] += this._vel[k] * dt;
          if (Math.abs(this._vel[k]) > 0.002 || Math.abs(this._tgt[k] - this._cur[k]) > 0.002) moving = true;
          else { this._cur[k] = this._tgt[k]; this._vel[k] = 0; }
        }
        this._paint();
        this._raf = moving ? requestAnimationFrame(this._step) : 0;
      }

      _paint() {
        var c = this._cur, s = this._root.style;
        var h = clamp(c.h, 0, 1);
        var mag = Math.min(1, (Math.abs(c.px) + Math.abs(c.py)) / 1.2);
        s.setProperty('--px', c.px.toFixed(4));
        s.setProperty('--py', c.py.toFixed(4));
        s.setProperty('--h', h.toFixed(4));
        s.setProperty('--pr', c.pr.toFixed(4));
        s.setProperty('--fl', Math.max(0, c.fl).toFixed(4));
        s.setProperty('--mag', mag.toFixed(4));
        s.setProperty('--idle', (this._floatOn ? 1 - h : 0).toFixed(4));
        s.setProperty('--call', (this._attention ? 1 - h : 0).toFixed(4));
        // El reflejo sigue la posición real del cursor sobre la bolsa
        s.setProperty('--gx', (c.px * 214).toFixed(2) + 'px');
        s.setProperty('--gy', (c.py * 236).toFixed(2) + 'px');
      }
    }
    return StickerBolsa;
  }

  customElements.define('sticker-bolsa', StickerBolsaFactory());
})();
