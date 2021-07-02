import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Admin from './components/Admin';
import Login from './components/Login';
import Navbar from './components/Navbar';
import React from 'react'
import {auth} from './firebase';
import Validar from './components/Validar';
import './App.css'

import Inicio from './components/Inicio';
function App() {

  const [firebaseUser, setFirebaseUser] = React.useState(false)

  React.useEffect(()=>{
    auth.onAuthStateChanged(user =>{
      if(user){
        setFirebaseUser(user)
      }else{
        setFirebaseUser(null)
      }
    })
  },[])

  return firebaseUser !== false ? (
    <div >
     
     <Router>
        <Navbar firebaseUser={firebaseUser} />
        <Switch>
          <Route path='/' exact>
            <Inicio />
          </Route>

          <Route path='/admin'>
           <Admin />
          </Route>

          <Route path='/login'>
            <Login />
          </Route>

          <Route path='/validar'>
            <Validar />
          </Route>
        </Switch>
     </Router>
    </div>
  ) : (
    <p>Cargando...</p>
  )
}

export default App;
