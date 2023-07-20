import React, { useState } from 'react';
import { Form, Formik } from 'formik';

const initialValues = {
    forms: [
        { name: '', email: '', selectField: '', media: [] },

    ],
};

export default function MultiStepForm1 () {
    const [currentForm, setCurrentForm] = useState(0);
    const [selectValue, setSelectValue] = useState('');

    const handleSubmit = async (values) => {
        console.log(selectValue);
        // Update the selectField value for the current form
        const updatedForms = [...values.forms];
        updatedForms[currentForm].selectField = selectValue;

        // Submit form with the updated form data
        console.log('Submitted form data:');
        console.log(updatedForms);
    };
    console.log(selectValue);
    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values }) => (
                <Form>
                    <div className="form">
                        {values.forms.map((form, index) => (
                            <div key={index} className={`form-group ${index === currentForm ? '' : 'hidden'}`}>
                                <h3>Form {index}</h3>
                                <div className="form-group">
                                    <label htmlFor={`name_${index}`}>Name</label>
                                    <input type="text" name={`forms[${index}].name`} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`email_${index}`}>Email</label>
                                    <input type="text" name={`forms[${index}].email`} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`selectField_${index}`}>Select Option</label>
                                    <select
                                        name={`forms[${index}].selectField`}
                                        className="form-control"
                                        value={selectValue} // Use the selected value from state
                                        onChange={(e) => setSelectValue(e.target.value)}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    {currentForm === values.forms.length - 1 && (
                        <div className="form-buttons">
                            {currentForm > 0 && (
                                <button type="button" className="btn btn-secondary" onClick={() => setCurrentForm((prevForm) => prevForm - 1)}>
                                    Previous
                                </button>
                            )}
                            {currentForm < values.forms.length - 1 && (
                                <button type="button" className="btn btn-primary" onClick={() => setCurrentForm((prevForm) => prevForm + 1)}>
                                    Next
                                </button>
                            )}
                            {currentForm > 0 && (
                                <button type="button" className="btn btn-danger delete" onClick={() => {
                                    values.forms.splice(currentForm, 1);
                                    setCurrentForm((prevForm) => prevForm - 1);
                                }}>
                                    Delete
                                </button>
                            )}
                            <button type="submit" className="btn btn-success">
                                Submit
                            </button>
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
}