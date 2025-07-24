import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
}

export const Button = ({ title, variant = 'primary', style, ...props }: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.button, variant === 'primary' ? styles.primary : styles.secondary, style]}
            {...props}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    primary: {
        backgroundColor: '#1E3A8A',
    },
    secondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#1E3A8A',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});