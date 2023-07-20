// import React, { useEffect, useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useSelector } from 'react-redux';
// import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { storage_bucket } from './firebase';

// const initialValues = {
//     forms: [
//         // { name: '', email: '', selectField: '', media: [] },
//         {
//             processTitle: "",
//             description: "",
//             startDate: "2023-07-19T15:53:37.464Z",
//             endDate: "2023-07-19T15:53:37.464Z",
//             activityId: "1234",
//             processTypeId: "",
//             isKeyProcess: true,
//             processNo: 0,
//             media: []
//         }
//     ],
// };


// const validationSchema = Yup.object().shape({
//     forms: Yup.array().of(
//         Yup.object().shape({
//             // name: Yup.string().required('Name is required'),
//             // email: Yup.string().email('Invalid email').required('Email is required'),
//         })
//     ),
// });

// const MultiForm = () => {
//     const [currentForm, setCurrentForm] = useState(0);
//     const [formData, setFormData] = useState(initialValues.forms);

//     const handleNext = () => {
//         if (currentForm < formData.length - 1) {
//             setCurrentForm((prevForm) => prevForm + 1);
//         }
//     };

//     const handlePrevious = () => {
//         if (currentForm > 0) {
//             setCurrentForm((prevForm) => prevForm - 1);
//         }
//     };

//     const handleCreateNewForm = () => {
//         setFormData((prevData) => [...prevData, {
//             processTitle: "",
//             description: "",
//             startDate: "2023-07-19T15:53:37.464Z",
//             endDate: "2023-07-19T15:53:37.464Z",
//             activityId: "",
//             processTypeId: "",
//             isKeyProcess: true,
//             processNo: 0,
//             media: []
//         }]);
//         setCurrentForm((prevForm) => prevForm + 1);
//     };

//     const [arrDelete, setArrDelete] = useState([0]);

//     useEffect(() => {
//         console.log(arrDelete);
//     }, [arrDelete]);
//     const handleDeleteForm = () => {
//         if (formData.length > 1) {
//             setCurrentForm((prevForm) => (prevForm > 0 ? prevForm - 1 : 0));
//             setFormData((prevData) => prevData.filter((form, index) => index !== currentForm));
//             console.log(currentForm);
//             setArrDelete((prevArr) => [...prevArr, currentForm]);
//             console.log(formData);
//             // handleButtonClick2()

//         }
//     };

//     const handleSelectChange = (event, formIndex) => {
//         const { value } = event.target;
//         setFormData((prevData) =>
//             prevData.map((form, index) =>
//                 index === formIndex ? { ...form, processTypeId: value } : form
//             )
//         );
//     };;
//     const handleSubmit1 = async (values) => {
//         const dataToSubmit = [...values.forms];
//         console.log(dataToSubmit);
//         await dataToSubmit.forEach((form, index) => {
//             formData[index].processTitle = form.processTitle;
//             formData[index].description = form.description;
//             formData[index].processNo = index;
//         });
//         console.log(formData);
//         const filteredData = formData.filter((item) => !arrDelete.includes(item.processNo));
//         console.log(filteredData);
//     }

//     const [isLoading1, setIsLoading1] = useState(false);


//     const handleImageChange1 = async (e, formIndex) => {
//         setIsLoading1(true);
//         const fileList = e.target.files;
//         const newImages = [];

//         for (let i = 0;i < fileList.length;i++) {
//             const file = fileList[i];
//             const imageUrl = URL.createObjectURL(file);
//             newImages.push({ linkMedia: imageUrl, type: file.type });

//             try {
//                 const fileRef = ref(storage_bucket, file.name);
//                 const uploadTask = uploadBytesResumable(fileRef, file);

//                 uploadTask.on('state_changed', (snapshot) => {
//                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                     // setUploadProgress(progress);
//                 });

//                 const snapshot = await uploadTask;

