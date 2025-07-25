import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../components/Card';

export const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Card>
                <Text style={styles.title}>Welcome to MedTrack</Text>
                <Text style={styles.subtitle}>Your medication reminder and caregiver system</Text>
            </Card>
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
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
});