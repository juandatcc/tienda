/**
 * Request para iniciar un pago PSE
 */
export interface CreatePaymentRequest {
    amount: number;
    currency: string;
    buyerEmail: string;
    returnUrl: string;
}

/**
 * Response al iniciar un pago PSE
 */
export interface CreatePaymentResponse {
    reference: string;
    redirectUrl: string;
}

/**
 * Estados posibles de una transacción de pago
 */
export enum PaymentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

/**
 * Modelo completo de transacción de pago desde el backend
 */
export interface PaymentTransaction {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    buyerEmail: string;
    pseTransactionId?: string;
    pseBankCode?: string;
    redirectUrl?: string;
    createdAt: string;
    updatedAt: string;
}
