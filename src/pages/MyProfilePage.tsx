import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonAvatar, IonLabel, IonButton, IonText, IonIcon } from '@ionic/react';
import { useParams } from 'react-router-dom';
import './MyProfilePage.css';
import { camera, exit, pencil } from 'ionicons/icons';

const MyProfilePage: React.FC = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "{}");

    const username = user.username;
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/gestion/usuario/${username}`);
                const data = await response.json();

                if (response.ok) {
                    setUserData(data);
                } else {
                    console.error('Error en la solicitud del perfil del usuario');
                }
            } catch (error) {
                console.error('Error al obtener datos del perfil del usuario', error);
            }
        };

        fetchUserData();
    }, [username]);

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
                <IonButton className='button-logout' fill="clear" color='danger'onClick={handleLogout}>
                    
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
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MyProfilePage;