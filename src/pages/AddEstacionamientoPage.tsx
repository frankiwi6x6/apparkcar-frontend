import { api } from '../environment'
import React from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonLabel,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useForm } from 'react-hook-form';
interface Estacionamiento {
  "id_dueno": number,
  "titulo": string,
  "descripcion": string,
  "tipo": string,
  "latitud": number,
  "longitud": number,
  "precio": number,
  "capacidad": number,
  "estado": boolean
}

const AddEstacionamientoPage: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm();

  const [titulo, setTitulo] = React.useState<string>('');
  const [descripcion, setDescripcion] = React.useState<string>('');
  const [tipo, setTipo] = React.useState<string>('');
  const [direccion, setDireccion] = React.useState<string>('');
  const [latitud, setLatitud] = React.useState<number>(0);
  const [longitud, setLongitud] = React.useState<number>(0);
  const [precio, setPrecio] = React.useState<number>(0);
  const [capacidad, setCapacidad] = React.useState<number>(0);



  const onSubmit = async () => {
    try {
      // Obtén el usuario actual del almacenamiento local
      const currentUser: any | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

      if (!currentUser) {
        // Maneja la situación en la que no hay un usuario actual
        console.error('No se encontró un usuario actual');
        return;
      }
      const data: Estacionamiento = {
        id_dueno: currentUser.id,
        titulo: titulo,
        descripcion: descripcion,
        tipo: tipo,
        latitud: latitud,
        longitud: longitud,
        precio: precio,
        capacidad: capacidad,
        estado: true
      };
      // Agrega el ID del dueño a los datos del formulario


      // Realiza la solicitud a la API para crear un estacionamiento
      const response = await fetch(`${api.PARK_URL}/estacionamientos/crear/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Verifica si la solicitud fue exitosa (código de estado 2xx)
      if (response.ok) {
        // Maneja la respuesta exitosa
        console.log('Estacionamiento añadido exitosamente');
        window.location.href = '/tabs/home';
      } else {
        // Maneja errores de la respuesta
        console.error('Error al añadir estacionamiento:', response.status, response.statusText);
      }
    } catch (error) {
      // Maneja errores de la petición
      console.error('Error de red:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home"></IonBackButton>
          </IonButtons>
          <IonTitle>Añadir un estacionamiento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonInput
              id="titulo"
              placeholder="Título"
              onIonChange={(e) => setTitulo(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonInput
              id="descripcion"
              placeholder="Descripcion"
              onIonChange={(e) => setDescripcion(e.detail.value!)} />
          </IonItem>
          <IonLabel>Seleccione que tipo de estacionamiento </IonLabel>
          <IonItem>
            <IonRadioGroup value="" onIonChange={
              (e) => setTipo(e.detail.value!)
            }>
              <IonRadio value="Autos">Autos</IonRadio>
              <br />
              <IonRadio value="Motos">Motos</IonRadio>

            </IonRadioGroup>
          </IonItem>
          <IonItem>
            <IonInput
              id="latitud"
              placeholder="Latitud"
              onIonChange={(e) => setLatitud(parseFloat(e.detail.value!))} />
          </IonItem>
          <IonItem>
            <IonInput
              id="longitud"
              placeholder="Longitud"
              onIonChange={(e) => setLongitud(parseFloat(e.detail.value!))} />
          </IonItem>
          <IonItem>
            <IonInput
              id="precio"
              placeholder="Precio por hora"
              onIonChange={(e) => setPrecio(parseFloat(e.detail.value!))} />
          </IonItem>
          <IonItem>
            <IonInput
              id="capacidad"
              placeholder="Capacidad"
              onIonChange={(e) => setCapacidad(parseFloat(e.detail.value!))} />
          </IonItem>


          <IonButton expand='block' type="submit">Guardar</IonButton>

        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddEstacionamientoPage;

