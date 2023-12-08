import {api} from '../environment';
import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonItem, IonList, useIonAlert } from '@ionic/react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const esCorreoElectronico = username.includes('@');

    const [presentAlert] = useIonAlert();

    const handleAlert = (header: string, mensaje: string) => {
        presentAlert({
            header: header,
            message: mensaje,
            buttons: ['Aceptar'],
        })
    }

    const handleLogin = () => {
        verifyUser();

        //window.location.href = '/tabs';
    };
    const handleRegister = () => {
        window.location.href = '/register';
    };

    const verifyUser = async () => {
        if (username === '' || password === '') {
            handleAlert("Campos vacios", "Ingrese sus credenciales para iniciar sesión.")
            return;
        } else {
            try {
                let response;
                if (esCorreoElectronico) {
                    // Si es un correo electrónico, realiza la solicitud con la URL correspondiente
                    response = await fetch(`${api.USER_URL}/gestion/usuario/mail/${username}`);
                    console.log('Correo electrónico')
                } else {
                    // Si es un nombre de usuario, realiza la solicitud con la URL correspondiente
                    response = await fetch(`${api.USER_URL}/gestion/usuario/${username}`);
                    console.log('Username')
                }
                const data = await response.json();
                console.log(data)
                if (response.ok) {
                    if (data.password === password) {
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        window.location.href = '/tabs';
                    } else {
                        handleAlert("Contraseña incorrecta", "Verifique su contraseña y vuelva a intentarlo.")
                    }
                } else {
                    handleAlert("Usuario no encontrado", "Verifique sus credenciales e intentelo nuevamente.")
                }
            } catch (error) {
                console.error('Error al obtener datos del perfil del usuario', error);
            }
        }
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>
                        <IonInput
                            placeholder="Nombre de usuario"
                            onIonChange={(e) => setUsername(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            type="password"
                            placeholder="Contraseña"
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        />
                    </IonItem>
                    <IonButton expand="full" onClick={handleLogin}>
                        Iniciar sesión
                    </IonButton>
                    <IonButton expand="full" color={'tertiary'} onClick={handleRegister}>
                        Registrar usuario
                    </IonButton>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;
