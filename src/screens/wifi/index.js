import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ref, onValue, update } from "firebase/database";
import { Button, IconButton, TextInput, RadioButton } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Banco de dados
import { db } from '../../../firebaseConfig';



export default function Wifi() {

    const navegacao = useNavigation();
    const [ssid, setSsid] = useState('');
    const [senha, setSenha] = useState('');
    const [wifiPreference, setWifiPreference] = useState('');

    const updateData = () => {
        try {
            update(ref(db, 'wifi'), {
                ssid: ssid,
                senha: senha
            })
            navegacao.goBack();
            Alert.alert("Sucesso", "Dados do Wifi foram atualizados com sucesso", [{ text: "Ok" }]);
        } catch (error) {
            Alert.alert("Erro", error.message, [{ text: "Ok" }]);
        }
    }

    const updateWifiPreference = (preference) => {
        try {
            update(ref(db, 'wifi'), {
                preference: preference
            });
            setWifiPreference(preference);
        } catch (error) {
            Alert.alert("Erro", error.message, [{ text: "Ok" }]);
        }
    }

    const readData = () => {
        try {
            const wifiPreferenceRef = ref(db, 'wifi/preference');

            onValue(wifiPreferenceRef, (snapshot) => {
                const dados = snapshot.val();
                setWifiPreference(dados);
            });
        } catch (error) {
            Alert.alert("Erro", error.message, [{ text: "Ok" }]);
        }

    }

    useFocusEffect(
        useCallback(() => {
            readData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <IconButton icon={'chevron-left'} size={36} iconColor={"#FFF"} onPress={() => navegacao.goBack()} style={styles.botaoVoltar} />
            <Text style={styles.titulo}>WIFI</Text>
            <View style={styles.containerOpcoes}>
                <View style={styles.opcao}>
                    <Text style={styles.texto}>Padrão</Text>
                    <RadioButton
                        value={"Default"}
                        color={"#D35400"}
                        status={wifiPreference === 'Default' ? 'checked' : 'unchecked'}
                        onPress={() => updateWifiPreference("Default")}
                    />
                </View>
                <View style={styles.opcao}>
                    <Text style={styles.texto}>Minha Preferência</Text>
                    <RadioButton
                        value={"MyPreference"}
                        color={"#D35400"}
                        status={wifiPreference === "MyPreference" ? 'checked' : 'unchecked'}
                        onPress={() => updateWifiPreference("MyPreference")}
                    />
                </View>
            </View>
            {wifiPreference == "MyPreference" &&
                <View>
                    <TextInput
                        placeholder={"SSID"}
                        style={styles.inputs}
                        onChangeText={setSsid}
                    />
                    <TextInput
                        placeholder={"SENHA"}
                        onChangeText={setSenha}
                        style={styles.inputs}
                    />
                    <Button labelStyle={styles.textoBotaoEnviar} style={styles.botaoEnviar} onPress={() => { updateData() }}>
                        Enviar
                    </Button>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#283747',
        justifyContent: "center"
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: "#FFF",
        letterSpacing: 1,
        alignSelf: "center",
        marginVertical: 25,
        borderBottomWidth: 2,
        borderColor: "#FFF"
    },
    botaoVoltar: {
        margin: 0,
        position: "absolute",
        top: 0,
        left: 0
    },
    containerOpcoes:{
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-around"
    },
    opcao:{
        flexDirection: 'row', 
        alignItems: 'center', 
        margin: 6
    },
    inputs:{
        margin: 10
    },
    texto:{
        fontSize: 16, 
        color: "#FFF"
    },
    botaoEnviar:{
        backgroundColor: "#D35400", 
        borderRadius: 6, 
        marginTop: 20, 
        marginHorizontal: 10
    },
    textoBotaoEnviar:{
        color: "#FFF", 
        fontSize: 18
    }
})