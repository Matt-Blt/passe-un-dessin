import React, { useEffect } from 'react';

import { FormikProps, Field } from 'formik';
import { OutsideProps, FormValues } from './ClassicLoginForm.form';
import TextInput from 'components/TextInput';
import { StyledLabel, StyledForm, StyledButton } from './ClassicLoginForm.style';
import { useIntl } from 'react-intl';
import { AUTH_ERROR_INVALID_USERNAME_PASSWORD } from 'redux/Player/hooks';

const ClassicLoginFormView: React.FC<OutsideProps & FormikProps<FormValues>> = ({
  touched,
  errors,
  isValid,
  isSubmitting,
  setErrors,
  login,
}) => {
  const intl = useIntl();
  const [{ loading, error: outsideError }] = login;

  useEffect(() => {
    if (outsideError && outsideError.message === AUTH_ERROR_INVALID_USERNAME_PASSWORD) {
      setErrors({
        email: 'Invalid email or password combination',
        password: 'Invalid email or password combination',
      });
    }
  }, [outsideError, setErrors]);

  return (
    <StyledForm>
      <StyledLabel htmlFor="email">Adresse email</StyledLabel>
      <Field
        type="email"
        name="email"
        autoComplete="email"
        as={TextInput}
        hasError={touched.email && errors.email}
        placeholder={intl.formatMessage({ id: 'mobileGate.emailExample' })}
      />
      <StyledLabel htmlFor="password">Mot de passe</StyledLabel>
      <Field
        type="password"
        name="password"
        autoComplete="current-password"
        as={TextInput}
        hasError={touched.password && errors.password}
      />
      <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
        Créer un compte
      </StyledButton>
    </StyledForm>
  );
};

export default ClassicLoginFormView;
