import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
const root = createRoot(document.getElementById('root'));
const render = Component => root.render(<React.StrictMode><Component /></React.StrictMode>);
if (__LOCAL_CATALOG__) {
  import('./catalog/CatalogApp.jsx').then(({ default: CatalogApp }) => render(CatalogApp));
} else render(App);
