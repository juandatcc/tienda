import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    CreatePaymentRequest,
    CreatePaymentResponse,
    PaymentTransaction
} from '../models/payment.model';

/**
 * Servicio para gestionar pagos PSE
 */
@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/payments`;

    /**
     * Inicia una transacción de pago PSE
     * @param request Datos del pago (amount, currency, buyerEmail, returnUrl)
     * @returns Observable con reference y redirectUrl
     */
    initiatePSE(request: CreatePaymentRequest): Observable<CreatePaymentResponse> {
        return this.http.post<CreatePaymentResponse>(`${this.baseUrl}/pse`, request);
    }

    /**
     * Consulta el estado de una transacción de pago
     * @param reference Referencia de la transacción
     * @returns Observable con los detalles completos de la transacción
     */
    getPaymentStatus(reference: string): Observable<PaymentTransaction> {
        return this.http.get<PaymentTransaction>(`${this.baseUrl}/status/${reference}`);
    }
}
