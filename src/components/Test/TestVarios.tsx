// 1. getServerSideProps: Carga de Datos del Servidor

// const AdminNumbers = ({
//     adminNumbers = [],
//     qCountry,
//     qRegion,
//     qPagination = '20',
//   }: AdminNumbersProps) => {
//     const { t } = useTranslation(['common']);  // Traducciones
//     const router = useRouter();  // Manejo de rutas en Next.js
//     const [loading, setLoading] = useState(false);  // Estado de carga
//     const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);  // Números seleccionados
//     const [isDeleteSelected, setIsDeleteSelected] = useState(false);  // Modal de eliminación
//     const [previewUrl, setPreviewUrl] = useState('');  // URL de vista previa de imagen
//     const [base64Image, setBase64Image] = useState('');  // Imagen en base64

//     const isSelectedFull = adminNumbers.length === selectedNumbers.length;  // Verificar si todos están seleccionados

//     // Formulario con filtros y mensajes
//     const [form, setForm] = useState({
//       message: '',
//       locationCountryCode: qCountry.toLowerCase(),
//       locationRegion: qRegion,
//       pageNumber: '1',
//       pagination: qPagination,
//     });

//     // Función para manejar cambios en el formulario
//     const handleInput: HandleInput = (value, name) => {
//       setForm((prevState) => ({
//         ...prevState,
//         ...{ [name]: value },
//       }));
//     };

//     // Función para obtener números de Skokka
//     const fetchSkokka = async () => {
//       try {
//         setLoading(true);
//         const jsonResponse = await mockService.getSkNumbers({
//           locationCountryCode: form.locationCountryCode,
//           locationRegion: form.locationRegion,
//           pageNumber: form.pageNumber,
//         });

//         const allContent = await jsonResponse.json();
//         console.log(allContent);
//         setLoading(false);
//         router.reload();
//       } catch (error) {
//         setLoading(false);
//         console.log(error);
//       }
//     };

//     // Selección de números
//     const handleSelectedNumbers = (id: string) => {
//       if (selectedNumbers.includes(id)) {
//         setSelectedNumbers(selectedNumbers.filter((el) => el !== id));
//       } else {
//         setSelectedNumbers([...selectedNumbers, id]);
//       }
//     };

//     // Enviar todos los mensajes seleccionados
//     const sendAllMessages = async () => {
//       setLoading(true);
//       try {
//         const allRealNumbers = selectedNumbers.map((el) =>
//           adminNumbers.find((adminNumber) => adminNumber.id === el)
//         );

//         await Promise.map(
//           allRealNumbers,
//           async (el, index) => {
//             if (index < selectedNumbers.length - 1) {
//               await delay(3000); // Espera 3 segundos
//             }
//             if (base64Image) {
//               const cleanedBase64 = base64Image.split('base64,')[1];
//               const imageSent = await adminService.sendWaMediaMessageWaapi({
//                 phoneNumber: el.phone,
//                 mediaCaption: form.message,
//                 mediaName: 'imagen.png',
//                 mediaBase64: cleanedBase64,
//               });

//               if (imageSent?.success) {
//                 await firebaseAdminService.updateSkNumber(el.id, {
//                   isContacted: true,
//                 });
//               }
//               return imageSent;
//             }

//             const messagesSent = await adminService.sendWaMessageWaapi({
//               phoneNumber: el.phone,
//               message: form.message,
//             });

//             if (messagesSent?.success) {
//               await firebaseAdminService.updateSkNumber(el.id, {
//                 isContacted: true,
//               });
//             }
//             return messagesSent;
//           },
//           { concurrency: 1 }
//         );

//         setLoading(false);
//         router.reload();
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };

//     // Eliminar los números seleccionados
//     const deleteSelectedNumbers = async () => {
//       try {
//         setLoading(true);
//         await Promise.map(
//           selectedNumbers,
//           async (id) => {
//             return await firebaseAdminService.deleteSkNumber(id);
//           },
//           { concurrency: 1 }
//         );

//         router.reload();
//       } catch (error) {
//         setLoading(false);
//         console.log(error);
//       }
//     };

//     // Actualizar la URL con los filtros aplicados
//     useEffect(() => {
//       if (form.locationCountryCode && form.pagination) {
//         const countryUrl = `/admin/adminNumbers?c=${form.locationCountryCode}`;
//         const regionUrl = form.locationRegion ? `${countryUrl}&r=${form.locationRegion}` : countryUrl;
//         const finalUrl = `${regionUrl}&p=${form.pagination}`;
//         setSelectedNumbers([]);
//         router.replace(finalUrl);
//       }
//     }, [form.locationRegion, form.locationCountryCode, form.pagination]);

