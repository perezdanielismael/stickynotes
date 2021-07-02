import React, { useEffect } from 'react'
import {auth} from '../firebase';
import {withRouter} from 'react-router-dom';
import Notas from './Notas';


const Admin = (props) => {
    
    const [usuario, setUsuario] = React.useState(null)

    useEffect(()=>{

        if(auth.currentUser){
            console.log('El usuario existe...')
            setUsuario(auth.currentUser)
        }
        else{
            console.log('El usuario no existe...')
            props.history.push('/login')
        }

    },[props.history])
    
    return (
        <div>
           
            {
                usuario &&  (
                    <Notas usuario={usuario}/>
                )
                      
                   }
        </div>
    )
}

export default withRouter(Admin)
