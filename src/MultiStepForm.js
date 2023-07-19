// import React, { useState } from 'react';
// import { useFormik } from 'formik';

// const FormStep = ({ formik }) => (
//   <>
//     <div className="row">
//       <div className="col-md-6">
//         <div className="form-group">
//           <label id="name-label" htmlFor="name">
//             Tên Sự Kiện
//           </label>
//           <input
//             type="text"
//             name="title"
//             onChange={formik.handleChange}
//             value={formik.values.title}
//             id="name"
//             placeholder="Nhập Tên Sự Kiện"
//             className="form-control"
//             required
//           />
//         </div>
//       </div>
//       <div className="col-md-6">
//         <div className="form-group">
//           <label id="email-label" htmlFor="email">
//             Mô Tả Sự Kiện
//           </label>
//           <input
//             type="text"
//             name="description"
//             onChange={formik.handleChange}
//             value={formik.values.description}
//             id="email"
//             placeholder="Nhập Tô Tả"
//             className="form-control"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* More form fields go here */}
//     <div className="row">
//       <div className="col-md-12">
//         {/* Image upload section */}
//       </div>
//     </div>
//   </>
// );

// const MultiStepForm = () => {
//   const [forms, setForms] = useState([{}]);

//   const handleFormSubmit = (values, formIndex) => {
//     setForms((prevForms) => {
//       const updatedForms = [...prevForms];
//       updatedForms[formIndex] = values;
//       return updatedForms;
//     });
//   };

//   const handleNewForm = () => {
//     setForms((prevForms) => [...prevForms, {}]);
//   };

//   return (
//     <div>
//       {forms.map((form, index) => (
//         <div key={index} className="form-wrap">
//           <h2>Form {index + 1}</h2>
//           <form onSubmit={formik.handleSubmit}>
//             <FormStep formik={useFormik({ initialValues: form, onSubmit: (values) => handleFormSubmit(values, index) })} />
//             <button type="submit">Hoàn Thành</button>
//           </form>
//         </div>
//       ))}
//       <button type="button" onClick={handleNewForm}>
//         New Form
//       </button>
//     </div>
//   );
// };

// export default MultiStepForm;