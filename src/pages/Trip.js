import React, {useState, useEffect} from 'react';
import { View,TouchableOpacity,AsyncStorage, ScrollView, SafeAreaView, Text, StyleSheet } from 'react-native';

export default function Trip({navigation}) {
    const [viagem, setViagem] = useState([]);
    const [pessoa, setPessoa] = useState('');
    const [dimViagem, setDimViagem] = useState('');
  
    useEffect(() => {
        AsyncStorage.getItem('viagemSelecionada').then(viagemStorage => {
            const viagemSelecionada = JSON.parse(viagemStorage);
            setViagem(viagemSelecionada);
            setPessoa(viagemSelecionada.pessoa);
            setDimViagem(viagemSelecionada.dimViagem)
            
        })
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.view}>
                <Text style={styles.label}>Nome do beneficiário:</Text>
                <Text>{pessoa.nome}</Text>
                <Text style={styles.label}>Motivo da viagem:</Text>
                <Text>{dimViagem.motivo}</Text>
                <Text style={styles.label}>Data de inicio do afastamento:</Text>
                <Text>{viagem.dataInicioAfastamento}</Text>
                <Text style={styles.label}>Data de fim do afastamento:</Text>
                <Text>{viagem.dataFimAfastamento}</Text>
                <Text style={styles.label}>Valor total da viagem:</Text>
                <Text>R${viagem.valorTotalViagem}</Text>
                <Text style={styles.label}>Valor total de restituição: </Text>
                <Text>R${viagem.valorTotalRestituicao}</Text>
                <Text style={styles.label}>Valor total de taxas de agenciamento:</Text>
                <Text>R${viagem.valorTotalTaxaAgenciamento}</Text>
                <Text style={styles.label}>Valor total de multas:</Text>
    
                <Text>R${viagem.valorMulta}</Text>
                <Text style={styles.label}>Valor total de diárias:</Text>
                <Text>R${viagem.valorTotalDiarias}</Text>
                <Text style={styles.label}>Valor total de passagens:</Text>
                <Text>R${viagem.valorTotalPassagem}</Text>
                <Text style={styles.label}>Valor total de devoluções:</Text>
                <Text>R${viagem.valorTotalDevolucao}</Text>
                <View style={styles.viewButton}>  
                <TouchableOpacity onPress={() => {navigation.navigate('TripList')}} style={styles.button}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>            
                <TouchableOpacity onPress={() => {navigation.navigate('Home')}} style={styles.button}>
                    <Text style={styles.buttonText}>Nova Consulta</Text>
                </TouchableOpacity>
                </View> 
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f05a5b',
        flex: 1,
        marginTop: 20,
    },

    view: {
        borderRadius: 4,
        marginHorizontal: 6
    },

    label: {
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        marginTop: 4,
        fontSize: 15,
    },

    button: {
        height: 42,
        width: 150,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginHorizontal: 6,
        borderWidth:2,
        borderColor: '#FFF'
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    viewButton: {
        height: 42,
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 4,
        borderRadius: 2,
        marginTop: 15,
        marginBottom: 6,
        justifyContent: 'center',
        alignItems: 'center',
    }
});