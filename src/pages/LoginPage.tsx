import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonItem, IonList } from '@ionic/react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        verifyUser();

        //window.location.href = '/tabs';
    };
    const handleRegister = () => {
        window.location.href = '/register';
    };

    const MS_USER_IP = 'http://127.0.0.1:8000'
    const verifyUser = async () => {
        const response = await fetch(`${MS_USER_IP}/gestion/usuario/mail/${username}`);
        const data = await response.json();
        console.log(data)
        if (response.ok) {
            if (data.password === password) {
                localStorage.setItem('currentUser', JSON.stringify(data));
                window.location.href = '/tabs';
            } else {
                alert("Contraseña incorrecta")
            }
        } else {
            alert("Usuario no encontrado")
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
