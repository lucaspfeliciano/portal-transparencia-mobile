import React, {useState, useEffect} from 'react';
import { View, Alert, AsyncStorage, ScrollView, SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';

import api from '../services/api';

export default function List({navigation}) {

    const [orgaos, setOrgaos] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [pagina, setPagina] = useState('');


    useEffect(() => {
        AsyncStorage.getItem('orgao').then(orgao => {
            const orgaoList = JSON.parse(orgao);
            setOrgaos(orgaoList)
        })
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('descricao').then(descricao => {

            setDescricao(descricao);
        })
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('pagina').then(pagina => {

            setPagina(pagina);
        })
    }, []);


    async function handleSubmit(codigo) {
        await AsyncStorage.setItem('codigo', codigo);

        navigation.navigate('Dates')
    }

    async function nextPage() {
        let paginacao = parseInt(pagina);
        let proxPag = paginacao + 1;
        const pagString = String(proxPag);
        await AsyncStorage.setItem('pagina', pagString)
        setPagina(pagString)
        const response = await api.get(`orgaos-siafi?descricao=${descricao}&pagina=${pagString}`);
        const stringResponse = JSON.stringify(response.data);
        if (stringResponse == '[]') {
            Alert.alert('Não foram achados outros órgãos!')
        } else {
            await AsyncStorage.setItem('orgao', stringResponse);
            setOrgaos(response.data)
        }
    }

    async function previousPage() {
        let paginacao = parseInt(pagina);
        let pagAnterior = paginacao - 1;
        if (pagAnterior <= 0){
            Alert.alert('Não existe página anterior')
        } else {
            const pagString = String(pagAnterior);
            await AsyncStorage.setItem('pagina', pagString)
            setPagina(pagString)

            const response = await api.get(`orgaos-siafi?descricao=${descricao}&pagina=${pagString}`);

            await AsyncStorage.setItem('orgao', JSON.stringify(response.data));
            setOrgaos(response.data)
        }
    }
    
    
 
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.label}>
            <Text style={styles.label}>Selecione o órgão desejado:</Text>
                {orgaos.map(orgao =>
                    <TouchableOpacity onPress={() => handleSubmit(orgao.codigo)} key={ orgao.codigoDescricaoFormatado } style={styles.buttonList}>
                        <Text style={styles.buttonListText}>{ orgao.codigoDescricaoFormatado }</Text>
                    </TouchableOpacity>)}
                    <View style={styles.viewButton}>
                    <TouchableOpacity onPress={previousPage} style={styles.buttonPagina}>
                        <Text style={styles.buttonPaginaText}>Anterior</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextPage} style={styles.buttonPagina}>
                        <Text style={styles.buttonPaginaText}>Próxima</Text>
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {navigation.navigate('Home')}} style={styles.button}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
                </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

    label: {
        fontWeight: 'bold',
        color: '#f05a5b',
        marginBottom: 8,
        marginTop: 4,
        fontSize: 16,
    },

    buttonList: {
        height: 70,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginTop: 2,
        marginHorizontal: 4,
        marginBottom: 6,
        borderWidth: 2,
        borderColor: '#f05a5b'

    },

    button: {
        height: 42,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginTop: 2,
        marginBottom: 6,
        marginHorizontal: 4,
    },

    buttonPagina: {
        height: 42,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginHorizontal: 6,
    },

    buttonListText: {
        color: '#f05a5b',
        fontSize: 14,
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },

    buttonPaginaText: {
        color: '#f05a5b',
        fontWeight: 'bold',
        fontSize: 14,
    },

    viewButton: {
        height: 42,
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 4,
        borderRadius: 2,
        marginTop: 2,
        marginBottom: 6,
        justifyContent: 'center',
        alignItems: 'center',
    }

});
