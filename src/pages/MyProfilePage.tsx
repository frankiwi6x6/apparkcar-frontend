import { api } from '../environment'
import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonAvatar, IonLabel, IonButton, IonText, IonIcon, IonRow, IonCol, useIonAlert, IonCard, IonCardTitle, IonCardSubtitle, useIonViewWillEnter, isPlatform, IonSpinner } from '@ionic/react';
import { useParams } from 'react-router-dom';
import './MyProfilePage.css';
import { camera, exit, pencil } from 'ionicons/icons';
import { Rating } from 'react-simple-star-rating';

const MyProfilePage: React.FC = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "{}");

    const username = user.username;
    const [userData, setUserData] = useState<any>(null);

    const [calificacion, setCalificacion] = useState<any>(null);

    const [estacionamientos, setEstacionamientos] = useState<any>(null);
    const [reservas, setReservas] = useState<any>(null);
    const [presentAlert] = useIonAlert();

    const [rating, setRating] = useState<number>();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${api.USER_URL}/gestion/usuario/${username}`);
                const data = await response.json();

                if (response.ok) {
                    setUserData(data);
                    getCalificacion(data.id);
                } else {
                    console.error('Error en la solicitud del perfil del usuario');
                }
            } catch (error) {
                console.error('Error al obtener datos del perfil del usuario', error);
            }
        };

        fetchUserData();
        if (user.es_cliente) {
            getReservas(user.id);
        } else {
            getEstacionamientos(user.id);
        }

    }, [username]);

    const getCalificacion = async (idUsuario: string) => {
        try {
            const response = await fetch(`${api.RATING_URL}/calificacion/calificaciones/${idUsuario}`);
            if (response.ok) {
                const data = await response.json();
                setCalificacion(data);
            } else {
                console.error('Error en la solicitud del perfil del usuario');
            }
        } catch (error) {
            console.error('Error al obtener datos del perfil del usuario', error);
        }
    };

    const getEstacionamientos = async (idUsuario: string) => {
        try {
            const response = await fetch(`${api.PARK_URL}/estacionamientos/duenno/${idUsuario}/`);
            if (response.ok) {
                const data = await response.json();
                setEstacionamientos(data);
            } else {
                console.error('Error en la solicitud del perfil del usuario');
            }
        } catch (error) {
            console.error('Error al obtener datos del perfil del usuario', error);
        }
    }

    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

    useIonViewWillEnter(() => {
        setIsSmallScreen(isPlatform('mobile') || isPlatform('tablet'));
    });
    const getReservas = async (idUsuario: string) => {
        try {
            const response = await fetch(`${api.BOOKING_URL}/reserva/historial/${idUsuario}/`);
            if (response.ok) {
                const data = await response.json();
                setReservas(data);
            } else {
                console.error('Error en la solicitud del perfil del usuario');
            }
        } catch (error) {
            console.error('Error al obtener datos del perfil del usuario', error);
        }
    }



    const changeProfilePic = () => {
        console.log("Change Profile Pic");
    }
    const handleLogout = () => {
        presentAlert({
            header: 'Cerrar sesión',
            message: '¿Está seguro que desea cerrar sesión?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    },
                },
                {
                    text: 'Cerrar sesión',
                    role: 'confirm',
                    handler: () => {
                        localStorage.removeItem('currentUser');
                        window.location.href = '/';
                    },
                },
            ]
        })
    }
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
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{username}'s Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding ion-content-center ion-text-center">
                <IonButton className='button-logout' fill="clear" color='danger' onClick={handleLogout}>

                    <IonIcon icon={exit} />
                </IonButton>
                {userData && (
                    <>
                        <div className='my-profile-container' onClick={changeProfilePic}>
                            <img src={userData.profile_pic_url} alt={`Perfil de ${username}`} className="profile-image" />
                        </div>


                        <IonText className="ion-text">@{username}</IonText>
                        <p>Email: {userData.email}</p>
                        <p>Nombre: {userData.nombre} {userData.ApPaterno} {userData.ApMaterno} </p>

                        <IonButton expand="full" className="ion-margin-top">
                            Editar Perfil
                        </IonButton>
                        {/* Inicio de la seccion que quiero que sea un componente */}
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
                                            /* Available Props */
                                            />

                                        </div>
                                    ) : (
                                        <IonSpinner></IonSpinner>
                                    )}

                                </IonCol>
                                <IonCol>
                                    {
                                        userData.es_cliente === true ? (
                                            <div>
                                                <IonTitle>Reservas</IonTitle>
                                                {reservas && reservas.length > 0 ? (
                                                    <IonTitle>{reservas.length}</IonTitle>
                                                ) : (
                                                    <IonSpinner></IonSpinner>
                                                )}
                                            </div>

                                        )

                                            : (
                                                <div>
                                                    <IonTitle>Estacionamientos</IonTitle>
                                                    {estacionamientos && estacionamientos.length > 0 ? (
                                                        <IonTitle>{estacionamientos.length}</IonTitle>
                                                    ) : (
                                                        <IonSpinner></IonSpinner>
                                                    )}
                                                </div>
                                            )
                                    }
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol className=''>
                                    {
                                        userData.es_cliente === true ? (
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
                                                </div>) : (
                                                <IonSpinner></IonSpinner>)

                                        ) : (
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

                                                </div>) : (
                                                <div>
                                                    <IonTitle>Cargando estacionamientos...</IonTitle>
                                                    <IonSpinner></IonSpinner>
                                                </div>
                                            )
                                        )
                                    }
                                </IonCol>
                            </IonRow>
                        </div>

                        {/* Fin de la seccion que quiero que sea un componente */}
                    </>
                )
                }
            </IonContent >
        </IonPage >
    );
};

export default MyProfilePage;