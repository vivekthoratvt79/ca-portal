import React from 'react';
import './App.css';
import Auth from './components/Auth';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Clients from './components/Clients';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loan from './components/Loan';
import Employees from './components/Employees';
import Settings from './components/Settings';
import Income from './components/Income';
import Expenditure from './components/Expenditure';
import GstR1 from './components/GstR1';
import Gst3B from './components/Gst3B';
import Gst9R from './components/Gst9R';
import Gst9RC from './components/Gst9RC';
import IndividualTax from './components/IndividualTax';
import CompanyTax from './components/CompanyTax';
import NoPageFound from './components/NoPageFound';
import { useDispatch, useSelector } from 'react-redux';
import Managers from './components/Managers';
import { syncUserData } from './actions/auth';

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

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        {user ? (
          <>
            <Route path='*' element={<NoPageFound />} />
            <Route path='/' element={<Home />}></Route>
            <Route path='/home' element={<Home />}></Route>
            <Route path='/gst/r1' element={<GstR1 />}></Route>
            <Route path='/gst/3b' element={<Gst3B />}></Route>
            <Route path='/gst/9r' element={<Gst9R />}></Route>
            <Route path='/gst/9rc' element={<Gst9RC />}></Route>
            <Route path='/tax/individual' element={<IndividualTax />}></Route>
            <Route path='/tax/company' element={<CompanyTax />}></Route>
            <Route path='/loan' element={<Loan />}></Route>
            {userRole && userRole == 'admin' && (
              <Route path='/managers' element={<Managers />}></Route>
            )}
            <Route path='/employees' element={<Employees />}></Route>
            <Route path='/clients' element={<Clients />}></Route>
            <Route path='/settings' element={<Settings />}></Route>
            <Route path='/income' element={<Income />}></Route>
            <Route path='/expenditure' element={<Expenditure />}></Route>
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
    </BrowserRouter>
  );
};

export default App;
