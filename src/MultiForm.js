import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage_bucket } from './firebase';

const initialValues = {
    forms: [
        // { name: '', email: '', selectField: '', media: [] },
        {
            processTitle: "",
            description: "",
            startDate: "2023-07-19T15:53:37.464Z",
            endDate: "2023-07-19T15:53:37.464Z",
            activityId: "1234",
            processTypeId: "",
            isKeyProcess: true,
            processNo: 0,
            media: []
        }
    ],
};


const validationSchema = Yup.object().shape({
    forms: Yup.array().of(
        Yup.object().shape({
            // name: Yup.string().required('Name is required'),
            // email: Yup.string().email('Invalid email').required('Email is required'),
        })
    ),
});

const MultiForm = () => {
    const [number, setNumber] = useState(0);
    const [num, setNum] = useState(0);
    const handleButtonClick1 = () => {
        setNumber(1);
    };

    const handleButtonClick2 = () => {
        setNumber(2);
    };
    console.log("number" + number);
    const [currentForm, setCurrentForm] = useState(0);
    const [formData, setFormData] = useState(initialValues.forms);

    const handleNext = () => {
        if (currentForm < formData.length - 1) {
            setCurrentForm((prevForm) => prevForm + 1);
        }
    };

    const handlePrevious = () => {
        if (currentForm > 0) {
            setCurrentForm((prevForm) => prevForm - 1);
        }
    };

    const handleCreateNewForm = () => {
        // const newIndex = formData.length;
        // setNum((prevNum) => prevNum + 1);

        setFormData((prevData) => [...prevData, {
            processTitle: "",
            description: "",
            startDate: "2023-07-19T15:53:37.464Z",
            endDate: "2023-07-19T15:53:37.464Z",
            activityId: "",
            processTypeId: "",
            isKeyProcess: true,
            processNo: 0,
            media: []
        }]);
        setCurrentForm((prevForm) => prevForm + 1);
    };

    const handleDeleteForm = () => {
        if (formData.length > 1) {
            setCurrentForm((prevForm) => (prevForm > 0 ? prevForm - 1 : 0));
            setFormData((prevData) => prevData.filter((form, index) => index !== currentForm));
            console.log(currentForm);
            console.log(formData);
            handleButtonClick2()

        }
    };
    // const update =async ()=>{
    //     const dataToSubmit = [...values.forms];
    //     console.log(dataToSubmit);
    //     await dataToSubmit.forEach((form, index) => {
    //         console.log(`Form ${index + 1} - Name: ${form.name}`);
    //         formData[index].name = form.name;
    //         formData[index].email = form.email;
    //     });
    //     console.log(formData);
    //     handleButtonClick1()
    // }

    const handleSelectChange = (event, formIndex) => {
        const { value } = event.target;
        console.log(value);
        // Update the selectField value in formData at the specified formIndex
        setFormData((prevData) =>
            prevData.map((form, index) =>
                index === formIndex ? { ...form, selectField: value } : form
            )
        );
    };

    console.log(formData);
    const handleSubmit = async (values) => {
        const dataToSubmit = [...values.forms];
        console.log(dataToSubmit);
        await dataToSubmit.forEach((form, index) => {
            // console.log(`Form ${index + 1} - Name: ${form.name}`);
            formData[index].processTitle = form.processTitle;
            formData[index].description = form.description;
            formData[index].processTypeId = form.processTypeId;
            formData[index].processNo = index + 1;
        });
        console.log(formData);
        handleButtonClick1()
    }








    const [isOpen, setIsOpen] = useState(true);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleClick = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    const popupStyle = {
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        overflow: isOpen ? "auto" : "hidden"
    };

    const { configActivity, isValidCreate, isFanpage } = useSelector(root => root.ConfigActivityReducer);
    const [isTextInputVisible, setTextInputVisible] = useState(false);

    const toggleTextInput = () => {
        setTextInputVisible(!isTextInputVisible);
    };

    const handleImageChange = async (e, formIndex) => {
        setIsLoading(true);
        const fileList = e.target.files;
        const newImages = [];

        for (let i = 0;i < fileList.length;i++) {
            const file = fileList[i];
            const imageUrl = URL.createObjectURL(file);
            newImages.push({ linkMedia: imageUrl, type: file.type });

            try {
                const fileRef = ref(storage_bucket, file.name);
                const uploadTask = uploadBytesResumable(fileRef, file);

                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                const snapshot = await uploadTask;

                if (snapshot.state === 'success') {
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    newImages[i].linkMedia = downloadURL; // Cập nhật link downloadURL vào mảng newImages
                }
            } catch (error) {
                console.log(error);
            }
        }

        // Cập nhật mảng media của form tại vị trí formIndex
        setFormData((prevData) =>
            prevData.map((form, index) =>
                index === formIndex ? { ...form, media: [...form.media, ...newImages] } : form
            )
        );

        setIsLoading(false);
        setUploadProgress(0);
    };

    console.log(formData); // Log mảng media của từng form

    return (
        <div>
            <div className="multi-form">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form>
                        <div className="form">
                            {formData.map((form, index) => (
                                <div key={index} className={`form-group ${index === currentForm ? '' : 'hidden'}`}>
                                    <h3>Form {index + 1}</h3>
                                    <div className="form-group">
                                        <label htmlFor={`processTitle_${index}`}>Title</label>
                                        <Field type="text" name={`forms[${index}].processTitle`} className="form-control" />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`description_${index}`}>Description</label>
                                        <Field type="text" name={`forms[${index}].description`} className="form-control" />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`processTypeId_${index}`}>processTypeId</label>
                                        <select
                                            name={`forms[${index}].processTypeId`}
                                            value={form.processTypeId} // Bind the select value to the formData value
                                            onChange={(e) => handleSelectChange(e, index)} // Pass the formIndex to handleSelectChange
                                            className="form-control"
                                        >
                                            <option value="">Select an option</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                        </select>
                                    </div>
                                    <div className="form-group">

                                        <Field type="text" hidden name={`forms[${index}].processNo`} value={index + 1} className="form-control" />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`media_${index}`}>Media</label>
                                        <div>
                                            <Field
                                                name={`forms[${index}].media`}
                                                id={`media_${index}`}
                                                type="file"
                                                multiple
                                                onChange={(e) => handleImageChange(e, index)} // Truyền formIndex khi xử lý handleImageChange
                                            />
                                            <div className="image-container">
                                                {form.media.map((image, imageIndex) => (
                                                    <div className="image-item" key={imageIndex}>
                                                        <img src={image.linkMedia} alt={`Image ${imageIndex}`} className="image-preview" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {index === currentForm && (
                                        <div className="form-buttons">
                                            {index > 0 && (
                                                <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                                                    Previous
                                                </button>
                                            )}
                                            {index < formData.length - 1 && (
                                                <button type="button" className="btn btn-primary" onClick={handleNext}>
                                                    Next
                                                </button>
                                            )}
                                            {index > 0 && (
                                                <button type="button" className="btn btn-danger delete" onClick={handleDeleteForm}>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {currentForm === formData.length - 1 && (
                            <div className="form-buttons">
                                <button type="button" className="btn btn-primary" onClick={handleCreateNewForm}>
                                    Create New Form
                                </button>
                                {currentForm >= 0 && (
                                    <button type="submit" className="btn btn-success">
                                        Submit
                                    </button>
                                )}
                            </div>
                        )}
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default MultiForm;