import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux'
import store from './store'
import './bootstrap.min.css'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXtceXZVQ2JdVkBwXUY=')
const container = document.getElementById('root')
const root = ReactDOMClient.createRoot(container);
// Initial render: Render an element to the root.
root.render(<Provider store={store}>
  <App />
</Provider>);

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
