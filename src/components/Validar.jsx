import React from 'react'
import {auth} from '../firebase'
import {withRouter} from 'react-router-dom';
import './Validar.css'
const Validar = (props) => {

const [mail, setMail] = React.useState('');
const [error, setError] = React.useState(null);


const enviarForm = (e) =>{
    e.preventDefault()
    if(!mail.trim()){
        setError('Por favor escriba su correo electrónico')
        return
    }
    recuperar()
    setMail('')
    setError(null)
  
}

    const recuperar = React.useCallback(async ()=>{
        try {
           await auth.sendPasswordResetEmail(mail)
            console.log('correo enviado')
            props.history.push('/login')
        } catch (error) {
            console.log(error)
            if(error.code === "auth/user-not-found"){
                setError('El correo no pertenece a un usuario')
                return
            }
            if(error.code === 'auth/invalid-email'){
                setError('El correo es inválido')
                return
            }
        }
    },[mail, props.history])


    return (
        <div className='container mt-3 bg-primary bg-gradient reset'>
            <h1 className="text-center mt-5 titleSet">
                Recuperar Contraseña
            </h1>
            
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    
                    <form onSubmit={enviarForm}>
                        {
                            error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )
                        }
                        <p className="text-p">Usuario</p>
                        <input 
                        type="email" 
                        placeholder='Correo Electrónico'
                        className="form-control  mb-3 inputMail"
                        onChange={(e) => setMail(e.target.value)}
                        value={mail}
                        />

                        <div className="d-grid">
                        <button 
                        type='submit'
                        className="btn btn-primary btn-lg mt-2 send">
                           Enviar Correo
                        </button>
                        </div>
                       
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Validar) 
