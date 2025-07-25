import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform, View, StyleSheet, Alert, Text } from 'react-native';
import firebase from 'firebase/compat/app';
import { auth, db } from './src/utils/firebaseConfig.client';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { CaregiverDashboard } from './src/screens/CaregiverDashboard';
import { PatientDashboard } from './src/screens/PatientDashboard';
import { FeedbackScreen } from './src/screens/FeedbackScreen';
import { ChatScreen } from './src/screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setError('Firebase authentication not initialized.');
      setLoading(false);
      return;
    }

    const setupNotifications = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Notification permissions are required for reminders.');
        }
        if (Platform.OS !== 'web') {
          await Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: false,
            }),
          });
        }
      } catch (error) {
        console.error('Notification setup error:', error);
        setError('Failed to set up notifications.');
      }
    };

    setupNotifications();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setUser(user);
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            setRole(userDoc.data().role);
          } else {
            setRole(null);
          }
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#1E3A8A' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
          }}
        >
          {user ? (
            role === 'caregiver' ? (
              <>
                <Stack.Screen
                  name="CaregiverDashboard"
                  component={CaregiverDashboard}
                  options={{ title: 'Caregiver Dashboard' }}
                />
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{ title: 'Chat' }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="PatientDashboard"
                  component={PatientDashboard}
                  options={{ title: 'Patient Dashboard' }}
                />
                <Stack.Screen
                  name="Feedback"
                  component={FeedbackScreen}
                  options={{ title: 'Submit Feedback' }}
                />
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{ title: 'Chat' }}
                />
              </>
            )
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Log In' }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ title: 'Sign Up' }}
              />
            </>
          )}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    fontSize: 18,
    color: '#1E3A8A',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#B91C1C',
    textAlign: 'center',
    padding: 20,
  },
});