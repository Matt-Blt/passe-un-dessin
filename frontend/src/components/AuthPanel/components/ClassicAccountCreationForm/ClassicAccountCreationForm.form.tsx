import React from 'react';
import { withFormik, FormikErrors } from 'formik';
import { isValidEmail } from 'services/utils';
import { AsyncFnReturn } from 'react-use/lib/useAsync';
import { FnReturningPromise } from 'react-use/lib/util';
import { useCreateAccount } from 'redux/Player/hooks';
import InnerForm from './ClassicAccountCreationForm';

interface OutsideProps {
  onAccountCreated?: () => void;
}

export type FormOutsideProps = OutsideProps & {
  createAccount: AsyncFnReturn<FnReturningPromise>;
};
// Shape of form values
export interface FormValues {
  email: string;
  password: string;
}

const ClassicAccountCreationForm = withFormik<FormOutsideProps, FormValues>({
  mapPropsToValues: () => {
    return {
      email: '',
      password: '',
    };
  },
  mapPropsToErrors: () => {
    return {
      email: 'auth.errors.required',
      password: 'auth.errors.required',
    };
  },
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.email) {
      errors.email = 'auth.errors.required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'auth.errors.invalidEmail';
    }
    if (!values.password) {
      errors.password = 'auth.errors.required';
    }
    return errors;
  },
  validateOnChange: true,

  handleSubmit: async (values, { props, setSubmitting }) => {
    const [, doCreateAccount] = props.createAccount;
    await doCreateAccount({ email: values.email, password: values.password });
    setSubmitting(false);
    if (props.onAccountCreated) {
      props.onAccountCreated();
    }
  },
})(InnerForm);

const OuterClassicAccountCreationForm: React.FC<OutsideProps> = ({ onAccountCreated }) => {
  const createAccount = useCreateAccount();

  return (
    <ClassicAccountCreationForm onAccountCreated={onAccountCreated} createAccount={createAccount} />
  );
};

export default OuterClassicAccountCreationForm;
