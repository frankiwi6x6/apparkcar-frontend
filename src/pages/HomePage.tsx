import { api } from '../environment';
import React, { useEffect, useState } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonRow, IonCol, IonButton, IonIcon, IonFab, IonFabButton, IonFabList, useIonAlert
} from '@ionic/react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import './HomePage.css';
import { Estacionamiento } from './interfaces';
import { Geolocation } from '@ionic-native/geolocation';
import { settings, receipt, exit, person } from 'ionicons/icons';
import ParkingCard from '../components/ParkingCard';


const currentUser: any | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

console.log(currentUser);
interface HomePageProps extends RouteComponentProps { }


const HomePage: React.FC<HomePageProps> = ({ history }) => {
  const [listaEstacionamientos, setListaEstacionamientos] = useState<Estacionamiento[]>([]);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ latitud: number; longitud: number } | null>(null);
  const [presentAlert] = useIonAlert();

  const handleLogout = () => {
    presentAlert({
      header: 'Cerrar sesión',
      message: '¿Está seguro que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
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
  const handleAddEstacionamiento = () => {
    // Redirige a la página de agregar estacionamiento
    history.push('/add-estacionamiento');
  };
  const obtenerListaEstacionamientos = async () => {
    try {
      const response = await fetch(ubicacionUsuario?.latitud ? `${api.PARK_URL}/estacionamientos/dist/${ubicacionUsuario?.latitud}/${ubicacionUsuario?.longitud}` : `${api.PARK_URL}/estacionamientos/lista/`);

      if (response.ok) {
        const data = await response.json();
        setListaEstacionamientos(data);
      } else {
        console.error('Error al obtener la lista de estacionamientos');
      }
    } catch (error) {
      console.error('Error de red', error);
    }
  };

  const obtenerUbicacionActual = async () => {
    try {
      const posicion = await Geolocation.getCurrentPosition();
      const latitudUsuario = posicion.coords.latitude;
      const longitudUsuario = posicion.coords.longitude;

      setUbicacionUsuario({ latitud: latitudUsuario, longitud: longitudUsuario });
    } catch (error) {
      console.error('Error al obtener la ubicación', error);
    }
  };


  const handleHistorial = () => {
    history.push('/historial');
  }

  useEffect(() => {
    obtenerListaEstacionamientos();
    obtenerUbicacionActual();

    // Establecer intervalo para obtener datos cada 2 minutos
    const obtenerDatosInterval = setInterval(() => {
      obtenerListaEstacionamientos();
      obtenerUbicacionActual();
    }, 120000); // 2 minutos en milisegundos

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(obtenerDatosInterval);
  }, []); // Asegúrate de ejecutar esto solo una vez al montar el componente

  const handleGoToProfile = (username:string) => {
    history.push(`/u/${username}`);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab slot="fixed" vertical="top" horizontal="end" edge={true}>
          <IonFabButton>
            <img className='fotoPerfil' src={`${api.USER_URL}/gestion/usuario/${currentUser.username}/profile-pic`} alt="" />
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton onClick={() => handleGoToProfile(currentUser.username)}>

              <IonIcon icon={person} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={settings}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={handleHistorial}>
              <IonIcon icon={receipt}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={handleLogout} >
              <IonIcon color='danger' icon={exit}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <IonRow className=" ">
          <IonCol>
            <div className='mapa ion-justify-content-center ion-align-items-center'>
              <p className='ion-text-center ion-align-items-center text-dark'>Aqui debería ir el mapa jejeje</p>
            </div>
            {/* Botón inferior */}
            {currentUser.es_cliente === false ? <IonButton className='boton-inferior' shape='round' onClick={handleAddEstacionamiento}>
              +
            </IonButton> : null}
          </IonCol>
        </IonRow>
        {/* Sección inferior de la pantalla */}
        <Swiper navigation spaceBetween={20} slidesPerView={1.2} className='barraCartas'>
          {listaEstacionamientos.map((estacionamiento) => (
            <SwiperSlide key={estacionamiento.id} className={estacionamiento.capacidad >= 1 ? 'disponible' : 'no-disponible'} >

              <ParkingCard key={estacionamiento.id} estacionamiento={estacionamiento} />
            </SwiperSlide>
          ))}
        </Swiper>

      </IonContent>
    </IonPage>
  );
};

export default withRouter(HomePage);
