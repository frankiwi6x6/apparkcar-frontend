// Importa las dependencias necesarias
import React from 'react';
import { IonRow, IonCol, IonTitle, IonCard, IonCardTitle, IonCardSubtitle, IonText } from '@ionic/react';

interface Props {
    user: any;
    calificacion: any;
    estacionamientos: any;
    reservas: any;
    formatDate: (dateString: string) => string;
    formatPrice: (price: number) => string;
    calculateHours: (startDate: string, endDate: string | null) => number;
    calculateTotalPrice: (hours: number, pricePerHour: number) => number;
}

const ProfileContent: React.FC<Props> = ({
    user,
    calificacion,
    estacionamientos,
    reservas,
    formatDate,
    formatPrice,
    calculateHours,
    calculateTotalPrice
}) => {
    return (
        <div>
            <IonRow>
                <IonCol>
                    <IonTitle>Calificación</IonTitle>
                    {calificacion && calificacion.promedio_calificacion !== null ? (
                        <IonTitle>{calificacion.promedio_calificacion}</IonTitle>
                    ) : (
                        <IonText>Sin calificaciones</IonText>
                    )}
                </IonCol>
                <IonCol>
                    {user.es_cliente === true ? (
                        <div>
                            <IonTitle>Reservas</IonTitle>
                            {reservas && reservas.length > 0 ? (
                                <IonTitle>{reservas.length}</IonTitle>
                            ) : (
                                <IonText>Sin reservas</IonText>
                            )}
                        </div>
                    ) : (
                        <div>
                            <IonTitle>Estacionamientos</IonTitle>
                            {estacionamientos && estacionamientos.length > 0 ? (
                                <IonTitle>{estacionamientos.length}</IonTitle>
                            ) : (
                                <IonText>Sin estacionamientos</IonText>
                            )}
                        </div>
                    )}
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol className=''>
                    {user.es_cliente === true ? (
                        <div>
                            <IonTitle>Estacionamientos listados</IonTitle>
                            {reservas.map((reserva: any, index: number) => (
                                <IonCard key={index}>
                                    <IonCardTitle> <strong>Reserva: </strong>{reserva.id}</IonCardTitle>
                                    <IonCardSubtitle> <strong>Estacionamiento: </strong>{reserva.id_estacionamiento}</IonCardSubtitle>
                                    <IonCardSubtitle> <strong>Inicio: </strong> {formatDate(reserva.fecha_inicio)}</IonCardSubtitle>
                                    <IonCardSubtitle> <strong>Fin: </strong> {reserva.fecha_fin ? formatDate(reserva.fecha_fin) : "En curso..."}</IonCardSubtitle>
                                    <IonCardSubtitle> <strong>Valor: </strong> ${formatPrice(calculateTotalPrice(calculateHours(reserva.fecha_inicio, reserva.fecha_fin), reserva.valor))}</IonCardSubtitle>
                                </IonCard>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <IonTitle>Estacionamientos listados</IonTitle>
                            {estacionamientos.map((estacionamiento: any, index: number) => (
                                <IonCard key={index}>
                                    <IonCardTitle><strong>Estacionamiento: </strong>{estacionamiento.id}</IonCardTitle>
                                    <IonCardSubtitle>{estacionamiento.titulo}</IonCardSubtitle>
                                    <IonCardSubtitle><strong>Descripción: </strong>{estacionamiento.descripcion}</IonCardSubtitle>
                                    <IonCardSubtitle><strong>Tipo: </strong>{estacionamiento.tipo}</IonCardSubtitle>
                                    <IonCardSubtitle><strong>Capacidad disponible:</strong> {estacionamiento.capacidad}</IonCardSubtitle>
                                    <IonCardSubtitle><strong>Estado: </strong> {estacionamiento.estado}</IonCardSubtitle>
                                </IonCard>
                            ))}
                        </div>
                    )}
                </IonCol>
            </IonRow>
        </div>
    );
};

export default ProfileContent;
