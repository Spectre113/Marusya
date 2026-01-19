import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './Layout';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';
import { Modal } from '../Modal/Modal';
import { LogIn } from '../LogForm/Login';
import { RegisterForm } from '../RegisterForm/RegisterForm';
import { Mail, Name, Password, Surname } from '../Input/InputsSvg';

interface AppLayoutProps {
  children: ReactNode;
  headerLinks: Array<{ path: string; value: string; current: boolean }>;
  footerLinks: Array<{ path: string; variant: 'footer'; imagePath: ReactNode }>;
}

export const AppLayout = ({ children, headerLinks, footerLinks }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userName,
    modalType,
    setModalType,
    email,
    name,
    surname,
    password,
    passwordConfirm,
    loginError,
    registerErrors,
    handleSubmit,
    handleRegisterSubmit,
    handleEmailChange,
    handleNameChange,
    handleSurnameChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    closeModal,
  } = useAuth();

  const { term, searchRef, handleSearchChange, searchResults } = useSearch();

  return (
    <>
      <Layout
        header={{
          links: headerLinks,
          search: {
            value: term,
            onChange: handleSearchChange,
          },
          searchResult: searchResults,
          searchWrapperRef: searchRef,
          button: {
            title: userName ?? 'Войти',
            onClick: () => {
              if (userName) {
                navigate('/account');
              } else {
                setModalType('login');
              }
            },
            isAccountPage: location.pathname === '/account',
          },
        }}
        footer={{
          links: footerLinks,
        }}
      >
        {children}
      </Layout>
      <Modal modalType="user" isOpen={modalType !== null} onClose={closeModal}>
        {modalType === 'login' && (
          <div className="modal-log">
            <LogIn
              email={{
                value: email,
                onChange: handleEmailChange,
                icoPath: Mail(),
                placeholder: 'Электронная почта',
                type: 'email',
                theme: 'light',
              }}
              password={{
                value: password,
                onChange: handlePasswordChange,
                icoPath: Password(),
                placeholder: 'Пароль',
                type: 'password',
                theme: 'light',
              }}
              entry={{
                type: 'submit',
                title: 'Войти',
                onClick: () => {},
                variant: 'primary',
                subclass: 'bright',
                width: 'wide',
              }}
              registerButton={{
                title: 'Регистрация',
                onClick: () => setModalType('register'),
              }}
              onSubmit={handleSubmit}
            />
            {loginError && <div className="flex form-error">{loginError}</div>}
          </div>
        )}
        {modalType === 'register' && (
          <div className="modal-log">
            <RegisterForm
              email={{
                value: email,
                onChange: handleEmailChange,
                icoPath: Mail(),
                placeholder: 'Электронная почта',
                type: 'email',
                theme: 'light',
                error: registerErrors.email,
              }}
              name={{
                value: name,
                onChange: handleNameChange,
                icoPath: Name(),
                placeholder: 'Имя',
                type: 'text',
                theme: 'light',
                error: registerErrors.name,
              }}
              surname={{
                value: surname,
                onChange: handleSurnameChange,
                icoPath: Surname(),
                placeholder: 'Фамилия',
                type: 'text',
                theme: 'light',
                error: registerErrors.surname,
              }}
              password={{
                value: password,
                onChange: handlePasswordChange,
                icoPath: Password(),
                placeholder: 'Пароль',
                type: 'password',
                theme: 'light',
                error: registerErrors.password,
              }}
              passConfirm={{
                value: passwordConfirm,
                onChange: handlePasswordConfirmChange,
                icoPath: Password(),
                placeholder: 'Подтвердите пароль',
                type: 'password',
                theme: 'light',
                error: registerErrors.passwordConfirm,
              }}
              registerButton={{
                type: 'submit',
                title: 'Зарегистрироваться',
                onClick: () => {},
                variant: 'primary',
                subclass: 'bright',
                width: 'wide',
              }}
              onSubmit={handleRegisterSubmit}
            />
          </div>
        )}
      </Modal>
    </>
  );
};
