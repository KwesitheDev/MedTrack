import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    placeholder: string;
}

export const Input = ({ placeholder, style, ...props }: InputProps) => {
    return (
        <TextInput
            style={[styles.input, style]}
            placeholder={placeholder}
            placeholderTextColor="#6B7280"
            {...props}
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
        fontSize: 16,
        marginVertical: 8,
        color: '#1E3A8A',
    },
});