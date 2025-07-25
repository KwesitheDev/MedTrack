import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Button } from '../components/Button';
import { InputCell } from '../components/InputCell';
import { Card } from '../components/Card';
import { auth, db } from '../utils/firebaseConfig.client';
import firebase from 'firebase/compat/app';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const q = firebase.firestore()
            .collection('conversations')
            .orderBy('timestamp', 'asc')
            .limit(50);
        const unsubscribe = q.onSnapshot((snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(messagesData);
        }, (error) => {
            console.error('Firestore snapshot error:', error);
            Alert.alert('Error', 'Failed to load messages.');
        });
        return unsubscribe;
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            Alert.alert('Error', 'Please enter a message.');
            return;
        }

        setLoading(true);
        try {
            await firebase.firestore().collection('conversations').add({
                userId: auth.currentUser.uid,
                message: newMessage.trim(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setNewMessage('');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }) => (
        <Card style={[styles.messageCard, item.userId === auth.currentUser.uid ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.messageMeta}>
                {item.userId === auth.currentUser.uid ? 'You' : 'Other'} • {moment(item.timestamp?.toDate()).format('MMM D, YYYY h:mm A')}
            </Text>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat</Text>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No messages yet.</Text>}
                contentContainerStyle={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <InputCell
                    placeholder="Type a message"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                    style={styles.messageInput}
                />
                <Button
                    title={loading ? 'Sending...' : 'Send'}
                    onPress={handleSendMessage}
                    disabled={loading}
                />
            </View>
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
        textAlign: 'center',
    },
    messageList: {
        flexGrow: 1,
    },
    messageCard: {
        marginVertical: 4,
        padding: 12,
        maxWidth: '80%',
    },
    sentMessage: {
        backgroundColor: '#1E3A8A',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#1E3A8A',
    },
    messageMeta: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    messageInput: {
        flex: 1,
        marginRight: 8,
    },
});