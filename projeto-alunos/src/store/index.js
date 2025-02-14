import { persistStore } from 'redux-persist';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { thunk } from 'redux-thunk'; // Importe o Redux Thunk

import persistedReducers from './modules/reduxPersist';
import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();

// Criando a store com o redux-persist
const store = createStore(
  persistedReducers(rootReducer), // Persistindo o reducer
  applyMiddleware(thunk, sagaMiddleware) // Adicione o thunk antes do sagaMiddleware
);

sagaMiddleware.run(rootSaga); // Rodando as sagas

// Persistindo os dados
export const persistor = persistStore(store);
export default store;