//     // Renderizado de la interfaz de usuario
//     return (
//       <>
//         {loading && <CustomLoader loadingText={t('general.loadingText')} />}
//         <div className={'mainContainer'}>
//           <div className="flex flex-1 items-center">
//             <span className="bigLabel">{t('admin.adminNumbers')}</span>
//           </div>
//           <div className="flex justify-end mt-4 space-x-4">
//             <Button onClick={handleSelectAll} className="btn-ghost btn-sm">
//               {isSelectedFull ? (
//                 <span className="text-xs">{t('admin.deSelectAll')}</span>
//               ) : (
//                 <span className="text-xs">{t('admin.selectAll')}</span>
//               )}
//             </Button>
//             <Button
//               disabled={!Boolean(selectedNumbers.length)}
//               onClick={() => setIsDeleteSelected(true)}
//               className="btn-ghost gap-1 text-red btn-sm"
//             >
//               <TrashIcon className="h-4 w-4" />
//               <span className="text-xs">{selectedNumbers.length.toString()}</span>
//             </Button>
//             <div className="flex flex-row space-x-3">
//               <Button
//                 disabled={form.locationRegion === ''}
//                 onClick={() => fetchSkokka()}
//                 className=" gap-1 text-white btn-sm  btn-success"
//               >
//                 <PlusIcon className="h-4 w-4" />
//                 <span>{`Fetch Skokka - ${form.locationCountryCode}`}</span>
//               </Button>
//               <CustomSelect
//                 name="pageNumber"
//                 value={form.pageNumber}
//                 onChange={(el) => handleInput(el.target.value, 'pageNumber')}
//                 className="select-sm"
//               >
//                 {times(20, (numberEl) => (
//                   <option key={numberEl} value={(numberEl + 1).toString()}>
//                     {`${numberEl + 1} Pagina`}
//                   </option>
//                 ))}
//               </CustomSelect>
//             </div>
//           </div>
//           <div className="flex flex-row items-center space-x-2 mt-4">
//             <div>
//               <LocationInput
//                 isPlain
//                 displayAllRegions
//                 handleCountry={(el) =>
//                   handleInput(el.toLowerCase(), 'locationCountryCode')
//                 }
//                 handleChangeRegion={(el) => handleInput(el, 'locationRegion')}
//                 locationRegion={form.locationRegion}
//                 locationCountryCode={form.locationCountryCode}
//               />
//             </div>
//             <div className="flex flex-1 justify-end ">
//               <CustomSelect
//                 name="pagination"
//                 value={form.pagination}
//                 onChange={(el) => handleInput(el.target.value, 'pagination')}
//                 className="select-sm border-none"
//               >
//                 {paginationSteps.map((el) => (
//                   <option key={el} value={el}>
//                     {`${el} mostrar numeros`}
//                   </option>
//                 ))}
//               </CustomSelect>
//             </div>
//           </div>
//           <AdminNumbersTable
//             handleMessageStatus={handleMessageStatus}
//             handleSelectedNumbers={handleSelectedNumbers}
//             adminNumbers={adminNumbers}
//             selectedNumbers={selectedNumbers}
//           />
//         </div>
//         <AdminNumbersTextarea
//           setBase64Image={setBase64Image}
//           handleFileUpload={handleFileUpload}
//           previewUrl={previewUrl}
//           setPreviewUrl={setPreviewUrl}
//           adminNumbers={adminNumbers}
//           sendAllMessages={sendAllMessages}
//           selectedNumbers={selectedNumbers}
//           form={form}
//           handleInput={handleInput}
//         />
//         {isDeleteSelected && (
//           <DeleteModal
//             title={`${'Borrar Numeros?'} - ${selectedNumbers.length}`}
//             handleDelete={deleteSelectedNumbers}
//             onClose={() => setIsDeleteSelected(false)}
//           />
//         )}
//       </>
//     );
//   };

//   export default AdminNumbers;

// ¿Qué hace este bloque?

// Autenticación: Verifica si el usuario es un administrador utilizando Firebase. Si no lo es, lo redirige a la página principal.
// Consulta de la Base de Datos: Dependiendo de los parámetros de la URL, obtiene una lista de números de teléfono filtrados desde Firebase Firestore.
// Paginación y Filtros: Puede filtrar por país, región y limitar la cantidad de números obtenidos.
// Datos para la Página: Los números obtenidos y otros datos se pasan como props al componente de la página.
// 2. AdminNumbers Componente Principal

