import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { ref, onValue } from "firebase/database";
import { LineChart } from "react-native-gifted-charts";
import { Dimensions } from "react-native";
import { Icon, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Banco de dados
import { db } from '../../../firebaseConfig';


// Tamanho horizontal da tela
const screenWidth = Dimensions.get('window').width;

export default function Home() {
    const [temperaturas, setTemperaturas] = useState([{ "value": 1 }]);
    const [umidades, setUmidades] = useState([{ "value": 1 }]);
    const navegacao = useNavigation();
    
    // Trás os dados do banco
    const readData = () => {
        const temperaturasRef = ref(db, 'temperaturas');
        const umidadesRef = ref(db, 'umidades');


        onValue(temperaturasRef, (snapshot) => {
            const dados = snapshot.val();

            if (dados && typeof dados === 'object') {

                const temp = Object.values(dados);
                let dadosTratados = [];
                temp.map((item) => (
                    dadosTratados.push({ value: item })
                ));

                if (dadosTratados.length > 5) {
                    setTemperaturas(dadosTratados.slice(-5));
                } else {
                    setTemperaturas(dadosTratados);
                }
            }
        });


        onValue(umidadesRef, (snapshot) => {
            const dados = snapshot.val();

            if (dados && typeof dados === 'object') {
                const umid = Object.values(dados);
                let dadosTratados = [];
                umid.map((item) => (
                    dadosTratados.push({ value: item })
                ));

                if (dadosTratados.length > 5) {
                    setUmidades(dadosTratados.slice(-5)); // Pegar os últimos 5 valores, se houver mais de 5
                } else {
                    setUmidades(dadosTratados);
                }
            }
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#000"} />
            <View style={styles.containerTitulo}>
                <Icon source={"weather-windy"} size={30} color={"#FFF"} />
                <Text style={styles.titulo}>AirControl</Text>
                <IconButton icon={"wifi"} size={32} style={styles.botaoWifi} iconColor={"#FFF"} onPress={()=>navegacao.navigate("Wifi")}/>
                <IconButton icon={'reload'} style={styles.botaoReload} size={32} iconColor={"#FFF"} onPress={() => readData()} />
            </View>
            <View style={styles.containerGraficos}>
                <View>
                    <View style={styles.containerTituloGraficoTemperatura}>
                        <Text style={styles.tituloGrafico}>TEMPERATURA</Text>
                    </View>
                    <LineChart
                        data={temperaturas.length > 0 ? temperaturas : [{ value: 1 }]}
                        height={250}
                        showValuesAsDataPointsText
                        hideRules
                        thickness={3}
                        spacing={44}
                        initialSpacing={25}
                        dataPointsRadius={5}
                        color={"#F39C12"}
                        textColor={"#fff"}
                        dataPointsHeight={8}
                        dataPointsWidth={10}
                        dataPointsColor={"#873600"}
                        yAxisTextStyle={{ color: "lightgray" }}
                        textShiftY={-2}
                        textShiftX={-5}
                        textFontSize={16}
                        backgroundColor={"#EC7063"}
                        width={screenWidth * 0.80}
                        yAxisOffset={temperaturas.length > 1 ? 5 : 0}
                    />
                </View>
                <View>
                    <View style={styles.containerTituloGraficoUmidade}>
                        <Text style={styles.tituloGrafico}>UMIDADE</Text>
                    </View>
                    <LineChart
                        data={umidades.length > 0 ? umidades : [{ value: 1 }]}
                        height={250}
                        showValuesAsDataPointsText
                        hideRules
                        thickness={3}
                        spacing={44}
                        initialSpacing={25}
                        color={"#FBFCFC"}
                        textColor={"#000"}
                        dataPointsRadius={5}
                        dataPointsHeight={8}
                        dataPointsWidth={10}
                        dataPointsColor={"#0E6655"}
                        yAxisTextStyle={{ color: "lightgray" }}
                        textShiftY={-2}
                        textShiftX={-5}
                        textFontSize={16}
                        backgroundColor={"#85C1E9"}
                        width={screenWidth * 0.80}
                        yAxisOffset={umidades.length > 1 ? 5 : 0}
                    />
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    botaoWifi:{
        position: 'absolute',
        right: 50
    },
    botaoReload: {
        position: 'absolute',
        right: 0
    },
    containerTitulo: {
        alignItems: 'center',
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#283747'
    },
    titulo: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff'
    },
    containerGraficos: {
        justifyContent: 'space-around',
        flex: 1,
        backgroundColor: '#283747'
    },
    containerTituloGraficoTemperatura: {
        backgroundColor: '#ff000b',
        alignSelf: 'center',
        marginVertical: 6,
        padding: 6,
        borderRadius: 6,
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderColor: '#ff000b'
    },
    containerTituloGraficoUmidade: {
        backgroundColor: '#007bff',
        alignSelf: 'center',
        marginVertical: 6,
        padding: 6,
        borderRadius: 6,
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderColor: '#007bff',
    },
    tituloGrafico: {
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 1
    }
});