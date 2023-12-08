import { api } from '../environment';
import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonAvatar,
    IonLabel,
    IonButton,
    IonText,
    IonRow,
    IonCol,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string; match: any }>();

    const [userData, setUserData] = useState<any>(null);
    const [calificacion, setCalificacion] = useState<any>(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${api.USER_URL}/gestion/usuario/${username}`);
                if (response.ok) {
                    const data = await response.json();
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


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{username}'s Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding ion-content-center ion-text-center">
                {userData && (
                    <>
                        <div>
                            <img src={userData.profile_pic_url} alt={`Perfil de ${username}`} className="profile-image" />
                        </div>

                        <IonText className="ion-text">@{username}</IonText>
                        <p>Email: {userData.email}</p>
                        <p>Nombre: {userData.nombre} {userData.ApPaterno} {userData.ApMaterno}</p>

                        <IonRow>
                            <IonCol>
                                <IonTitle>Calificación</IonTitle>
                                {calificacion && calificacion.promedio_calificacion !== null ?
                                    (<IonTitle>{calificacion.promedio_calificacion}</IonTitle>) :
                                    (<IonText>Sin calificación</IonText>)}

                            </IonCol>
                            <IonCol>

                                {/* Agrega lo que quieras en la segunda columna */}
                            </IonCol>
                        </IonRow>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ProfilePage;
