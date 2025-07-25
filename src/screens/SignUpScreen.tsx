import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import { InputCell } from '../components/InputCell';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase/compat/app';

export const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password || !role) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            await firebase.firestore().collection('users').doc(user.uid).set({
                email,
                role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Success', 'Account created! Please log in.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={role}
                    onValueChange={(value) => setRole(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Patient" value="patient" />
                    <Picker.Item label="Caregiver" value="caregiver" />
                </Picker>
            </View>
            <Button
                title={loading ? 'Signing Up...' : 'Sign Up'}
                onPress={handleSignUp}
                disabled={loading}
            />
            <Button
                title="Back to Login"
                variant="secondary"
                onPress={() => navigation.navigate('Login')}
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
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        marginVertical: 8,
    },
    picker: {
        height: 50,
        color: '#1E3A8A',
    },
});