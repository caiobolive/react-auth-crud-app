import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';

import rootSlices from './rootSlices';
import rootSagas from './rootSagas';

const sagasMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootSlices,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagasMiddleware),
});

sagasMiddleware.run(rootSagas);
const persistor = persistStore(store);

export { store, persistor };
