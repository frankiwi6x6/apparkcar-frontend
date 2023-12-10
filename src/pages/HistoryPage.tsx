import { useState, useEffect } from 'react';
import { api } from '../environment';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar, isPlatform } from "@ionic/react";
import { useIonViewWillEnter } from '@ionic/react';
import './HistoryPage.css';
import { documentOutline, documentTextOutline } from 'ionicons/icons';

import jsPDF from 'jspdf';
import 'jspdf-autotable';


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

    const formatReportDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };
    
    const formatReportCurrency = (value) => {
        return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
    
    const generateReportPDF = (data) => {
        const pdf = new jsPDF();
    
        // Agregar el título centrado y subrayado
        pdf.setFontSize(16);
        pdf.text('Reporte ' + currentUser.nombre + ' ' + currentUser.ApPaterno + ' ' + currentUser.ApMaterno, pdf.internal.pageSize.width / 2, 20, { align: 'center' });
        pdf.line(14, 26, pdf.internal.pageSize.width - 14, 26); // línea de subrayado
    
        // Agregar contenido
        pdf.setFontSize(12);
    
        // Estacionamientos reservados
        pdf.text('Tus estacionamientos reservados:', 14, 40);
        const reservasData = data.reservas[0];
        const reservaHeaders = ['ID Estacionamiento', 'Fecha Inicio', 'Fecha Fin', 'Valor', 'Estado', 'Diferencia Horas', 'Precio Final'];
        const reservaRows = reservasData.map(reserva => [
            reserva.id_estacionamiento,
            formatReportDate(reserva.fecha_inicio),
            formatReportDate(reserva.fecha_fin),
            formatReportCurrency(reserva.valor),
            reserva.estado,
            reserva.diferencia_horas,
            formatReportCurrency(reserva.precioFinal)
        ]);
        pdf.autoTable({ startY: 50, head: [reservaHeaders], body: reservaRows });
    
        // Estacionamientos sin reservas
        pdf.text('Tus estacionamientos que no recibieron reservas:', 14, pdf.autoTable.previous.finalY + 10);
        const estacionamientosSinReservas = data.estacionamientosMenosUsados.join(', ');
        pdf.text(estacionamientosSinReservas, 14, pdf.autoTable.previous.finalY + 20);
    
        // Ganancias totales
        pdf.text('Ganancias totales: ' + formatReportCurrency(data.ganancias), 14, pdf.autoTable.previous.finalY + 40);
    
        // Guardar el archivo
        pdf.save('reporte.pdf');
    };

    const handleReport = async () => {
        try {
            const response = await fetch(`${api.REPORTS_URL}/reporte/${currentUser.id}/2022-01-01`);
            if (response.ok) {
                const data = await response.json();
                generateReportPDF(data);
            } else {
                console.error('Error al obtener el reporte');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Asignar el evento onClick al botón
    const botonDescarga = document.getElementById('boton-documento');
    if (botonDescarga) {
        botonDescarga.addEventListener('click', handleReport);
    }
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
                                <IonButton onClick={() => handlePayment(reserva.id)}>{isSmallScreen ? "$" : "Pagar"}</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonCard>

                ))}
                {currentUser.es_cliente === false ?
                    <IonButton id='boton-documento' shape='round' className='botonEsquinaInferior'>
                        <IonIcon icon={documentTextOutline}></IonIcon>

                    </IonButton>
                    : null}

            </IonContent>
        </IonPage >
    );
};

export default HistoryPage;