// const AdminNumbers = ({
//     adminNumbers = [],
//     qCountry,
//     qRegion,
//     qPagination = '20',
//   }: AdminNumbersProps) => {
//     const { t } = useTranslation(['common']);  // Traducciones
//     const router = useRouter();  // Manejo de rutas en Next.js
//     const [loading, setLoading] = useState(false);  // Estado de carga
//     const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);  // Números seleccionados
//     const [isDeleteSelected, setIsDeleteSelected] = useState(false);  // Modal de eliminación
//     const [previewUrl, setPreviewUrl] = useState('');  // URL de vista previa de imagen
//     const [base64Image, setBase64Image] = useState('');  // Imagen en base64

//     const isSelectedFull = adminNumbers.length === selectedNumbers.length;  // Verificar si todos están seleccionados

//     // Formulario con filtros y mensajes
//     const [form, setForm] = useState({
//       message: '',
//       locationCountryCode: qCountry.toLowerCase(),
//       locationRegion: qRegion,
//       pageNumber: '1',
//       pagination: qPagination,
//     });

//     // Función para manejar cambios en el formulario
//     const handleInput: HandleInput = (value, name) => {
//       setForm((prevState) => ({
//         ...prevState,
//         ...{ [name]: value },
//       }));
//     };

//     // Función para obtener números de Skokka
//     const fetchSkokka = async () => {
//       try {
//         setLoading(true);
//         const jsonResponse = await mockService.getSkNumbers({
//           locationCountryCode: form.locationCountryCode,
//           locationRegion: form.locationRegion,
//           pageNumber: form.pageNumber,
//         });

//         const allContent = await jsonResponse.json();
//         console.log(allContent);
//         setLoading(false);
//         router.reload();
//       } catch (error) {
//         setLoading(false);
//         console.log(error);
//       }
//     };

//     // Selección de números
//     const handleSelectedNumbers = (id: string) => {
//       if (selectedNumbers.includes(id)) {
//         setSelectedNumbers(selectedNumbers.filter((el) => el !== id));
//       } else {
//         setSelectedNumbers([...selectedNumbers, id]);
//       }
//     };

//     // Enviar todos los mensajes seleccionados
//     const sendAllMessages = async () => {
//       setLoading(true);
//       try {
//         const allRealNumbers = selectedNumbers.map((el) =>
//           adminNumbers.find((adminNumber) => adminNumber.id === el)
//         );

//         await Promise.map(
//           allRealNumbers,
//           async (el, index) => {
//             if (index < selectedNumbers.length - 1) {
//               await delay(3000); // Espera 3 segundos
//             }
//             if (base64Image) {
//               const cleanedBase64 = base64Image.split('base64,')[1];
//               const imageSent = await adminService.sendWaMediaMessageWaapi({
//                 phoneNumber: el.phone,
//                 mediaCaption: form.message,
//                 mediaName: 'imagen.png',
//                 mediaBase64: cleanedBase64,
//               });

//               if (imageSent?.success) {
//                 await firebaseAdminService.updateSkNumber(el.id, {
//                   isContacted: true,
//                 });
//               }
//               return imageSent;
//             }

//             const messagesSent = await adminService.sendWaMessageWaapi({
//               phoneNumber: el.phone,
//               message: form.message,
//             });

//             if (messagesSent?.success) {
//               await firebaseAdminService.updateSkNumber(el.id, {
//                 isContacted: true,
//               });
//             }
//             return messagesSent;
//           },
//           { concurrency: 1 }
//         );

//         setLoading(false);
//         router.reload();
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };

//     // Eliminar los números seleccionados
//     const deleteSelectedNumbers = async () => {
//       try {
//         setLoading(true);
//         await Promise.map(
//           selectedNumbers,
//           async (id) => {
//             return await firebaseAdminService.deleteSkNumber(id);
//           },
//           { concurrency: 1 }
//         );

//         router.reload();
//       } catch (error) {
//         setLoading(false);
//         console.log(error);
//       }
//     };

//     // Actualizar la URL con los filtros aplicados
//     useEffect(() => {
//       if (form.locationCountryCode && form.pagination) {
//         const countryUrl = `/admin/adminNumbers?c=${form.locationCountryCode}`;
//         const regionUrl = form.locationRegion ? `${countryUrl}&r=${form.locationRegion}` : countryUrl;
//         const finalUrl = `${regionUrl}&p=${form.pagination}`;
//         setSelectedNumbers([]);
//         router.replace(finalUrl);
//       }
//     }, [form.locationRegion, form.locationCountryCode, form.pagination]);

