import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const FormStep = ({ step, totalSteps, prevStep, nextStep, isActive }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
    });

    return (
        <Formik
            initialValues={{ name: '', email: '' }}
            validationSchema={validationSchema}
            onSubmit={() => nextStep()}
        >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
                <Form className={`form-step ${isActive ? 'active' : ''}`}>
                    <h3>Step {step}</h3>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <Field type="text" name="name" className="form-control" />
                        <ErrorMessage name="name" component="div" className="text-danger" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Field type="email" name="email" className="form-control" />
                        <ErrorMessage name="email" component="div" className="text-danger" />
                    </div>
                    <div className="btn-group">
                        {step > 1 && (
                            <button type="button" className="btn btn-secondary" onClick={() => prevStep()}>
                                Previous
                            </button>
                        )}
                        {step < totalSteps && (
                            <button type="submit" className="btn btn-primary">
                                Next
                            </button>
                        )}
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default FormStep;