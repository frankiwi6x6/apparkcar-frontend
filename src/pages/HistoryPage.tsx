import { useState, useEffect } from 'react';
import { api } from '../environment';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, isPlatform } from "@ionic/react";
import { useIonViewWillEnter } from '@ionic/react';
import './HistoryPage.css';

const HistoryPage: React.FC = () => {
    const [listaReservas, setListaReservas] = useState<any[]>([]);

    const currentUser: any | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

    useIonViewWillEnter(() => {
        setIsSmallScreen(isPlatform('mobile') || isPlatform('tablet'));
    });
    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch(`${api.BOOKING_URL}/reserva/historial/${currentUser.id}/`);
                if (response.ok) {
                    const data = await response.json();
                    setListaReservas(data);
                    console.log(data);
                } else {
                    console.error('Error al obtener la lista de reservas');
                }
            } catch (error) {
                console.error('Error de red', error);
            }
        };

        fetchReservas();
    }, [currentUser.id]);

    const formatDate = (dateString: string) => {
        const options = isSmallScreen
            ? { day: '2-digit', month: '2-digit', year: '2-digit' }
            : { year: 'numeric', month: 'long', day: 'numeric' };

        return new Date(dateString).toLocaleDateString('es-ES', options);
    };


    const formatPrice = (price: number) => {
        const options = { style: 'currency', currency: 'CLP' };
        return new Intl.NumberFormat('es-ES', options).format(price);
    };

    const calculateHours = (startDate: string, endDate: string | null) => {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        const millisecondsDifference = Math.abs(end - start);
        const hoursDifference = Math.ceil(millisecondsDifference / 36e5); // Divide entre 36e5 para obtener la diferencia en horas y redondea hacia arriba
        return hoursDifference;
    };

    const calculateTotalPrice = (hours: number, pricePerHour: number) => {
        return hours * pricePerHour;
    };
    const handlePayment = (reservaId: number) => {
        // Aquí puedes implementar la lógica para realizar el pago, por ejemplo, redirigiendo a una pasarela de pago.
        console.log(`Pagar reserva ${reservaId}`);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tabs/home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Historial</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {listaReservas.map((reserva, index) => (
                    <IonCard key={index} className='cartaHistorial'>
                        <IonRow className=" ion-align-items-center">
                            <IonCol size='10'>
                                <IonRow>
                                    <IonCol>
                                        
                                        <p><strong>Reserva</strong></p>

                                        <p><strong>Estacionamiento</strong></p>

                                        <p><strong>Inicio</strong>  </p>

                                        <p><strong>Fin</strong></p>
                                        
                                        <p><strong>Valor</strong></p>
                                    </IonCol>
                                    <IonCol>
                                        <p>{reserva.id}</p>
                                        <p>{reserva.id_estacionamiento}</p>
                                        <p>{formatDate(reserva.fecha_inicio)}</p>
                                        <p>{reserva.fecha_fin ? formatDate(reserva.fecha_fin) : "En curso..."}</p>
                                        <p>${formatPrice(calculateTotalPrice(calculateHours(reserva.fecha_inicio, reserva.fecha_fin), reserva.valor))}</p>
                                    </IonCol>
                                </IonRow>

                            </IonCol>
                            <IonCol className='ion-text-end' size='2'>
                                <IonButton onClick={() => handlePayment(reserva.id)}>{isSmallScreen?"$" :"Pagar"}</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonCard>

                ))}
            </IonContent>
        </IonPage>
    );
};

export default HistoryPage;
