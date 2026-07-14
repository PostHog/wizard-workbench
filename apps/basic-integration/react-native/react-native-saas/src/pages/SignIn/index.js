import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { usePostHog } from 'posthog-react-native';

import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { signInRequest } from '~/store/modules/auth/actions';

import styles from './styles';

export default function SignIn() {
  const dispatch = useDispatch();
  const posthog = usePostHog();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let refPassword = useRef(null);

  function handleSubmit() {
    posthog.capture('sign_in_submitted', {
      login_method: 'email',
      has_password: Boolean(password),
      is_demo_login: email === 'demo@test.com' && password === 'demo',
    });

    dispatch(signInRequest(email, password));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <View>
        <Text style={styles.title}>Sign In</Text>

        <Text style={styles.label}>E-MAIL</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          autoFocus
          returnKeyType="next"
          onSubmitEditing={() => {
            refPassword.focus();
          }}
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          returnKeyType="send"
          ref={el => {
            refPassword = el;
          }}
          onSubmitEditing={() => {
            handleSubmit();
          }}
        />

        <TouchableOpacity
          testID="sign-in-button"
          onPress={handleSubmit}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.demoHint}>
          <Text style={styles.demoHintText}>Demo credentials:</Text>
          <Text style={styles.demoCredentials}>demo@test.com / demo</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
