import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import { InputCell } from '../components/InputCell';
import firebase from 'firebase/compat/app';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <InputCell
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <InputCell
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging In...' : 'Log In'}
        onPress={handleLogin}
        disabled={loading}
      />
      <Button
        title="Go to Sign Up"
        variant="secondary"
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
});