import { TextInput, StyleSheet } from 'react-native';

export const InputCell = ({ placeholder, value, onChangeText, keyboardType, secureTextEntry, autoCapitalize }) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        fontSize: 16,
        color: '#1E3A8A',
    },
});