//     // Renderizado de la interfaz de usuario
//     return (
//       <>
//         {loading && <CustomLoader loadingText={t('general.loadingText')} />}
//         <div className={'mainContainer'}>
//           <div className="flex flex-1 items-center">
//             <span className="bigLabel">{t('admin.adminNumbers')}</span>
//           </div>
//           <div className="flex justify-end mt-4 space-x-4">
//             <Button onClick={handleSelectAll} className="btn-ghost btn-sm">
//               {isSelectedFull ? (
//                 <span className="text-xs">{t('admin.deSelectAll')}</span>
//               ) : (
//                 <span className="text-xs">{t('admin.selectAll')}</span>
//               )}
//             </Button>
//             <Button
//               disabled={!Boolean(selectedNumbers.length)}
//               onClick={() => setIsDeleteSelected(true)}
//               className="btn-ghost gap-1 text-red btn-sm"
//             >
//               <TrashIcon className="h-4 w-4" />
//               <span className="text-xs">{selectedNumbers.length.toString()}</span>
//             </Button>
//             <div className="flex flex-row space-x-3">
//               <Button
//                 disabled={form.locationRegion === ''}
//                 onClick={() => fetchSkokka()}
//                 className=" gap-1 text-white btn-sm  btn-success"
//               >
//                 <PlusIcon className="h-4 w-4" />
//                 <span>{`Fetch Skokka - ${form.locationCountryCode}`}</span>
//               </Button>
//               <CustomSelect
//                 name="pageNumber"
//                 value={form.pageNumber}
//                 onChange={(el) => handleInput(el.target.value, 'pageNumber')}
//                 className="select-sm"
//               >
//                 {times(20, (numberEl) => (
//                   <option key={numberEl} value={(numberEl + 1).toString()}>
//                     {`${numberEl + 1} Pagina`}
//                   </option>
//                 ))}
//               </CustomSelect>
//             </div>
//           </div>
//           <div className="flex flex-row items-center space-x-2 mt-4">
//             <div>
//               <LocationInput
//                 isPlain
//                 displayAllRegions
//                 handleCountry={(el) =>
//                   handleInput(el.toLowerCase(), 'locationCountryCode')
//                 }
//                 handleChangeRegion={(el) => handleInput(el, 'locationRegion')}
//                 locationRegion={form.locationRegion}
//                 locationCountryCode={form.locationCountryCode}
//               />
//             </div>
//             <div className="flex flex-1 justify-end ">
//               <CustomSelect
//                 name="pagination"
//                 value={form.pagination}
//                 onChange={(el) => handleInput(el.target.value, 'pagination')}
//                 className="select-sm border-none"
//               >
//                 {paginationSteps.map((el) => (
//                   <option key={el} value={el}>
//                     {`${el} mostrar numeros`}
//                   </option>
//                 ))}
//               </CustomSelect>
//             </div>
//           </div>
//           <AdminNumbersTable
//             handleMessageStatus={handleMessageStatus}
//             handleSelectedNumbers={handleSelectedNumbers}
//             adminNumbers={adminNumbers}
//             selectedNumbers={selectedNumbers}
//           />
//         </div>
//         <AdminNumbersTextarea
//           setBase64Image={setBase64Image}
//           handleFileUpload={handleFileUpload}
//           previewUrl={previewUrl}
//           setPreviewUrl={setPreviewUrl}
//           adminNumbers={adminNumbers}
//           sendAllMessages={sendAllMessages}
//           selectedNumbers={selectedNumbers}
//           form={form}
//           handleInput={handleInput}
//         />
//         {isDeleteSelected && (
//           <DeleteModal
//             title={`${'Borrar Numeros?'} - ${selectedNumbers.length}`}
//             handleDelete={deleteSelectedNumbers}
//             onClose={() => setIsDeleteSelected(false)}
//           />
//         )}
//       </>
//     );
//   };

//   export default AdminNumbers;

// ¿Qué hace este componente?

// Gestión del Estado: Controla el estado de la carga (loading), números seleccionados, formularios, y más.
// Selección y Envío de Mensajes: Permite seleccionar números y enviarles mensajes o imágenes a través de la API de WhatsApp.
// Interacción con la Base de Datos: Usa firebaseAdminService para actualizar y eliminar registros en Firestore.
// Interfaz de Usuario (UI): Renderiza tablas y controles de selección, con botones para ejecutar acciones como enviar mensajes o eliminar números.
// 3. Componentes y Servicios Auxiliares
// Este componente hace uso de varios servicios y componentes auxiliares:

// firebaseAdminService: Un servicio para interactuar con Firebase Admin SDK.
// mockService: Un servicio para obtener números simulados de una API.
// AdminNumbersTable, AdminNumbersTextarea, CustomLoader, DeleteModal, etc.: Componentes que encapsulan partes específicas de la UI.
// Resumen General
// Este código es una página de administración que permite a los usuarios enviar mensajes de WhatsApp a una lista de números telefónicos almacenados en Firebase Firestore.
// Utiliza la autenticación de Firebase para asegurarse de que solo los administradores puedan acceder a esta página. Además, permite a los usuarios filtrar números, seleccionarlos en masa,
// enviar mensajes o imágenes, y eliminar números de la base de datos.
