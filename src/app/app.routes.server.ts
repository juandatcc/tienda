import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // En una aplicación real, esto obtenería los IDs de los productos de una API
      // Por ahora, retornamos IDs de ejemplo
      return [{ id: '1' }, { id: '2' }, { id: '3' }];
    },
  },
  {
    path: 'admin/:id/edit',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // En una aplicación real, esto obtenería los IDs de los productos a editar
      return [{ id: '1' }, { id: '2' }, { id: '3' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
