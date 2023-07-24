import React, { useEffect, useState } from 'react';
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
            startDate: "",
            endDate: "",
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
        setFormData((prevData) => [...prevData, {
            processTitle: "",
            description: "",
            startDate: "",
            endDate: "",
            activityId: "1234",
            processTypeId: "",
            isKeyProcess: true,
            processNo: 0,
            media: []
        }]);
        setCurrentForm((prevForm) => prevForm + 1);
    };

    const [arrDelete, setArrDelete] = useState([0]);

    useEffect(() => {
        console.log(arrDelete);
        console.log(formData);
    }, [arrDelete, formData]);
    const handleDeleteForm = () => {
        if (formData.length > 1) {
            setCurrentForm((prevForm) => (prevForm > 0 ? prevForm - 1 : 0));
            setFormData((prevData) => prevData.filter((form, index) => index !== currentForm));
            console.log(currentForm);
            setArrDelete((prevArr) => [...prevArr, currentForm]);
            console.log(formData);
            // handleButtonClick2()

        }
    };
    const handleSubmit1 = async (values) => {
        const dataToSubmit = [...values.forms];
        console.log(dataToSubmit);
        await dataToSubmit.forEach((form, index) => {
            formData[index].processTitle = form.processTitle;
            formData[index].description = form.description;
            formData[index].startDate = form.startDate;
            formData[index].endDate = form.endDate;
            formData[index].processNo = index;
        });
        console.log(formData);
        const filteredData = formData.filter((item) => !arrDelete.includes(item.processNo));
        console.log(filteredData);
        // const arr = [1, 2, 3, 4, 5];
        // const newDataToSubmit = filteredData.map((form, index) => {
        //     return {
        //         ...form,
        //         // index: arr[index],
        //     };
        // });

        // console.log(newDataToSubmit);
        // const filteredData1 = newDataToSubmit.filter((item) => !arrDelete.includes(item.index));
        // console.log(filteredData1);
        const data = [];
        data.push(filteredData)
        console.log(data);

    }

    const handleSelectChange = (event, formIndex) => {
        const { value } = event.target;
        setFormData((prevData) =>
            prevData.map((form, index) =>
                index === formIndex ? { ...form, processTypeId: value } : form
            )
        );
    };;


    const [isLoading1, setIsLoading1] = useState(false);


    const handleImageChange1 = async (e, formIndex) => {
        setIsLoading1(true);
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
                    // setUploadProgress(progress);
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
        setFormData((prevData) =>
            prevData.map((form, index) =>
                index === formIndex ? { ...form, media: [...form.media, ...newImages] } : form
            )
        );

        setIsLoading1(false);
        // setUploadProgress(0);
    };

    return (
        <div>
            <div className="multi-form">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit1}>
                    <Form>
                        <div className="form">
                            {formData.map((form, index) => (
                                <div key={index} className={`form-group  hidden`} style={{ display: index === 0 ? 'none' : 'block' }}>
                                    <h3>Form {index}</h3>
                                    <div className="form-group">
                                        <label htmlFor={`processTitle_${index}`}>Title</label>
                                        <Field type="text" name={`forms[${index}].processTitle`} className="form-control" />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`description_${index}`}>Description</label>
                                        <Field type="text" name={`forms[${index}].description`} className="form-control" />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`startDate_${index}`}>StartDate</label>
                                        <Field type="datetime-local" name={`forms[${index}].startDate`} className="form-control" />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`endDate_${index}`}>EndDate</label>
                                        <Field type="datetime-local" name={`forms[${index}].endDate`} className="form-control" />

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
                                                onChange={(e) => handleImageChange1(e, index)} // Truyền formIndex khi xử lý handleImageChange1
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
                                {currentForm >= 1 && (
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



