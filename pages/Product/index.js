import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, Keyboard } from 'react-native';

import {
  createTableProduto,
  obtemProduto,
  adicionaProduto,
  alteraProduto,
  excluiProduto,
  excluiTodosProdutos,
} from '../../services/dbservice';
import styles from './styles';

export default function Produto() {

  const [id, setId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [produtos, setProdutos] = useState([]);
  let tabelasCriadas = false;

  async function processamentoUseEffect() {
    if (!tabelasCriadas) {
      console.log("Verificando necessidade de criar tabelas...");
      tabelasCriadas = true;
      await createTableProduto();
    }

    console.log("UseEffect...");
    await carregaDados();
  }

  useEffect(
    () => {
      console.log('executando useffect');
      processamentoUseEffect(); //necessário método pois aqui não pode utilizar await...
    }, []);


  async function salvaDados() {

    if (!validaCampos())
      return;
    try {
      let obj = {
        id,
        descricao,
        valor,
      };

      let resposta = (await adicionaProduto(obj));

      if (resposta)
        Alert.alert('Adicionado com sucesso!');
      else
        Alert.alert('Falhou!');
    }      
    catch (e) {
      Alert.alert(e);
    }
    Keyboard.dismiss();
  }

  function validaCampos() {

    if (id.length == 0  || id <=0 )
    {
      Alert.alert('Código deve ser maior que zero.');
      return false;
    }

    if (descricao.length == 0) {
      Alert.alert('Informe a descrição.');
      return false;
    }

    if (valor.length == 0) {
      Alert.alert('Informe um valor.');
      return false;
    }

    return true;
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

  function editar(identificador) {
    const produto = produtos.find(produto => produto.id == identificador);

    if (produto != undefined) {
      setId(produto.id);
      setDescricao(produto.descricao);
      setValor(produto.valor);
    }

    console.log(produto);
  }

  async function limparCampos() {
    setDescricao('');
    setValor('');
    setId('');
    Keyboard.dismiss();
  }

  async function efetivaExclusao() {
    try {
      await excluiTodosProdutos();
      await carregaDados();
    }
    catch (e) {
      Alert.alert(e);
    }
  }

  function apagarTudo() {
    if (Alert.alert('Confirma a exclusão de todos os produtos?',
      [
        {
          text: 'Sim, confirmo!',
          onPress: () => {
            efetivaExclusao();
          }
        },
        {
          text: 'Não!',
          style: 'cancel'
        }
      ]));
  }

  async function efetivaRemoverProduto(identificador) {
    try {
      await excluiProduto(identificador);
      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
      Alert.alert('Produto apagado com sucesso!');
    } catch (e) {
      Alert.alert(e);
    }
  }

  function removerElemento(identificador) {
    Alert.alert('Atenção', 'Confirma a remoção do produto?',
      [
        {
          text: 'Sim',
          onPress: () => efetivaRemoverProduto(identificador),
        },
        {
          text: 'Não',
          style: 'cancel',
        }
      ]);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>PRODUTOS</Text>

      <View>
        <Text style={styles.labelCampo}>Código</Text>
        <TextInput style={styles.campoEdicao}
          onChangeText={(texto) => setId(texto)}
          value={id} />
      </View>

      <View>
        <Text style={styles.labelCampo}>Descrição</Text>
        <TextInput style={styles.campoEdicao}
          onChangeText={(texto) => setDescricao(texto)}
          value={descricao} />
      </View>

      <View style={styles.areaTelefone}>
          <Text style={styles.labelCampo}> Preço unitário</Text>
          <TextInput style={styles.campoEdicao}
            onChangeText={(texto) => setValor(texto)}
            value={valor}
            keyboardType='numeric' />
        </View>

        <View style={styles.areaBotao}>
          <TouchableOpacity style={[styles.botao, styles.sombra]}
            onPress={() => salvaDados()}
          >
            <Text style={styles.textoBotao}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao, styles.sombra]}
            onPress={() => limparCampos()}>
            <Text style={styles.textoBotao}>Limpar</Text>
          </TouchableOpacity>

        </View>

      <StatusBar style="auto" />
    </View>
  );
}