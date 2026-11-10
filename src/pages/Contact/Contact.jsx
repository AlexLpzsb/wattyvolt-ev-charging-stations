import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Contact.css";

export const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Datos de contacto:", data);
    alert("¡Mensaje enviado con éxito! Watty te responderá a la velocidad del rayo ⚡");
    reset(); 
  };

  return (
    <div className="contact-wrapper">
      <div className="glass-card">
        <div className="logo-container">
          <img src={logo} alt="WattyVolt" className="brand-logo" />
        </div>
        
        <h2>Contacta con nosotros</h2>
        <p>Escríbenos si tienes problemas con un cargador o sugerencias para la app</p>

        <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
          
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nombre" 
              {...register("nombre", { required: "El nombre es obligatorio" })} 
            />
            {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
          </div>

          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo no válida"
                }
              })} 
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <select {...register("asunto", { required: "Selecciona un asunto" })}>
              <option value="">Selecciona un motivo</option>
              <option value="error_cargador">Reportar error en un cargador</option>
              <option value="sugerencia">Sugerencia para la aplicación</option>
              <option value="soporte">Soporte técnico</option>
              <option value="otros">Otros</option>
            </select>
            {errors.asunto && <span className="error-message">{errors.asunto.message}</span>}
          </div>

          <div className="input-group">
            <textarea 
              placeholder="Explícanos con detalle" 
              {...register("mensaje", { 
                required: "No olvides escribir tu mensaje",
                minLength: { value: 10, message: "El mensaje debe ser más largo" }
              })} 
            />
            {errors.mensaje && <span className="error-message">{errors.mensaje.message}</span>}
          </div>

          <button type="submit" className="submit-btn">Enviar mensaje</button>
        </form>

        <Link to="/" className="back-link">
          ⬅ Volver al mapa
        </Link>
      </div>
    </div>
  );
};