import React, { useState } from 'react'
import {db} from '../firebase'
import moment from 'moment';
import 'moment/locale/es'
import './Notas.css'
function Notas(props) {
 
  const [tareas, setTareas] = React.useState([])
  const [tarea, setTarea] = React.useState('')
  const [descripcion, setDescripcion] = React.useState('')
  const [responsable, setResponsable] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')
  const [prioridad, setPrioridad] = useState('')

  const [ultimo, setUltimo] = React.useState(null)
  const [desactivar, setDesactivar] = React.useState(false)
  const defaultValue = 'prioridad'
  //-------------------------------------Crear una nueva nota-------------------------------- 
  const enviarFormulario = async(e) =>{
    e.preventDefault()
    if(!tarea.trim()){
      console.log('El campo está vacío')
      return
    }
    if(!descripcion.trim()){
      console.log('El campo está vacío')
      return
    }
    if(!responsable.trim()){
      console.log('El campo está vacío')
      return
    }
    if(prioridad === 'prioridad'){
      console.log('Por favor seleccione una prioridad')
      return
    }
    try {
      const nuevaTarea = {
        tarea: tarea,
        descripcion: descripcion,
        responsable: responsable,
        prioridad: prioridad,
        fecha: Date.now()
      }
      const data = await db.collection(props.usuario.uid).add(nuevaTarea)
      setTareas([
        ...tareas,
        {
          ...nuevaTarea, id: data.id, 
                         fecha: Date.now(), 
                         descripcion: descripcion, 
                         responsable: responsable, 
                         prioridad: prioridad
        }
      ])
      
      setTarea('')
      setDescripcion('')
      setResponsable('')
      setPrioridad(defaultValue)
    } catch (error) {
      console.log(error)
    }
  }

  const clickear = ()=>{
    console.log('Diste click en agregar')
 
  }

  //------------------- Botón para eliminar una tarea ---------------------------------
  const eliminar = async (id) => {
      await db.collection(props.usuario.uid).doc(id).delete()
      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)
      setTarea('')
      setDescripcion('')
      setResponsable('')
      setPrioridad(defaultValue)
  }
   
  //el formulario cambia de agregar a editar con el elemento seleccionado
  const editarTarea =  (item) =>{
    setModoEdicion(true)
    setTarea(item.tarea)
    setDescripcion(item.descripcion)
    setResponsable(item.responsable)
    setId(item.id)
    setPrioridad(item.prioridad)
  }

  //Botón para modificar la tarea en el formulario
  const editar = async (e) =>{
    e.preventDefault()
    if(!tarea.trim()){
      console.log('El campo está vacío...')
      return
    }
    try {
      await db.collection(props.usuario.uid).doc(id).update({
        tarea: tarea,
        descripcion: descripcion,
        responsable: responsable,
        prioridad: prioridad,
        fecha: Date.now()
      })

      const arrayEditado = tareas.map(item => (item.id === id ? 
        { tarea: tarea, 
          descripcion: descripcion, 
          responsable: responsable,
          prioridad: prioridad
        } 
          : item))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setDescripcion('')
      setResponsable('')
      setId('')
      setPrioridad(defaultValue)

    } catch (error) {
      console.error(error)
    }
  }
  React.useEffect(() => { 
    //--------------------------Traer los datos del usuario logueado ---------------------------------------------
    const obtenerDatos = async () =>{
      try {
        const data = await db.collection(props.usuario.uid)
        .limit(2)
        .orderBy('tarea')
        .get()
        setUltimo(data.docs[data.docs.length - 1])
        
        const arrayTareas = data.docs.map(doc =>({id: doc.id, ...doc.data()}))
        console.log(arrayTareas)
        setTareas(arrayTareas)
        
      } catch (error) {
          console.log(error)
      }
    }
    obtenerDatos()
  }, [props.usuario.uid])

  //--------------------------- Funcion para el boton Ver Mas ---------------------------
  const verMas = async ()=>{
    setDesactivar(true)
    try {
      const data = await db.collection(props.usuario.uid)
        .limit(2)
        .orderBy('tarea')
        .startAfter(ultimo)
        .get()
        
        setUltimo(data.docs[data.docs.length - 1])

        const arrayTareas =  data.docs.map(doc =>({id: doc.id, ...doc.data()}))
        if(arrayTareas !== 0){
          setTareas([...tareas, ...arrayTareas])
        }

        const query = await db.collection(props.usuario.uid)
            .limit(2)
            .orderBy('tarea')
            .startAfter(data.docs[data.docs.length - 1])  
            .get()

        if(query.empty){
            console.log('no hay más...')
            setDesactivar(true)
        }else{
            setDesactivar(false)
        }
    } catch (error) {
      console.log(error)
    }
    console.log('ver mas')
  }
 //******************************************************************************************************
 //<----------------------Fragmento que se devuelve----------------------------------------------------->
 //******************************************************************************************************
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        
        {/*//-------------------- Formulario para crear notas -------------------------------------- */}
        <div className="col-xs-10 col-sm-8 col-md-6 mt-2">
          <h2 className="text-center titulos mb-4">
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
            }
          </h2>
          <form onSubmit={modoEdicion ? editar : enviarFormulario} className="d-grid">
            <input 
            type="text" 
            placeholder='Titulo de la tarea' 
            onChange={(e) => setTarea(e.target.value)}
            value={tarea}
            className="form-control mt-1 inputMail1" />

            <input 
            type="text" 
            placeholder='Breve descripción' 
            onChange={(e) => setDescripcion(e.target.value)}
            value={descripcion}
            className="form-control mt-2 inputMail1" />

            <input 
            type="text" 
            placeholder='Responsable / Fecha límite' 
            onChange={(e) => setResponsable(e.target.value)}
            value={responsable}
            className="form-control mt-2 inputMail1" />

            <select className='form-select mt-2 inputMail1 select'
                    onChange={(e)=>setPrioridad(e.target.value)}
                    aria-label='Default select example'
                    defaultValue='prioridad'
                    >
                    
              <option value='prioridad'>Prioridad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            
            <button onClick={() => clickear()} className={
              modoEdicion ? 'btn btn-warning mt-3' : 'btn btn-primary mt-3'
            }>
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
              </button>
          </form>
        </div>
        
        
        {/*---------------------------- Lista de tareas --------------------------------------------*/}
        <div className="col-xs-9 col-sm-8 col-md-6 mt-2">
          <h2 className="text-center titulos mb-4">Lista de tareas</h2>
            <div className="list-group lead">
                 {
                   tareas.map((item, index)=>(
                     
                    <a href="#" key={index} className={`list-group-item list-group-item-action ${item.prioridad}`} aria-current="true">
                   <div className="d-flex w-100 justify-content-between">
                     <h5 className="mb-1 mt-2 tituloTarea"><b>{item.tarea}</b></h5> <br />
                     <small className='fecha'>{moment(item.fecha).format('L')}</small>
                   </div>
                   <p className="p-Tarea text-wrap text-break"> {item.descripcion}</p> 
                   <br />
                   <div className="d-flex justify-content-between align-items-center btn-Tarea">
                   <h6><b>Responsable:</b> {item.responsable}</h6>
                   <div className="d-flex float-end">
                   <button onClick={() => eliminar(item.id)}
                              className="btn btn-danger mt-2 me-2 mb-2">
                              Eliminar
                      </button>
                      <button onClick={()=>editarTarea(item)}
                              className="btn btn-warning mt-2 mb-2">
                              Editar
                      </button>
                   </div>
                   
                   </div>
                   
                 </a>
                 ))
                 } 
                  
                 
                </div>   
           <div className="d-grid">
           <button 
            onClick={()=>verMas()}
            disabled={desactivar}
            className="btn btn-primary mt-3">Ver más</button>
           </div>
           
        </div>
        
      </div>
    </div>
  );
}

export default Notas;
