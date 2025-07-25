import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import { InputCell } from '../components/InputCell';
import { auth, db } from '../utils/firebaseConfig.client';
import firebase from 'firebase/compat/app';

export const FeedbackScreen = () => {
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitFeedback = async () => {
        if (!feedback.trim()) {
            Alert.alert('Error', 'Please enter feedback.');
            return;
        }

        setLoading(true);
        try {
            await firebase.firestore().collection('feedback').add({
                userId: auth.currentUser.uid,
                feedback: feedback.trim(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Success', 'Feedback submitted!');
            setFeedback('');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Submit Feedback</Text>
            <InputCell
                placeholder="Enter your feedback"
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={5}
            />
            <Button
                title={loading ? 'Submitting...' : 'Submit Feedback'}
                onPress={handleSubmitFeedback}
                disabled={loading}
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