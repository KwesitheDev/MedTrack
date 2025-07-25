import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { auth, db } from '../utils/firebaseConfig.client';
import firebase from 'firebase/compat/app';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

export const PatientDashboard = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const q = firebase.firestore().collection('schedules').where('patientId', '==', auth.currentUser.uid);
        const unsubscribe = q.onSnapshot((snapshot) => {
            const schedulesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSchedules(schedulesData);
            scheduleNotifications(schedulesData);
        }, (error) => {
            console.error('Firestore snapshot error:', error);
        });
        return unsubscribe;
    }, []);

    const scheduleNotifications = async (schedules) => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        for (const schedule of schedules) {
            const time = moment(schedule.time, 'hh:mm A');
            if (!time.isValid()) continue;

            const trigger = {
                hour: time.hour(),
                minute: time.minute(),
                repeats: schedule.frequency === 'Daily',
            };

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Medication Reminder: ${schedule.medicationName}`,
                    body: `Take ${schedule.dosage} at ${schedule.time}`,
                },
                trigger,
            });
        }
    };

    const handleMarkDose = async (scheduleId) => {
        setLoading((prev) => ({ ...prev, [scheduleId]: true }));
        try {
            await firebase.firestore().collection('doses').add({
                scheduleId,
                patientId: auth.currentUser.uid,
                taken: true,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Success', 'Dose marked as taken!');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading((prev) => ({ ...prev, [scheduleId]: false }));
        }
    };

    const renderSchedule = ({ item }) => (
        <Card>
            <Text style={styles.scheduleText}>Medication: {item.medicationName}</Text>
            <Text style={styles.scheduleText}>Dosage: {item.dosage}</Text>
            <Text style={styles.scheduleText}>Time: {item.time}</Text>
            <Text style={styles.scheduleText}>Frequency: {item.frequency}</Text>
            <Button
                title={loading[item.id] ? 'Marking...' : 'Mark Dose Taken'}
                onPress={() => handleMarkDose(item.id)}
                disabled={loading[item.id]}
            />
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patient Dashboard</Text>
            <Button
                title="Submit Feedback"
                variant="secondary"
                onPress={() => navigation.navigate('Feedback')}
            />
            <FlatList
                data={schedules}
                renderItem={renderSchedule}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No schedules assigned.</Text>}
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