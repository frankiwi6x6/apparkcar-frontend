import { api } from '../environment';
import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonIcon } from "@ionic/react"
import { bicycle, car } from "ionicons/icons"

interface Props {
    estacionamiento: any;
    className?: string;
}

const ParkingCard = ({ estacionamiento, className }: Props) => {


    

    const handleBooking = async (estacionamientoId: number) => {
        try {
            // Paso 1: Hacer un GET al estacionamiento
            const response = await fetch(`${api.PARK_URL}/estacionamientos/lista/${estacionamientoId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Error al obtener información del estacionamiento:', response.status, response.statusText);
                throw new Error('Error al obtener información del estacionamiento');
            }

            const estacionamientoResponse = await response.json();
            const estacionamientoData = estacionamientoResponse.estacionamiento;
            // Paso 2: Verificar si hay espacios disponibles
            if (estacionamientoData.capacidad >= 1) {
                console.log('Estacionamiento Data:', estacionamientoData);

                // Paso 3: Hacer un POST hacia la API de reservas
                const currentUser: any | null = JSON.parse(localStorage.getItem('currentUser') || 'null');
                const userId = currentUser.id;
                const data = {
                    'id_usuario': userId,
                    'id_estacionamiento': estacionamientoId,
                    'fecha_inicio': new Date(),
                    'fecha_fin': null,
                    'estado': 'P',
                    'valor': estacionamiento.precio
                };

                const reservaResponse = await fetch(`${api.BOOKING_URL}/reserva/crea/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (reservaResponse.ok) {
                    let updatedEstacionamiento = estacionamientoData;
                    updatedEstacionamiento.capacidad = estacionamientoData.capacidad - 1;
                    // Paso 4: Actualizar la capacidad del estacionamiento
                    await fetch(`${api.PARK_URL}/estacionamientos/modifica/${estacionamientoId}/`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedEstacionamiento),
                    });

                    console.log('Reserva exitosa');
                } else {
                    console.error('Error al realizar la reserva:', reservaResponse.status, reservaResponse.statusText);
                    // Puedes mostrar un mensaje de error o realizar otras acciones necesarias.
                }
            } else {
                console.log('No hay espacios disponibles en el estacionamiento.');
                console.log(estacionamientoData)
                // Puedes mostrar un mensaje o realizar otras acciones necesarias.
            }
        } catch (error) {
            console.error('Error:', error);
            // Puedes mostrar un mensaje de error o realizar otras acciones necesarias.
        }
    };


    return (
        <IonCard className={className}>
            <IonCardContent>
                <div className="direccion">
                    <IonCardTitle>
                        {estacionamiento.titulo}
                    </IonCardTitle>
                </div>
                <p><span className='precio'>${estacionamiento.precio}</span> / hora</p>

                <div className="info">
                    {estacionamiento.distancia && (
                        <IonCardSubtitle>{`A ${estacionamiento.distancia} km`}</IonCardSubtitle>
                    )}

                    <p>
                        <span className='iconoTipo'>{estacionamiento.tipo === 'Autos' ? <IonIcon color='primary' icon={car} /> : <IonIcon color='primary' icon={bicycle} />}</span>
                        {estacionamiento.capacidad} {estacionamiento.capacidad <= 1 ? "espacio disponible" : "espacios disponibles"}
                    </p>
                </div>
                        {estacionamiento.capacidad >= 1 ? <IonButton fill='clear' onClick={() => handleBooking(estacionamiento.id)}>Reservar</IonButton> : <IonButton fill='clear' disabled>Estacionamiento lleno :(</IonButton>}
                
            </IonCardContent>
        </IonCard>
    );
}

export default ParkingCard;