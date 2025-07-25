import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Button } from '../components/Button';
import { InputCell } from '../components/InputCell';
import { Card } from '../components/Card';
import { auth, db } from '../utils/firebaseConfig.client';
import firebase from 'firebase/compat/app';
import moment from 'moment';

export const CaregiverDashboard = () => {
    const [patientId, setPatientId] = useState('');
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState('');
    const [frequency, setFrequency] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = firebase.firestore().collection('schedules').where('caregiverId', '==', auth.currentUser.uid);
        const unsubscribe = q.onSnapshot((snapshot) => {
            const schedulesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSchedules(schedulesData);
        }, (error) => {
            console.error('Firestore snapshot error:', error);
        });
        return unsubscribe;
    }, []);

    const handleCreateSchedule = async () => {
        if (!patientId || !medicationName || !dosage || !time || !frequency) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            await firebase.firestore().collection('schedules').add({
                patientId,
                caregiverId: auth.currentUser.uid,
                medicationName,
                dosage,
                time,
                frequency,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Success', 'Schedule created!');
            setPatientId('');
            setMedicationName('');
            setDosage('');
            setTime('');
            setFrequency('');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderSchedule = ({ item }) => (
        <Card>
            <Text style={styles.scheduleText}>Medication: {item.medicationName}</Text>
            <Text style={styles.scheduleText}>Dosage: {item.dosage}</Text>
            <Text style={styles.scheduleText}>Time: {item.time}</Text>
            <Text style={styles.scheduleText}>Frequency: {item.frequency}</Text>
            <Text style={styles.scheduleText}>
                Created: {moment(item.createdAt?.toDate()).format('MMM D, YYYY')}
            </Text>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Caregiver Dashboard</Text>
            <Card>
                <Text style={styles.subtitle}>Create Medication Schedule</Text>
                <InputCell
                    placeholder="Patient ID"
                    value={patientId}
                    onChangeText={setPatientId}
                />
                <InputCell
                    placeholder="Medication Name"
                    value={medicationName}
                    onChangeText={setMedicationName}
                />
                <InputCell
                    placeholder="Dosage (e.g., 1 tablet)"
                    value={dosage}
                    onChangeText={setDosage}
                />
                <InputCell
                    placeholder="Time (e.g., 08:00 AM)"
                    value={time}
                    onChangeText={setTime}
                />
                <InputCell
                    placeholder="Frequency (e.g., Daily)"
                    value={frequency}
                    onChangeText={setFrequency}
                />
                <Button
                    title={loading ? 'Creating...' : 'Create Schedule'}
                    onPress={handleCreateSchedule}
                    disabled={loading}
                />
            </Card>
            <Text style={styles.subtitle}>Schedules</Text>
            <FlatList
                data={schedules}
                renderItem={renderSchedule}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No schedules found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1E3A8A',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E3A8A',
        marginVertical: 8,
    },
    scheduleText: {
        fontSize: 16,
        color: '#6B7280',
        marginVertical: 4,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 16,
    },
});