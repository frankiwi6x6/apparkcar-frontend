import { IonButton, IonIcon } from '@ionic/react';
import { documentOutline } from 'ionicons/icons';
import React, { useEffect, useRef } from 'react';

const ReportButton = ({ onClick }) => {
    const isMounted = useRef(true);

    useEffect(() => {
        // Asignar el evento onClick al botón solo cuando el componente está montado
        if (isMounted.current) {
            const botonDescarga = document.getElementById('boton-documento');
            if (botonDescarga) {
                botonDescarga.addEventListener('click', onClick);
            }
        }

        // Desregistrar el evento cuando el componente se desmonte
        return () => {
            if (isMounted.current) {
                const botonDescarga = document.getElementById('boton-documento');
                if (botonDescarga) {
                    botonDescarga.removeEventListener('click', onClick);
                }
            }
        };
    }, [onClick]);

    // Establecer isMounted en falso cuando el componente se desmonta
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <IonButton id='boton-documento'  onClick={onClick}>
            <IonIcon icon={documentOutline} ></IonIcon>
        </IonButton>
    );
};

export default ReportButton;
