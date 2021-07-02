import React from 'react'
import {auth, db} from '../firebase'
import {withRouter} from 'react-router-dom';
import './Login.css'
const Login = (props) => {

    const [mail, setMail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const [registro, setRegistro] = React.useState(false)


    //-----------------Función para enviar formulario para registrarse o loguearse-----------------------------//
    const enviarForm = (e) =>{
        e.preventDefault()
        if(!mail.trim()){
            setError('Por favor escriba su correo electrónico')
            return
        }
        if(!password.trim()){
            setError('Por favor agregue una contraseña')
            return
        }
        if(password.length < 6){
            setError('La contraseña debe tener al menos 6 carácteres')
            return
        }
        console.log('Usuario registrado...')
        setMail('')
        setPassword('')
        setError(null)

        if(registro){
            registrar()
            
        }
        else{
            loguear()
           
        }
    }
    const clickear = () =>{
        console.log('diste click en registrar')
    }

    //----------------------------Loguearse-------------------------------------------//
    const loguear = React.useCallback(async()=>{ 
        try {
            const resp = await auth.signInWithEmailAndPassword(mail, password)
            console.log(resp.user)
            setMail('')
            setPassword('')
            setError(null)
            props.history.push('/admin')
        } catch (error) {
            console.log(error)
            if(error.code === 'auth/user-not-found'){
                setError('El mail no corresponde a un usuario...')
            }
            if(error.code === 'auth/wrong-password'){
                setError('La contraseña no es correcta')
            }
        }
       
    },[mail, password, props.history])

    //--------------------------Registrarse------------------------------------------//
    const registrar = React.useCallback(async()=>{
        try {
            
            const res = await auth.createUserWithEmailAndPassword(mail, password)
            console.log(res.user)
            await db.collection('usuarios').doc(res.user.email).set({
                email: res.user.email,
                fecha: Date.now(), 
                uid: res.user.uid
            })
            await db.collection(res.user.uid).add({
                tarea: 'Tarea de ejemplo'
            })
            props.history.push('/admin')

        } catch (error) {
            console.log(error)
            if(error.code === 'auth/invalid-email')
            setError('Correo inválido.')
            if(error.code === 'auth/email-already-in-use')
            setError('Ya existe una cuenta con este mail.')
        }

    }, [mail, password, props.history])


    /************************************************************************************/
    //-------------------DIVISION DE FUNCIONES Y LO QUE SE RETORNA-----------------------/
    /************************************************************************************/
    return (
        <div className='login bg-primary bg-gradient container mt-3'>
            
            <h1 className="text-center titleSet">
                {
                    registro ? 'Registrarme' : 'Iniciar Sesión'
                }
            </h1>
            <h5 className='text-center mb-5 titleSet'>Ir a Stycky Notes</h5>
            
            <div className="row justify-content-center">
                <div className="col-10 col-sm-8 col-md-6 col-xl-4">
                    
                    <form onSubmit={enviarForm}>
                        {
                            error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )
                        }
                        <p className='text-p'>Usuario</p>
                        <input 
                        type="email" 
                        placeholder='Correo Electrónico'
                        className="form-control mb-2 inputMail"
                        onChange={(e) => setMail(e.target.value)}
                        value={mail}
                        />
                        <p className='text-p'>Contraseña</p>
                        <input 
                        type="password" 
                        placeholder='Ingresar Contraseña'
                        className="form-control mb-4 inputMail" 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        />
                        <div className="d-grid">
                        <button 
                        onClick={() => clickear()}
                        type='submit'
                        className="btn btn-primary btn-lg mt-2 botonIngreso">
                            {registro ? 'REGISTRARSE' : 'INGRESAR'}
                        </button>

                        <button type='button' className="btn btn-primary btn-sm mt-2" 
                        onClick={()=>setRegistro(!registro)}
                        >
                            {
                                registro ? '¿Ya estás registrado?' : '¿No tienes cuenta?'
                            }
                        </button>
                        {
                            !registro ? (
                                <button 
                                onClick={()=> props.history.push('/validar')}
                                className="btn btn-primary btn-sm mt-2">
                                    Recuperar contraseña
                                </button>
                            ) : null
                        }
                        </div>
                       
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
