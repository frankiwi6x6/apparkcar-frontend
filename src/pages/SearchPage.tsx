import { api } from '../environment'
import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonList, IonItem, IonLabel, IonText, IonAvatar } from '@ionic/react';
import { useHistory } from 'react-router-dom';  // Importa useHistory de react-router-dom
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [searchError, setSearchError] = useState<string>('');
  const history = useHistory();  // Obtiene la instancia de useHistory

  const delayedSearch = async (text: string) => {
    try {
      const response = await fetch(`${api.USER_URL}/gestion/usuario/buscar/${text}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
        setSearchError('');
      } else {
        setSearchResults([]);
        setSearchError(data.message || 'Error en la búsqueda');
      }
    } catch (error) {
      console.error('Error al realizar la búsqueda', error);
      setSearchResults([]);
      setSearchError('Error en la búsqueda');
    }
  };

  const handleSearch = (e: CustomEvent) => {
    const text = e.detail.value as string;
    setSearchText(text);

    // Programa una nueva búsqueda después de 500ms (ajusta según sea necesario)
    setTimeout(() => delayedSearch(text), 500);
  };

  // Nueva función para manejar la redirección a la página de perfil del usuario
  const redirectToUserProfile = (username: string) => {
    history.push(`/u/${username}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Buscar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar value={searchText} onIonChange={handleSearch}></IonSearchbar>

        {searchError && <IonText color="danger">{searchError}</IonText>}

        <IonList>
          {searchResults.map(usuario => (
            <IonItem key={usuario.id} className="usuario-item" onClick={() => redirectToUserProfile(usuario.username)}>
              <IonAvatar slot="start" className="usuario-avatar">
                <img src={usuario.profile_pic_url} alt={`Perfil de ${usuario.username}`} />
              </IonAvatar>
              <IonLabel className="usuario-label">{usuario.username}</IonLabel>
            </IonItem>

          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
