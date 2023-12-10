// Importa las dependencias necesarias
import React, { useEffect, useState } from 'react';
import { IonRow, IonCol, IonTitle, IonCard, IonCardTitle, IonCardSubtitle, IonText, IonSpinner } from '@ionic/react';
import { Rating } from 'react-simple-star-rating';
const NoDataMessage: React.FC = () => (
    <div>
        <IonText>No hay datos disponibles.</IonText>
    </div>
);

const DelayedSpinnerAndMessage: React.FC = () => {
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setShowSpinner(false);
        }, 3000);

        return () => clearTimeout(timerId);
    }, []);

    return showSpinner ? (
        <IonSpinner></IonSpinner>
    ) : (
        <NoDataMessage />
    );
};
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
                                    <div>
                                        <IonTitle>{calificacion.promedio_calificacion}</IonTitle>
                                        <Rating
                                            onClick={() => { null }}
                                            initialValue={calificacion.promedio_calificacion}
                                            allowFraction={true}
                                            allowHover={false}
                                        />
                                    </div>
                                ) : (
                                    <IonSpinner></IonSpinner>
                                )}
                            </IonCol>
                            <IonCol>
                                {user.es_cliente === true ? (
                                    <div>
                                        <IonTitle>Reservas</IonTitle>
                                        {reservas ? (
                                            reservas.length > 0 ? (
                                                <IonTitle>{reservas.length}</IonTitle>
                                            ) : (
                                                <DelayedSpinnerAndMessage />
                                            )
                                        ) : (
                                            <NoDataMessage />
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <IonTitle>Estacionamientos</IonTitle>
                                        {estacionamientos ? (
                                            estacionamientos.length > 0 ? (
                                                <IonTitle>{estacionamientos.length}</IonTitle>
                                            ) : (
                                                <DelayedSpinnerAndMessage />
                                            )
                                        ) : (
                                            <NoDataMessage />
                                        )}
                                    </div>
                                )}
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className=''>
                                {user.es_cliente === true ? (
                                    reservas ? (
                                        reservas.length > 0 ? (
                                            <div>
                                                <IonTitle>Reservas Realizadas</IonTitle>
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
                                            <IonSpinner></IonSpinner>
                                        )
                                    ) : (
                                        <NoDataMessage />
                                    )
                                ) : (
                                    estacionamientos ? (
                                        estacionamientos.length > 0 ? (
                                            <div>
                                                <IonTitle>Estacionamientos listados</IonTitle>
                                                {estacionamientos.map((estacionamiento: any, index: number) => (
                                                    <IonCard key={index}>
                                                        <IonCardTitle><strong>Estacionamiento: </strong>{estacionamiento.id}</IonCardTitle>
                                                        <IonCardSubtitle>{estacionamiento.titulo}</IonCardSubtitle>
                                                        <IonCardSubtitle><strong>Descripción: </strong>{estacionamiento.descripcion}</IonCardSubtitle>
                                                        <IonCardSubtitle><strong>Tipo: </strong>{estacionamiento.tipo}</IonCardSubtitle>
                                                        <IonCardSubtitle><strong>Capacidad disponible:</strong> {estacionamiento.capacidad}</IonCardSubtitle>
                                                        <IonCardSubtitle><strong>Estado: </strong> {`${estacionamiento.estado}`}</IonCardSubtitle>
                                                    </IonCard>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                <IonTitle>Cargando estacionamientos...</IonTitle>
                                                <DelayedSpinnerAndMessage/>
                                            </div>
                                        )
                                    ) : (
                                        <NoDataMessage />
                                    )
                                )}
                            </IonCol>
                        </IonRow>
                    </div>
    );
};

export default ProfileContent;
