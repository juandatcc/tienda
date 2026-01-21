import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CookieService {

    /**
     * Obtiene el valor de una cookie por su nombre
     * @param name Nombre de la cookie
     * @returns Valor de la cookie o null si no existe
     */
    getCookie(name: string): string | null {
        if (typeof document === 'undefined') return null;

        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Establece una cookie
     * @param name Nombre de la cookie
     * @param value Valor de la cookie
     * @param days Días hasta que expire. Si es 0, la cookie expira al cerrar el navegador (cookie de sesión)
     */
    setCookie(name: string, value: string, days: number = 0): void {
        if (typeof document === 'undefined') return;

        let expires = "";
        if (days > 0) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // Si days es 0, no se agrega expires, creando una cookie de sesión
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
    }

    /**
     * Elimina una cookie
     * @param name Nombre de la cookie
     */
    deleteCookie(name: string): void {
        if (typeof document === 'undefined') return;

        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
    }

    /**
     * Verifica si existe una cookie
     * @param name Nombre de la cookie
     * @returns true si existe, false si no
     */
    hasCookie(name: string): boolean {
        return this.getCookie(name) !== null;
    }
}
