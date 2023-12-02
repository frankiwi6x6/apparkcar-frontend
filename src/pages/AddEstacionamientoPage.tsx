import React from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLabel, IonItem, IonTextarea, IonCheckbox } from "@ionic/react";
import { useForm } from 'react-hook-form';

const AddEstacionamientoPage: React.FC = () => {
    const { register, handleSubmit } = useForm();

    const obtenerIdDueno = () => {
        const usuarioString = localStorage.getItem('currentUser');
    
        if (usuarioString) {
            const usuario = JSON.parse(usuarioString);
            const id = usuario && usuario.usuario && usuario.usuario.id;
    
            if (id) {
                return id;
            }
        }
    
        // Manejar el caso en el que el localStorage está vacío o no tiene el formato esperado
        console.error('Error al obtener el ID del dueño');
        return null; // Otra acción adecuada según tu lógica
    };

    const onSubmit = async (data: any) => {
        try {
            // Agregar el ID del dueño a los datos del formulario (puedes obtener esto de donde sea necesario)
            const idDueno = obtenerIdDueno(); // Reemplaza esto con tu lógica real
            data.id_dueno = idDueno;

            // Crear un objeto FormData para enviar al servidor
            const formData = new FormData();

            // Agregar datos del formulario al FormData
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            // Obtener el input de tipo file
            const imagenesInput = document.querySelector('input[type="file"]');

            // Agregar archivos al FormData
            if (imagenesInput?.files) {
                for (let i = 0; i < imagenesInput.files.length; i++) {
                    formData.append('imagenes', imagenesInput.files[i]);
                }
            }

            // Enviar FormData al servidor, por ejemplo, utilizando fetch
            const response = await fetch('http://127.0.0.1:8002/estacionamientos/crear/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Manejar la respuesta exitosa
                console.log('Estacionamiento añadido exitosamente');
            } else {
                // Manejar errores de la respuesta
                console.error('Error al añadir estacionamiento');
            }
        } catch (error) {
            // Manejar errores de la petición
            console.error('Error de red', error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Añadir un estacionamiento</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IonItem>
                        <IonLabel position="floating">Título</IonLabel>
                        <IonInput {...register('titulo')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Descripción</IonLabel>
                        <IonTextarea {...register('descripcion')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Tipo</IonLabel>
                        <IonInput {...register('tipo')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Precio</IonLabel>
                        <IonInput type="number" {...register('precio')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Capacidad</IonLabel>
                        <IonInput type="number" {...register('capacidad')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Latitud</IonLabel>
                        <IonInput type="number" {...register('latitud')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Longitud</IonLabel>
                        <IonInput type="number" {...register('longitud')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Estado</IonLabel>
                        <IonCheckbox {...register('estado')} />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Imágenes</IonLabel>
                        <input type="file" accept="image/*" multiple {...register('imagenes')} />
                    </IonItem>

                    <IonButton expand='block' onClick={onSubmit} type="submit">Guardar</IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default AddEstacionamientoPage;

