import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado para formatear precios sin decimales .00
 * Elimina los .00 de los precios pero mantiene decimales reales como .50 o .99
 */
@Pipe({
    name: 'priceFormat',
    standalone: true
})
export class PriceFormatPipe implements PipeTransform {

    transform(value: number | null | undefined): string {
        if (value == null || value === undefined) {
            return '$0';
        }

        // Formatear el número con separador de miles
        const formatted = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(value);

        // Quitar el .00 si existe al final
        return formatted.replace(/\.00$/, '').replace(/,00$/, '');
    }
}
