import React, {useState, useEffect} from 'react';
import { View, Alert, AsyncStorage, ScrollView, KeyboardAvoidingView,SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import api from '../services/api';

export default function TripList({navigation}) {
    const [dataIdaDe, setDataIdaDe] = useState('');
    const [valorViagens, setValorViagens] = useState('');
    const [dataIdaAte, setDataIdaAte] = useState('');
    const [dataRetornoDe, setDataRetornoDe] = useState('');
    const [dataRetornoAte, setDataRetornoAte] = useState('');
    const [codigo, setCodigo] = useState('');
    const [paginaTrip, setPaginaTrip] = useState('');
    const [total, setTotal] = useState(0);

    const [viagens, setViagens] = useState([]);
    let valorTotalGasto = 0;
    async function handleSubmit(viagemSelecionada) {

        await AsyncStorage.setItem('viagemSelecionada', JSON.stringify(viagemSelecionada));
        
        navigation.navigate('Trip');
    }

    async function nextPage() {
        let paginacao = parseInt(paginaTrip);
        let proxPag = paginacao + 1;
        const pagString = String(proxPag);
        await AsyncStorage.setItem('paginaTrip', pagString)
        setPaginaTrip(pagString)

        const response = await api.get(`viagens?dataIdaDe=${dataIdaDe}&dataIdaAte=${dataIdaAte}&dataRetornoDe=${dataRetornoDe}&dataRetornoAte=${dataRetornoAte}&codigoOrgao=${codigo}&pagina=${pagString}`);
        const stringResponse = JSON.stringify(response.data);
        
        if (stringResponse == '[]') {
            Alert.alert('Não foram achados outras viagens!')
        } else {
            
        
        await AsyncStorage.setItem('viagens', JSON.stringify(response.data));
        setViagens(response.data)
        if (proxPag == 2) {
        await AsyncStorage.getItem('valorTotal').then(totalValue => {
            let floatTotal = parseFloat(totalValue) + valorTotalGasto;
            async () => {await AsyncStorage.setItem('valorFinal', String(floatTotal))}
            setTotal(floatTotal);
        })
        
        
        }
        if(proxPag > 2) {
            await AsyncStorage.getItem('valorTotal').then(valorAtual => {
                setTotal(parseFloat(valorAtual) + total)
            })
        }
    }
        }

    async function previousPage() {
        
        let paginacao = parseInt(paginaTrip);
        let pagAnterior = paginacao - 1;
        if (pagAnterior <= 0) {
            Alert.alert('Não existe página anterior')
        } else {
            const pagString = String(pagAnterior);
            await AsyncStorage.setItem('paginaTrip', pagString)
            setPaginaTrip(pagString)
        
            const response = await api.get(`viagens?dataIdaDe=${dataIdaDe}&dataIdaAte=${dataIdaAte}&dataRetornoDe=${dataRetornoDe}&dataRetornoAte=${dataRetornoAte}&codigoOrgao=${codigo}&pagina=${pagString}`);

            await AsyncStorage.setItem('viagens', JSON.stringify(response.data));
            setViagens(response.data)
            
            setTotal(total - valorTotalGasto)
        }
    
    }
    async function somaValores() {
     
        for (let i = 0; i < viagens.length; i++) {
            valorTotalGasto += viagens[i].valorTotalViagem;       
        }
        await AsyncStorage.setItem('valorTotal', String(valorTotalGasto));
        if (paginaTrip == '1') {
            setTotal(valorTotalGasto);
        }
    }

    
    useEffect(() => {
        AsyncStorage.getItem('viagens').then(viagem => {
            const viagemList = JSON.parse(viagem);
            setViagens(viagemList)

        })
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('valorViagens').then(valorViagens => {
            setValorViagens(valorViagens);
        })
    
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('dataIdaDe').then(dataIdaDe => {
            setDataIdaDe(dataIdaDe);
        })
    
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('dataIdaAte').then(dataIdaAte => {
            setDataIdaAte(dataIdaAte);
        })
    
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('dataRetornoDe').then(dataRetornoDe => {
            setDataRetornoDe(dataRetornoDe);
        })
    
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('dataRetornoAte').then(dataRetornoAte => {
            setDataRetornoAte(dataRetornoAte);
        })
    
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('codigo').then(codigo => {
            setCodigo(codigo);
        })
    
    }, []);
    useEffect(() => {
        AsyncStorage.getItem('paginaTrip').then(paginaTrip => {
            setPaginaTrip(paginaTrip);
        })
    
    }, []);
    somaValores();
 
    return (
        
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.label}>
                <Text style={styles.label}>Valor Total Gasto em Viagens pelo Orgão: R${total}</Text>

                {viagens.map(viagem =>
                    <TouchableOpacity onPress={() => handleSubmit(viagem)} key={ viagem.id } style={styles.buttonList}>
                        <Text style={styles.buttonListText}>Beneficiario: { viagem.pessoa.nome }</Text>
                        <Text style={styles.buttonListText}>Data da Viagem: { viagem.dataInicioAfastamento } - {viagem.dataFimAfastamento}</Text>
                        <Text style={styles.buttonListText}>Valor da viagem: R${ viagem.valorTotalViagem }</Text>
                    </TouchableOpacity>)}
                    <View style={styles.viewButton}>
                    <TouchableOpacity onPress={previousPage} style={styles.buttonPagina}>
                        <Text style={styles.buttonPaginaText}>Anterior</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextPage} style={styles.buttonPagina}>
                        <Text style={styles.buttonPaginaText}>Próxima</Text>
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {navigation.navigate('Dates')}} style={styles.button}>
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
