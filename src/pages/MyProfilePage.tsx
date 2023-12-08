import { api } from '../environment'
import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonAvatar, IonLabel, IonButton, IonText, IonIcon, IonRow, IonCol } from '@ionic/react';
import { useParams } from 'react-router-dom';
import './MyProfilePage.css';
import { camera, exit, pencil } from 'ionicons/icons';

const MyProfilePage: React.FC = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "{}");

    const username = user.username;
    const [userData, setUserData] = useState<any>(null);

    const [calificacion, setCalificacion] = useState<any>(null);

    const [estacionamientos, setEstacionamientos] = useState<any>(null);
    const [reservas, setReservas] = useState<any>(null);
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
                console.log(data);
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
                setReservas(data);
                console.log(data);
            } else {
                console.error('Error en la solicitud del perfil del usuario');
            }
        } catch (error) {
            console.error('Error al obtener datos del perfil del usuario', error);
        }
    }

    const getReservas = async (idUsuario: string) => {
        try {
            const response = await fetch(`${api.BOOKING_URL}/reserva/historial/${idUsuario}/`);
            if (response.ok) {
                const data = await response.json();
                setEstacionamientos(data);
                console.log(data);
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
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    }


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
                                {
                                    user.es_cliente===true? (
                                        <div>
                                            <IonTitle>Reservas</IonTitle>
                                            {estacionamientos && estacionamientos.length > 0 ? (
                                                <IonTitle>{estacionamientos.length}</IonTitle>
                                            ) : (
                                                <IonText>Sin reservas</IonText>
                                            )}
                                        </div>

                                    )

                                        : (
                                            <div>
                                                <IonTitle>Estacionamientos</IonTitle>
                                                {reservas && reservas.length > 0 ? (
                                                    <IonTitle>{reservas.length}</IonTitle>
                                                ) : (
                                                    <IonText>Sin estacionamientos</IonText>
                                                )}
                                            </div>
                                        )
                                }
                            </IonCol>
                        </IonRow>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MyProfilePage;