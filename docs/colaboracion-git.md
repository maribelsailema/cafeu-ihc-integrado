# Flujo de colaboración y commits verificables

## Ramas sugeridas

- `main`: versión integrada y estable.
- `feature/domain-model`: entidades y reglas del dominio.
- `feature/use-cases`: casos de uso y búsqueda.
- `feature/local-persistence`: repositorio local.
- `feature/cafeu-ui`: presentación.
- `docs/architecture-readme`: documentación.

## Flujo por integrante

```bash
git switch main
git pull
git switch -c feature/nombre-tarea
# realizar cambios
git status
git add src tests docs
git commit -m "feat(domain): implementa reglas del pedido"
git push -u origin feature/nombre-tarea
```

Después abrir un Pull Request hacia `main`, solicitar revisión y ejecutar `npm test` y `npm run build`.

## Convención de commits

- `feat:` funcionalidad.
- `fix:` corrección.
- `test:` pruebas.
- `docs:` documentación.
- `refactor:` reorganización sin cambio funcional.

## Evidencia verificable

- Cada persona usa su propia cuenta Git.
- Los commits deben contener cambios reales y tener autoría correcta.
- Adjuntar enlace al commit o PR en el issue.
- No compartir credenciales ni alterar autor/fecha para aparentar actividad.
- La integración se acepta cuando pasan pruebas y compilación.
