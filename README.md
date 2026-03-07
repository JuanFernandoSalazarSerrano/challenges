PARCIAL 1
La clínica privada "MediCare+" necesita modernizar su sistema de gestión de pacientes y turnos. Se desarrollarán dos productos: una PWA para el personal administrativo de escritorio, y una app móvil en Ionic para los médicos que hacen visitas a domicilio. Ninguna tiene backend real: toda la información se almacena en localStorage y la autenticación es simulada con usuarios fijos.

https://69aca0e8d40eff43b2fb42b4--benevolent-sfogliatella-9ec976.netlify.app/

EJERCICIO 1 — PWA: MediCare+ Administración Web
Desarrollá una Progressive Web App en React orientada al personal administrativo de la clínica. Permite gestionar pacientes, asignarles turnos y armar un resumen de atención diaria

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/cf54d445-659b-439a-8e7e-d0f72731c82d" />
<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/01cd936c-6285-4d80-9c58-8cb97fc6245c" />
<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/f05c2d0d-89c2-482d-bd8e-21c569ae3ca4" />
<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/e4956138-5016-479f-95f2-64a08d49bd31" />

Respuestas preguntas ejercicio 1:
por qué el estado de búsqueda vive en Dashboard y no en TablaPacientes?
El estado de búsqueda vive en Dashboard porque este componente es el que administra la lista completa de pacientes y actúa como contenedor de los componentes relacionados con su visualización. Al mantener el estado en el componente padre se puede aplicar el filtro sobre el array de pacientes antes de enviarlo como prop a TablaPacientes. De esta forma TablaPacientes se mantiene como un componente presentacional cuyo único objetivo es renderizar la información recibida. Además, centralizar el estado en Dashboard sigue el principio de una única fuente de verdad (single source of truth), facilita el mantenimiento del código y evita duplicar lógica de filtrado dentro de componentes hijos.

Qué significa la estrategia “cache first” y cuándo conviene usarla en una app médica?
La estrategia cache first en un Service Worker consiste en que la aplicación intenta obtener primero los recursos desde la caché del navegador antes de realizar una solicitud a la red. Si el recurso ya está almacenado en la caché, se devuelve inmediatamente, lo que reduce el tiempo de carga y permite que la aplicación funcione incluso con conexión limitada o sin conexión. Si el recurso no está en la caché, entonces se realiza la petición a la red y posteriormente se guarda para futuras solicitudes. En una aplicación médica esta estrategia es útil principalmente para recursos estáticos de la interfaz, como archivos JavaScript, CSS, íconos o imágenes, ya que mejora la velocidad y confiabilidad de la aplicación. Sin embargo, no es recomendable para datos clínicos o información dinámica de pacientes, ya que esos datos deben mantenerse actualizados y podrían requerir estrategias que prioricen la red para evitar mostrar información desactualizada.
