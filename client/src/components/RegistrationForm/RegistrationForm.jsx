
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Form,
  Input,
  Button
} from 'antd';
const { Title, Text } = Typography;
import styles from './RegistrationForm.module.css';

import { REGISTER_USER } from '../../graphql/mutations';

import { useCurrentUserContext } from '../../context/CurrentUser';

export default function Registration() {
  const { loginUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);
  const [register] = useMutation(REGISTER_USER);

  const handleFormSubmit = async (values) => {
    try {
      setDuplicateEmailError(false);
      const formValues = await form.validateFields();
      const { firstName, lastName, email, password } = formValues;
      const mutationResponse = await register({
        variables: {
          firstName,
          lastName,
          email,
          password,
        },
      });
      const { token, user } = mutationResponse.data.register;
      loginUser(user, token);
      navigate('/dashboard');
    } catch (e) {
      if (e?.message.includes("duplicate key error")) {
        // If error message indicates duplicate key error, set duplicateEmailError to true to alert user
        setDuplicateEmailError(true);
    // eslint-disable-next-line no-console
      console.log(e);
      }
    }
  };

  return (
    <Card bordered={false} style={{ width: 300 }} className={styles.registrationForm}>
      <Form
        form={form}
        id="registration-form"
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <Title>Register</Title>
        <Form.Item
          label="First name"
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Please input your first name',
            },
          ]}
        >
          <Input
     placeholder="First name"
          />
        </Form.Item>
        <Form.Item
          label="Last name"
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Please input your last name',
            },
          ]}
        >
          <Input
            placeholder="Last name"
          />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email address, this will be your username',
            },
          ]}
        >
          <Input
            placeholder="youremail@test.com"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            { min: 5, message: "Password must be at least 5 characters" },
          ]}
        >
          <Input.Password
            placeholder="******"
          />
        </Form.Item>
        {duplicateEmailError && (
          <Form.Item>
            <Text type="danger">
              An account with that email already exists.
            </Text>
          </Form.Item>
        )}
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
        <p>
          Already have an account? Login
          {' '}
          <Link to="/login">here</Link>
        </p>
      </Form>
    </Card>
  );
}
