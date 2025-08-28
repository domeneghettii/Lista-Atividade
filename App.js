import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

    const [tarefas, setTarefas] = useState([]);
    const [novaTarefa, setNovaTarefa] = useState('');

    useEffect(() => {
        carregarTarefas();
    }, []);

    const carregarTarefas = async () => {
        try {
            const tarefasSalvas = await AsyncStorage.getItem('tarefas');
            if (tarefasSalvas) {
                setTarefas(JSON.parse(tarefasSalvas));
            }
        } catch (error) {
            console.log('Erro ao carregar tarefas Domesticas:', error);
        }
    };

    const salvarTarefas = async (novasTarefas) => {
        try {
            await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
        } catch (error) {
            console.log('Erro ao salvar tarefas Domesticas:', error);
        }
    };

    const adicionarTarefa = () => {
        if (novaTarefa.trim() === '') return;
        const novasTarefas = [...tarefas, { id: Date.now().toString(), texto: novaTarefa }];
        setTarefas(novasTarefas);
        salvarTarefas(novasTarefas);
        setNovaTarefa('');
    };

    const removerTarefa = (id) => {
        const novasTarefas = tarefas.filter(tarefa => tarefa.id !== id);
        setTarefas(novasTarefas);
        salvarTarefas(novasTarefas);
    };

    const limparTudo = async () => {
        try {
            await AsyncStorage.removeItem('tarefas');
            setTarefas([]);
        } catch (error) {
            console.log('Erro ao limpar tarefas Domesticas:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Tarefas Domésticas:</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite uma nova tarefa"
                    value={novaTarefa}
                    onChangeText={setNovaTarefa}
                />
                
                <Button title="Adicionar" onPress={adicionarTarefa} />
            </View>
            <Button title="Limpar Tudo" color="red" onPress={limparTudo} />
            {tarefas.length === 0 ? (
                <Text style={styles.mensagem}>Nenhuma tarefa cadastrada. Tente novamente!</Text>
            ) : (
                <FlatList
                    data={tarefas}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.tarefaItem}>
                            <Text>{item.texto}</Text>
                            <TouchableOpacity onPress={() => removerTarefa(item.id)}>
                                <Text style={styles.remover}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#a899dd7a'
    },

    titulo: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    inputContainer: {
        flexDirection: 'row',
        marginBottom: 12
    },
    
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#390552ff',
        padding: 13,
        marginRight: 13,
        borderRadius: 10
    },

    tarefaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },

    remover: {
        color: 'red',
        fontWeight: 'bold'
    },

    mensagem: {
        marginTop: 30,
        textAlign: 'center',
        color: '#888',
        fontSize: 16
    }
});