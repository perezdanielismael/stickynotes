import React from 'react'
import {Link, NavLink} from 'react-router-dom';
import {auth} from '../firebase'
import {withRouter} from 'react-router-dom'
import './Navbar.css'
const Navbar = (props) => {
    
    const cerrarSesion = () =>{
        auth.signOut()
            .then(()=>{
                props.history.push('/login')
            })
    }
    
    return (
        
        <div className='navbar container menu'>
         <Link className=' logo' to='/'  exact='true'>Sticky Note</Link>
            <div>
                <div className="d-flex">
                    <NavLink to='/' className='btn btn-dark me-2' exact>
                        Inicio
                    </NavLink>
                    {
                        props.firebaseUser !== null ? (
                            <NavLink to='/admin' className='btn btn-dark me-2' exact>
                                Tareas
                            </NavLink>
                        ) : null
                    }
                    
                   
                    {
                        props.firebaseUser !== null ? (
                            <button className="btn btn-danger" onClick={()=>cerrarSesion()}>Cerrar Sesión</button>
                        ) : (
                            <NavLink to='/login' className='btn btn-primary me-2' exact>
                                Login
                            </NavLink>
                        )
                    }
                    
                </div>
            </div>
            
        </div>
    )
}

export default withRouter(Navbar)
