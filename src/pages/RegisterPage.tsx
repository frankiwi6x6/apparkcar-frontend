import {api} from '../environment'
import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonAvatar, IonLabel, IonButton, IonText, IonIcon, useIonAlert, IonList, IonItem, IonInput, IonCheckbox, IonRadioGroup, IonRadio } from '@ionic/react';
import { arrowBackOutline, chevronBackOutline } from 'ionicons/icons';
import './RegisterPage.css';
const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apPaterno, setApPaterno] = useState('');
    const [apMaterno, setApMaterno] = useState('');
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [doB, setDoB] = useState('');
    const [presentAlert] = useIonAlert();


    const emailInput = document.getElementById('email') as HTMLIonInputElement;
    const usernameInput = document.getElementById('username') as HTMLIonInputElement;
    const passwordInput = document.getElementById('password') as HTMLIonInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLIonInputElement;

    const inputsVacios: any = []

    const handleAlert = (header: string, mensaje: string) => {
        presentAlert({
            header: header,
            message: mensaje,
            buttons: ['Action'],
        })
    }
    let tipoUsuario: string = '';


    const handleGoBack = () => {
        return console.log("Go back")
    }

    const handleRegister = () => {

        verifyUser();
    };

    const verifyUser = async () => {
        if (username === '' || password === '' || confirmPassword === '' || nombre === '' || apPaterno === '' || apMaterno === '' || email === '' || userType === '' || doB === '') {
            let stringFinal = '';
            inputsVacios.length = 0;
            if (username === '') {
                inputsVacios.push('username');
            }
            if (password === '') {
                inputsVacios.push('password');
            }
            if (confirmPassword === '') {
                inputsVacios.push('confirmPassword');
            }
            if (nombre === '') {
                inputsVacios.push('nombre');
            }
            if (apPaterno === '') {
                inputsVacios.push('apPaterno');
            }
            if (apMaterno === '') {
                inputsVacios.push('apMaterno');
            }
            if (email === '') {
                inputsVacios.push('email');
            }
            if (userType === '') {
                inputsVacios.push('userType');
            }
            if (doB === '') {
                inputsVacios.push('doB');
            }
            stringFinal = 'Los siguientes campos están vacios:\n';

            for (let i = 0; i < inputsVacios.length; i++) {
                if (i <= inputsVacios.length - 3) {
                    stringFinal += inputsVacios[i] + ',\n ';
                }
                if (i === inputsVacios.length - 2) {
                    stringFinal += inputsVacios[i] + ' y ';
                }
                if (i === inputsVacios.length - 1) {
                    stringFinal += inputsVacios[i] + '.\n';
                }


            }

            handleAlert("Campos vacios", stringFinal)

            return;
        } else {
            try {
                const [responseEmail, responseUsuario] = await Promise.all([
                    fetch(`${api.USER_URL}/gestion/usuario/mail/${email}`),
                    fetch(`${api.USER_URL}/gestion/usuario/${username}`)
                ]);

                const dataEmail = await responseEmail.json();
                const dataUsuario = await responseUsuario.json();

                console.log(responseEmail.status);
                console.log(responseUsuario.status);

                if (responseEmail.status === 404) {
                    emailInput.classList.remove('input-error');
                } else {
                    emailInput.classList.add('input-error');
                }
                if (responseUsuario.status === 404) {
                    usernameInput.classList.remove('input-error');
                } else {
                    usernameInput.classList.add('input-error');
                }
                if (password === confirmPassword) {
                    confirmPasswordInput.classList.remove('input-error');
                } else {
                    confirmPasswordInput.classList.add('input-error');
                }
                if (responseEmail.status === 404 && responseUsuario.status === 404) {
                    // Ambos el correo y el usuario no existen, puedes proceder a crear el nuevo usuario
                    let destinoURL = userType === 'Cliente' ? '/gestion/cliente/crea/' : '/gestion/duenno/crea/';
                    tipoUsuario = userType === 'Cliente' ? 'true' : 'false';

                    const responseNuevoUsuario = await fetch(`${api.USER_URL}${destinoURL}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "email": email,
                            "username": username,
                            "nombre": nombre,
                            "ApPaterno": apPaterno,
                            "ApMaterno": apMaterno,
                            "fecha_nacimiento": doB,
                            "es_cliente": tipoUsuario,
                            "password": password,
                        })
                    });

                    const dataNuevoUsuario = await responseNuevoUsuario.json();

                    if (responseNuevoUsuario.ok) {
                        console.log(dataNuevoUsuario);
                        localStorage.setItem('currentUser', JSON.stringify(dataNuevoUsuario));
                        window.location.href = '/';
                    } else {
                        console.error('Error en la solicitud del perfil del nuevo usuario');
                    }
                } else {
                    // El correo o el usuario ya existen, muestra un mensaje de error o toma alguna acción adecuada
                    handleAlert("Usuario o correo ya registrado", "Verifique sus credenciales e inténtelo nuevamente.");
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
                    <IonButton fill='clear' color={'dark'} onClick={handleGoBack}>
                        <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                        Volver
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonList>
                    <IonLabel>Informacion personal</IonLabel>
                    <IonItem>
                        <IonInput
                            id="username"
                            placeholder="Nombre de usuario"
                            onIonChange={(e) => setUsername(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            id="email"
                            placeholder="Correo electrónico"
                            onIonChange={(e) => setEmail(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            placeholder="Nombre"
                            onIonChange={(e) => setNombre(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            placeholder="Apellido Paterno"
                            onIonChange={(e) => setApPaterno(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            placeholder="Apellido Materno"
                            onIonChange={(e) => setApMaterno(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            type='date'
                            placeholder="Fecha de Nacimiento"
                            onIonChange={(e) => setDoB(e.detail.value!)} />
                    </IonItem>
                    <IonLabel>Seleccione que tipo de usuario desea ser </IonLabel>
                    <IonItem>
                        <IonRadioGroup value="" onIonChange={
                            (e) => setUserType(e.detail.value!)
                        }>
                            <IonRadio value="Cliente">Cliente</IonRadio>
                            <br />
                            <IonRadio value="Duenno">Dueño</IonRadio>

                        </IonRadioGroup>
                    </IonItem>

                    <IonLabel>Contraseña</IonLabel>
                    <IonItem>
                        <IonInput
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirme su contraseña"
                            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                        />
                    </IonItem>
                    <IonButton expand="full" onClick={handleRegister}>
                        Registrarse
                    </IonButton>
                </IonList>
            </IonContent>
        </IonPage >
    );
};
export default RegisterPage;
