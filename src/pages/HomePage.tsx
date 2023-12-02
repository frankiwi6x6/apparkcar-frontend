import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonRow, IonCol, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import './HomePage.css';
import { Estacionamiento } from './interfaces';


const currentUser = localStorage.getItem('currentUser');

interface HomePageProps extends RouteComponentProps {}



const latitudUsuario = -33.035555;
const longitudUsuario = -71.535959;

const HomePage: React.FC<HomePageProps> = ({ history }) => {
  const [listaEstacionamientos, setListaEstacionamientos] = useState<Estacionamiento[]>([]);

  const handleAddEstacionamiento = () => {
    // Redirige a la página de agregar estacionamiento
    history.push('/add-estacionamiento');
  };

  const obtenerListaEstacionamientos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8002/estacionamientos/lista/');

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
  const calcularDistancia = (latitudUsuario: any, longitudUsuario: any, latitudEstacionamiento: any, longitudEstacionamiento: any) => {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros
  
    const dLat = (latitudEstacionamiento - latitudUsuario) * (Math.PI / 180);
    const dLon = (longitudEstacionamiento - longitudUsuario) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latitudUsuario * (Math.PI / 180)) * Math.cos(latitudEstacionamiento * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distancia = radioTierra * c; // Distancia en kilómetros
    
    const distanciaFinal = distancia.toFixed(2);
    console.log(`La distancia al estacionamiento es aproximadamente ${(distanciaFinal)} km`);
    return distanciaFinal;
  };

  useEffect(() => {
    obtenerListaEstacionamientos();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow className=" ">
          <IonCol>
            <div className='mapa ion-justify-content-center ion-align-items-center'>
              <p className='ion-text-center ion-align-items-center'>Aquí debería ir el mapa jeje</p>
            </div>
          </IonCol>
        </IonRow>
        {/* Sección inferior de la pantalla */}
        <div className='seccionCartas'>
          <Swiper
            spaceBetween={10}
            slidesPerView={1.5}
          >
            {listaEstacionamientos.map((estacionamiento) => (
              <SwiperSlide key={estacionamiento.id}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{estacionamiento.titulo}</IonCardTitle>
                    <IonCardSubtitle>{estacionamiento.tipo}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Distancia: a {calcularDistancia(latitudUsuario, longitudUsuario, estacionamiento.latitud, estacionamiento.longitud)} km</p>
                  </IonCardContent>
                  
                </IonCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Botón inferior */}
        <IonButton className='boton-inferior' onClick={handleAddEstacionamiento} shape="round">
          +
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(HomePage);