//                 if (snapshot.state === 'success') {
//                     const downloadURL = await getDownloadURL(snapshot.ref);
//                     newImages[i].linkMedia = downloadURL; // Cập nhật link downloadURL vào mảng newImages
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         setFormData((prevData) =>
//             prevData.map((form, index) =>
//                 index === formIndex ? { ...form, media: [...form.media, ...newImages] } : form
//             )
//         );

//         setIsLoading1(false);
//         // setUploadProgress(0);
//     };

//     return (
//         <div>
//             <div className="multi-form">
//                 <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit1}>
//                     <Form>
//                         <div className="form">
//                             {formData.map((form, index) => (
//                                 <div key={index} className={`form-group  hidden`} style={{ display: index === 0 ? 'none' : 'block' }}>
//                                     <h3>Form {index}</h3>
//                                     <div className="form-group">
//                                         <label htmlFor={`processTitle_${index}`}>Title</label>
//                                         <Field type="text" name={`forms[${index}].processTitle`} className="form-control" />

//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor={`description_${index}`}>Description</label>
//                                         <Field type="text" name={`forms[${index}].description`} className="form-control" />

//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor={`processTypeId_${index}`}>processTypeId</label>
//                                         <select
//                                             name={`forms[${index}].processTypeId`}
//                                             value={form.processTypeId} // Bind the select value to the formData value
//                                             onChange={(e) => handleSelectChange(e, index)} // Pass the formIndex to handleSelectChange
//                                             className="form-control"
//                                         >
//                                             <option value="">Select an option</option>
//                                             <option value="1">Option 1</option>
//                                             <option value="2">Option 2</option>
//                                             <option value="3">Option 3</option>
//                                         </select>
//                                     </div>
//                                     <div className="form-group">

//                                         <Field type="text" hidden name={`forms[${index}].processNo`} value={index + 1} className="form-control" />

//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor={`media_${index}`}>Media</label>
//                                         <div>
//                                             <Field
//                                                 name={`forms[${index}].media`}
//                                                 id={`media_${index}`}
//                                                 type="file"
//                                                 multiple
//                                                 onChange={(e) => handleImageChange1(e, index)} // Truyền formIndex khi xử lý handleImageChange1
//                                             />
//                                             <div className="image-container">
//                                                 {form.media.map((image, imageIndex) => (
//                                                     <div className="image-item" key={imageIndex}>
//                                                         <img src={image.linkMedia} alt={`Image ${imageIndex}`} className="image-preview" />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {index === currentForm && (
//                                         <div className="form-buttons">
//                                             {index > 0 && (
//                                                 <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
//                                                     Previous
//                                                 </button>
//                                             )}
//                                             {index < formData.length - 1 && (
//                                                 <button type="button" className="btn btn-primary" onClick={handleNext}>
//                                                     Next
//                                                 </button>
//                                             )}
//                                             {index > 0 && (
//                                                 <button type="button" className="btn btn-danger delete" onClick={handleDeleteForm}>
//                                                     Delete
//                                                 </button>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         {currentForm === formData.length - 1 && (
//                             <div className="form-buttons">
//                                 <button type="button" className="btn btn-primary" onClick={handleCreateNewForm}>
//                                     Create New Form
//                                 </button>
//                                 {currentForm >= 1 && (
//                                     <button type="submit" className="btn btn-success">
//                                         Submit
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </Form>
//                 </Formik>
//             </div>
//         </div>
//     );
// };

// export default MultiForm;




// import React from 'react'

// export default function MultiForm () {
//     return (
//         <div className="post-new-popup1" style={popupStyle}>
//             <div className="popup" style={{ width: 800, marginTop: '100px', zIndex: 80 }}>
//                 <span className="popup-closed" onClick={handleClick}><i className="icofont-close" /></span>
//                 <div className="popup-meta">
//                     <div className="popup-head">
//                         <h5><i>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
//                                 <line x1={12} y1={5} x2={12} y2={19} />
//                                 <line x1={5} y1={12} x2={19} y2={12} />
//                             </svg></i>Tạo Chiến Dịch</h5>
//                     </div>
//                 </div>
//                 <div className="multi-form">
//                     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit1}>
//                         <Form>
//                             <div className="form">
//                                 {formData.map((form, index) => (
//                                     <div key={index} className={`form-group  hidden`} style={{ display: index === 0 ? 'none' : 'block' }}>
//                                         <h3>Form {index}</h3>
//                                         <div className="form-group">
//                                             <label htmlFor={`processTitle_${index}`}>Title</label>
//                                             <Field type="text" name={`forms[${index}].processTitle`} className="form-control" />

//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor={`description_${index}`}>Description</label>
//                                             <Field type="text" name={`forms[${index}].description`} className="form-control" />

//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor={`processTypeId_${index}`}>processTypeId</label>
//                                             <select
//                                                 name={`forms[${index}].processTypeId`}
//                                                 value={form.processTypeId} // Bind the select value to the formData value
//                                                 onChange={(e) => handleSelectChange(e, index)} // Pass the formIndex to handleSelectChange
//                                                 className="form-control"
//                                             >
//                                                 <option value="">Select an option</option>
//                                                 <option value="1">Option 1</option>
//                                                 <option value="2">Option 2</option>
//                                                 <option value="3">Option 3</option>
//                                             </select>
//                                         </div>
//                                         <div className="form-group">

//                                             <Field type="text" hidden name={`forms[${index}].processNo`} value={index + 1} className="form-control" />

//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor={`media_${index}`}>Media</label>
//                                             <div>
//                                                 <Field
//                                                     name={`forms[${index}].media`}
//                                                     id={`media_${index}`}
//                                                     type="file"
//                                                     multiple
//                                                     onChange={(e) => handleImageChange1(e, index)} // Truyền formIndex khi xử lý handleImageChange1
//                                                 />
//                                                 <div className="image-container">
//                                                     {form.media.map((image, imageIndex) => (
//                                                         <div className="image-item" key={imageIndex}>
//                                                             <img src={image.linkMedia} alt={`Image ${imageIndex}`} className="image-preview" />
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {index === currentForm && (
//                                             <div className="form-buttons">
//                                                 {index > 0 && (
//                                                     <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
//                                                         Previous
//                                                     </button>
//                                                 )}
//                                                 {index < formData.length - 1 && (
//                                                     <button type="button" className="btn btn-primary" onClick={handleNext}>
//                                                         Next
//                                                     </button>
//                                                 )}
//                                                 {index > 0 && (
//                                                     <button type="button" className="btn btn-danger delete" onClick={handleDeleteForm}>
//                                                         Delete
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                             {currentForm === formData.length - 1 && (
//                                 <div className="form-buttons">
//                                     <button type="button" className="btn btn-primary" onClick={handleCreateNewForm}>
//                                         Create New Form
//                                     </button>
//                                     {currentForm >= 1 && (
//                                         <button type="submit" className="btn btn-success">
//                                             Submit
//                                         </button>
//                                     )}
//                                 </div>
//                             )}
//                         </Form>
//                     </Formik>
//                 </div>
//             </div>
//         </div>

//     )
// }
