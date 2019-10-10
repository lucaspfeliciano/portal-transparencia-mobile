import React, {useState, useEffect} from 'react';
import { View,AsyncStorage, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import api from '../services/api';




export default function Dates({ navigation }) {

    const [dataIdaDe, setDataIdaDe] = useState('01/04/2019');
    const [dataIdaAte, setDataIdaAte] = useState('30/04/2019');
    const [dataRetornoDe, setDataRetornoDe] = useState('01/04/2019');
    const [dataRetornoAte, setDataRetornoAte] = useState('30/04/2019');
    const [codigo, setCodigo] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('codigo').then(codigo => {
            setCodigo(codigo);
        })
    
    }, []);
 

    async function handleSubmit() {
        const formato = 'DD/MM/YYYY'
        let dataIdaDeSelecionada = moment(dataIdaDe, formato);
        let dataIdaAteSelecionada = moment(dataIdaAte, formato);
        let dataRetornoDeSelecionada = moment(dataRetornoDe, formato);
        let dataRetornoAteSelecionada = moment(dataRetornoAte, formato);

        if (dataIdaDe == '' || dataIdaAte == '' || dataRetornoDe == '' || dataRetornoAte == ''){
            Alert.alert('Data Invalida', 'Todos os campos devem ser preenchidos')
        } else if (dataRetornoAteSelecionada.diff(dataIdaDeSelecionada, 'days') > 30 || dataIdaAteSelecionada.diff(dataIdaDeSelecionada, 'days') >              30 || dataRetornoAteSelecionada.diff(dataRetornoDeSelecionada, 'days') > 30 ) {
                
            Alert.alert('Data Invalida', 'Período entre datas não pode ser maior que 1 mês')            
        } else if  (dataRetornoAteSelecionada.diff(dataIdaDeSelecionada, 'days') < 0 || dataIdaAteSelecionada.diff(dataIdaDeSelecionada, 'days') < 0                || dataRetornoAteSelecionada.diff(dataRetornoDeSelecionada, 'days') < 0 ) {
            Alert.alert('Data Invalida', 'Data de ida não pode ser inferior à data de volta')
            
        } else {
        
            const response = await api.get(`viagens?dataIdaDe=${dataIdaDe}&dataIdaAte=${dataIdaAte}&dataRetornoDe=${dataRetornoDe}&dataRetornoAte=${dataRetornoAte}&codigoOrgao=${codigo}&pagina=1`);
            const responseString = JSON.stringify(response.data);
            if (responseString == '[]'){
                Alert.alert('Nenhuma viagem encontrada');
            } else { 
                await AsyncStorage.setItem('viagens', responseString);
                await AsyncStorage.setItem('dataIdaDe', dataIdaDe);
                await AsyncStorage.setItem('dataIdaAte', dataIdaAte);
                await AsyncStorage.setItem('dataRetornoDe', dataRetornoDe);
                await AsyncStorage.setItem('dataRetornoAte', dataRetornoAte);
                await AsyncStorage.setItem('codigo', codigo);
                await AsyncStorage.setItem('paginaTrip', "1");

                navigation.navigate('TripList');
            }
        }
    }
  
    return(
        <KeyboardAvoidingView behavior="padding" style={styles.container}>

        <Text style={styles.labelTitle}>Selecione as datas:</Text>
    
            <View style={styles.form}>
                <Text style={styles.label}>Data de ida a partir de: *</Text>
                <DatePicker 
          style={{width: 290}}
          date={dataIdaDe} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD/MM/YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 6
            },
            dateInput: {
              marginLeft: 48,
            }
          }}
          onDateChange={(date) => {setDataIdaDe(date)}}
        />
                <Text style={styles.label}>Data de ida até: *</Text>
                <DatePicker
          style={{width: 290}}
          date={dataIdaAte} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD/MM/YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 6
            },
            dateInput: {
              marginLeft: 48
            }
          }}
          onDateChange={(date) => {setDataIdaAte(date)}}
        />
                <Text style={styles.label}>Data de retorno a partir de: *</Text>
                <DatePicker
          style={{width: 290}}
          date={dataRetornoDe} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD/MM/YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 6
            },
            dateInput: {
              marginLeft: 48
            }
          }}
          onDateChange={(date) => {setDataRetornoDe(date)}}
        />
                <Text style={styles.label}>Data de retorno até: *</Text>
                <DatePicker
          style={{width: 290}}
          date={dataRetornoAte} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD/MM/YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 6
            },
            dateInput: {
              marginLeft: 48
            }
          }}
          onDateChange={(date) => {setDataRetornoAte(date)}}
        />
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Buscar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => {navigation.navigate('List')}} style={styles.button}>
                        <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    form: {
        alignSelf: 'stretch',
        paddingHorizontal: 30,
        marginTop: 30
    },

    labelTitle: {
        fontWeight: 'bold',
        color: '#f05a5b',
        marginBottom: 8,
        marginTop: 8,
        fontSize: 18
    },

    label: {
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
        marginTop: 8
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 20,
        borderRadius: 2
    },
    button: {
        height: 42,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginTop: 25,
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});