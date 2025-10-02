export type StatusType = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export const STATUS_TRANSLATIONS: Record<StatusType, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    PENDING: 'Pendente'
};

export function translateStatus(status: StatusType): string {
    return STATUS_TRANSLATIONS[status] || status;
}
