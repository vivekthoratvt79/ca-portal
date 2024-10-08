import React, { useEffect, useState } from 'react';
import './App.css';
import * as api from '../src/api';
import Auth from './components/Auth';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Clients from './components/Clients';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Loan from './components/Loan';
import Employees from './components/Employees';
import Settings from './components/Settings';
import Income from './components/Income';
import Expenditure from './components/Expenditure';
import GstR1 from './components/GstR1';
import Gst3B from './components/Gst3B';
import GstR9 from './components/GstR9';
import Gst2B from './components/Gst2B';
import IndividualTax from './components/IndividualTax';
import CompanyTax from './components/CompanyTax';
import NoPageFound from './components/NoPageFound';
import { useDispatch, useSelector } from 'react-redux';
import Managers from './components/Managers';
import { syncUserData } from './actions/auth';
import NotificationForm from './components/NotificationForm';
import InvoiceForm from './components/InvoiceForm';
import ClientHome from './components/ClientHome';
import Gst2BPR from './components/Gst2BPR';
import TDS from './components/TDS';
import VAT from './components/VAT';
import Consultancy from './components/Consultancy';
import SuperAdmin from './components/SuperAdmin';
import PTRC from './components/PTRC';
import PTEC from './components/PTEC';
import Accounting from './components/Accounting';
import LandingPage from './components/LandingPage';
import ClientDetails from './components/ClientDetails';
import RandomTask from './components/RandomTask';

const App = () => {
  const dispatch = useDispatch();
  let user =
    useSelector((state) => state.auth.authData) ||
    JSON.parse(localStorage.getItem('profile'));

  if (
    !useSelector((state) => state.auth.authData) &&
    JSON.parse(localStorage.getItem('profile'))
  ) {
    dispatch(syncUserData(user));
  }
  const userRole = useSelector((state) => state?.auth?.authData?.role);
  const userId = useSelector((state) => state?.auth?.authData?.entityID);
  const [access, setAccess] = useState([]);

  const publicVapidKey =
    'BDzzxr7CQi8Yur7Z5gGVgS5uFANpCQl2ysNiRJ6Hbr5CBd82dgQP2vt2kYVFcRfPJ1LclHo0sRG0E4C_Ca-GFdI';

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const subscribeUser = async (entityID, publicVapidKey) => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // Wait until the service worker is active
        await navigator.serviceWorker.ready;

        // Check if the user is already subscribed
        const existingSubscription =
          await registration.pushManager.getSubscription();

        if (existingSubscription) {
          console.log('Already subscribed:', existingSubscription);
          return existingSubscription;
        }

        // Subscribe the user if not already subscribed
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
        console.log('Push Subscription:', subscription);

        // Add entityID to the subscription payload
        const payload = {
          entityID: entityID,
          endpoint: subscription.endpoint,
          keys: subscription.toJSON().keys,
        };

        // Send the subscription to the server
        try {
          const data = await api.notificationSubscribe(payload);
          console.log('Subscription sent to server:', data);
        } catch (error) {
          console.error('Failed to send subscription to server:', error);
        }
      } else {
        console.warn('Push messaging is not supported');
      }
    } catch (error) {
      console.error('Service Worker or Push Subscription failed:', error);
    }
  };

  useEffect(() => {
    if (user) subscribeUser(user.entityID, publicVapidKey);
  }, [user]);

  useEffect(() => {
    function fetchAccessKeys() {
      try {
        api.getAccessKeys(userId).then(({ data }) => {
          setAccess(data.data.user[0].accessKeys);
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (userId) fetchAccessKeys();
  }, [userId]);

  const host = window.location.hostname;
  const subdomain = host.split('.')[0];
  let showLandingPage =
    subdomain == 'localhost' || subdomain == 'cabook' ? false : true;

  return (
    <BrowserRouter>
      {showLandingPage ? (
        <LandingPage subdomain={subdomain} />
      ) : (
        <>
          <Navbar user={user} />
          <Routes>
            {user && userRole != 'client' && userRole != 'superadmin' ? (
              <>
                <Route path='*' element={<NoPageFound />} />
                <Route path='/' element={<Home access={access} />}></Route>
                <Route path='/invoice' element={<InvoiceForm />}></Route>
                <Route path='/home' element={<Home access={access} />}></Route>
                <Route
                  path='/gst/r1'
                  element={<GstR1 access={access} />}
                ></Route>
                <Route
                  path='/gst/3b'
                  element={<Gst3B access={access} />}
                ></Route>
                <Route
                  path='/gst/r9'
                  element={<GstR9 access={access} />}
                ></Route>
                <Route
                  path='/gst/2b'
                  element={<Gst2B access={access} />}
                ></Route>
                <Route
                  path='/gst/2bpr'
                  element={<Gst2BPR access={access} />}
                ></Route>
                <Route
                  path='/tax/individual'
                  element={<IndividualTax access={access} />}
                ></Route>
                <Route
                  path='/tax/company'
                  element={<CompanyTax access={access} />}
                ></Route>
                <Route path='/tds' element={<TDS access={access} />}></Route>
                <Route path='/vat' element={<VAT access={access} />}></Route>
                <Route path='/ptrc' element={<PTRC access={access} />}></Route>
                <Route path='/ptec' element={<PTEC access={access} />}></Route>
                <Route
                  path='/accounting'
                  element={<Accounting access={access} />}
                ></Route>
                <Route
                  path='/consultancy'
                  element={<Consultancy access={access} />}
                ></Route>
                <Route
                  path='/notification'
                  element={<NotificationForm access={access} />}
                ></Route>
                <Route
                  path='/managers'
                  element={<Managers access={access} />}
                ></Route>

                <Route
                  path='/employees'
                  element={<Employees access={access} />}
                ></Route>
                <Route
                  path='/clients'
                  element={<Clients access={access} />}
                ></Route>
                <Route
                  path='/settings'
                  element={<Settings access={access} />}
                ></Route>
                <Route
                  path='/income'
                  element={<Income access={access} />}
                ></Route>
                <Route path='/client/:id' element={<ClientDetails />}></Route>
                <Route
                  path='/tasks'
                  element={<RandomTask access={access} />}
                ></Route>
                {/* <Route
              path='/expenditure'
              element={<Expenditure access={access} />}
            ></Route> */}
              </>
            ) : userRole == 'superadmin' ? (
              <>
                <Route path='*' element={<NoPageFound />} />
                <Route path='/' element={<SuperAdmin />}></Route>
              </>
            ) : userRole == 'client' ? (
              <>
                <Route path='*' element={<NoPageFound />} />
                <Route path='/' element={<ClientHome />}></Route>
              </>
            ) : (
              <>
                <Route path='*' element={<Auth />}></Route>
                {/* <Route path='/gst/r1' element={<Auth />}></Route>
            <Route path='/gst/3b' element={<Auth />}></Route>
            <Route path='/gst/9r' element={<Auth />}></Route>
            <Route path='/gst/9rc' element={<Auth />}></Route>
            <Route path='/tax/individual' element={<Auth />}></Route>
            <Route path='/tax/company' element={<Auth />}></Route>
            <Route path='/loan' element={<Auth />}></Route>
            <Route path='/managers' element={<Auth />}></Route>
            <Route path='/employees' element={<Auth />}></Route>
            <Route path='/clients' element={<Auth />}></Route>
            <Route path='/settings' element={<Auth />}></Route>
            <Route path='/income' element={<Auth />}></Route>
            <Route path='/expenditure' element={<Auth />}></Route>
            <Route path='/auth' element={<Auth />}></Route> */}
              </>
            )}
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
