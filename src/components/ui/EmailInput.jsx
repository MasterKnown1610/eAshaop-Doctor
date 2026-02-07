import React from 'react';
import Input from './Input';

const EmailInput = ({
  value,
  onChangeText,
  placeholder = 'Enter your email',
  label = 'Email',
  error,
  ...props
}) => (
  <Input
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    label={label}
    error={error}
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    {...props}
  />
);

export default EmailInput;
