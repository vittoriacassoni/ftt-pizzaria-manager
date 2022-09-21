import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import ComboBox from 'react-native-combobox';

import {
  createTableVenda,
  obtemProduto,
  adicionaVenda,
} from '../../services/dbservice';
import styles from './styles';

export default function Sale() {

  const [id, setId] = useState();
  const [produtosVenda, setProdutosVenda ] = useState('');
  const [produtos, setProdutos] = useState([]);
  let tabelasCriadas = false;
  const values = [];

  async function processamentoUseEffect() {
    if (!tabelasCriadas) {
      console.log("Verificando necessidade de criar tabelas...");
      tabelasCriadas = true;
      await createTableVenda();
    }

    console.log("UseEffect...");
    await carregaDados();
  }

  useEffect(
    () => {
      console.log('executando useffect');
      processamentoUseEffect(); //necessário método pois aqui não pode utilizar await...
      obtemProduto().then((resposta) => {

        let produtos = resposta;
        setProdutos(produtos);
        console.log(produtos);

        values = produtos;
      });

    }, []);


    async function salvaDados() {
      if (!validaCampos())
        return;
  
      let data = new Date().toLocaleString();
      try {
        let obj = {
          codigo,
          produtosVenda,
          data
        };
  
        let resposta = (await adicionaVenda(obj));
  
        if (resposta)
          Alert.alert('Salvo com sucesso!');
        else
          Alert.alert('Falhou miseravelmente!');
      }
      catch (e) {
        Alert.alert(e.toString());
      }
    }
  
  function salvaProdutos(codigoProduto){
    let todosProdutos = produtosVenda + ',' + codigoProduto;
    setProdutosVenda(todosProdutos);
  }

  function carregaDados() {
    try {
      obtemProduto().then((resposta) => {

        let produtos = resposta;
        setProdutos(produtos);
        console.log(produtos);
      })

    } catch (e) {
      Alert.alert(e.toString());
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>VENDAS</Text>

      <View>
        <Text style={styles.labelCampo}>Código</Text>
        <TextInput style={styles.campoEdicao}
          onChangeText={(texto) => setId(texto)}
          value={id} />
      </View>

      <View>
        <Text style={styles.labelCampo}>Produto</Text>
        <ComboBox
                values={values}
                onValueSelect={(value) => setProdutos(value)}
            />
      </View>

     

      <View style={styles.areaBotao}>
        <TouchableOpacity style={[styles.botao, styles.sombra]}
          onPress={() => salvaDados()}
        >
          <Text style={styles.textoBotao}>Registrar venda</Text>
        </TouchableOpacity>

      </View>

      <StatusBar style="auto" />
    </View>
  );
}