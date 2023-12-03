import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import './HomePage.css';
import { Estacionamiento } from './interfaces';
import { Geolocation } from '@ionic-native/geolocation';
import { bicycle, document, bicycleOutline, car, carOutline, chevronDownCircle, colorPalette, globe, settings, receipt, exit } from 'ionicons/icons';

const currentUser: any | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

console.log(currentUser);
interface HomePageProps extends RouteComponentProps { }

const HomePage: React.FC<HomePageProps> = ({ history }) => {
  const [listaEstacionamientos, setListaEstacionamientos] = useState<Estacionamiento[]>([]);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ latitud: number; longitud: number } | null>(null);

  const handleAddEstacionamiento = () => {
    // Redirige a la página de agregar estacionamiento
    history.push('/add-estacionamiento');
  };
  const API_USER_URL = 'http://127.0.0.1:8000';
  const API_PARK_URL = 'http://127.0.0.1:8002';
  const obtenerListaEstacionamientos = async () => {
    try {
      const response = await fetch(ubicacionUsuario?.latitud ? `${API_PARK_URL}/estacionamientos/dist/${ubicacionUsuario?.latitud}/${ubicacionUsuario?.longitud}` : `${API_PARK_URL}/estacionamientos/lista/`);

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

  const handleLogout = () => {
    //pedir modal de confirmacion



    localStorage.removeItem('currentUser');
    window.location.href = '/';
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
            <img className='fotoPerfil' src={`${API_USER_URL}/gestion/usuario/${currentUser.username}/profile-pic`} alt="" />
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton>
              <IonIcon icon={settings}></IonIcon>
            </IonFabButton>
            <IonFabButton>
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
              <p className='ion-text-center ion-align-items-center'>Aqui debería ir el mapa jejeje</p>
            </div>
            {/* Botón inferior */}
            <IonButton className='boton-inferior' shape='round' onClick={handleAddEstacionamiento}>
              +
            </IonButton>
          </IonCol>
        </IonRow>
        {/* Sección inferior de la pantalla */}
        <Swiper navigation spaceBetween={20} slidesPerView={1.2} className='barraCartas'>
          {listaEstacionamientos.map((estacionamiento) => (
            <SwiperSlide key={estacionamiento.id}>
              <IonCard>
                <IonCardContent>
                  <div className="direccion">
                    <IonCardTitle>
                      {estacionamiento.titulo}
                    </IonCardTitle>
                  </div>
                  <p><span className='precio'>${estacionamiento.precio}</span> / hora</p>


                  <div className="info">
                    {estacionamiento.distancia && (
                      <IonCardSubtitle>{`A ${estacionamiento.distancia} km`}</IonCardSubtitle>
                    )}


                    <p>
                      <span className='iconoTipo'>{estacionamiento.tipo === 'Autos' ? <IonIcon color='primary' icon={car} /> : <IonIcon color='primary' icon={bicycle} />}</span>
                      {estacionamiento.capacidad} {estacionamiento.capacidad <= 1 ? "espacio disponible" : "espacios disponibles"}
                    </p>
                  </div>

                  <IonButton fill='clear'>Reservar</IonButton>
                </IonCardContent>
              </IonCard>
            </SwiperSlide>
          ))}
        </Swiper>

      </IonContent>
    </IonPage>
  );
};

export default withRouter(HomePage);
